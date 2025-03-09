export const createCheckoutSession = async (req, res) => {
    try {
        const { products, couponCode } = req.body
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Invalid or empty products" });
        }

        let totalAmount = 0;
        const lineItems = products.map(product => {
            const amount = Math.round(product.price)
            totalAmount += amount

            return {
                price_data: {
                    currency: "vnd",
                    product_data: {
                        name: product.name,
                        images: [product.image],
                    },
                    unit_amount: amount,
                },
                // quantity: product.quantity,
            }
        })

        let coupon = null
        if (couponCode) {
            coupon = await Coupon.findOne({ code: couponCode, userId: req.userId, isActive: true })
            if (!coupon) {
                return res.status(400).json({ message: "Invalid coupon" });
            }
            totalAmount = totalAmount - (totalAmount * coupon.discount / 100)
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`,
            discounts: coupon ? [{ coupon: await creatStripeCoupon(coupon.discount) }] : [],
            metadata: {
                userId: req.user._id.toString(),
                couponCode: couponCode || "",
            }
        });
    } catch (error) {
        console.log("error from createCheckoutSession", error.message);
        res.status(500).json({ message: "Internal server error" });
    }

}

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
}