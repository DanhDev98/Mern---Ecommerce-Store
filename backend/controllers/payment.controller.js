import { stripe } from "../lib/stripe.js";
import Coupon from "../model/coupon.model.js";
import Order from "../model/order.model.js";
export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Invalid or empty products" });
    }

    let totalAmount = 0;
    const lineItems = products.map((product) => {
      const amount = Math.round(product.price);
      totalAmount += amount;

      return {
        price_data: {
          currency: "vnd",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: amount,
        },
        quantity: product.quantity || 1,
      };
    });

    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.userId,
        isActive: true,
      });
      if (!coupon) {
        return res.status(400).json({ message: "Invalid coupon" });
      }
      totalAmount = totalAmount - (totalAmount * coupon.discount) / 100;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      discounts: coupon
        ? [{ coupon: await creatStripeCoupon(coupon.discount) }]
        : [],
      metadata: {
        userId: req.user._id.toString(),
        couponCode: couponCode || "",
        products: JSON.stringify(
          products.map((p) => ({
            id: p._id,
            quantity: p.quantity,
            price: p.price,
          }))
        ),
      },
    });

    if (totalAmount >= 1000000) {
      await createNewCoupon(req.user._id);
    }
    res.json({ id: session.id, totalAmount });
  } catch (error) {
    console.log("error from createCheckoutSession", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkoutSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === "paid") {
      // Do something here
      if (session.metadata.couponCode) {
        // Do something here
        await Coupon.findOneAndUpdate(
          {
            code: session.metadata.couponCode,
            userId: session.metadata.userId,
          },
          { isActive: false }
        );
      }
    }
    const products = JSON.parse(session.metadata.products);
    const newOrder = new Order({
      user: session.metadata.userId,
      products: products.map((p) => ({
        product: p.id,
        quantity: p.quantity,
        price: p.price,
      })),
      totalAmount: session.amount_total,
      stripeSessionId: sessionId,
    });

    await newOrder.save();
    res.json({
      message: "Order created successfully",
      orderId: newOrder._id,
      success: true,
    });
  } catch (error) {
    console.log("error from checkoutSuccess", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const creatStripeCoupon = async (discount) => {
  try {
    return await stripe.coupons.create({
      percent_off: discount,
      duration: "once",
    });
  } catch (error) {
    console.log("error from creatStripeCoupon", error.message);
    throw new Error("Internal server error");
  }
};

const createNewCoupon = async (userId) => {
  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discount: 20,
    expiration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    userId: userId,
  });
  await newCoupon.save();
  return newCoupon;
};
