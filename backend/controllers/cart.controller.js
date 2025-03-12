import Product from "../model/product.model.js";

export const getCartProducts = async (req, res) => {
    try {
        // ✅ Đảm bảo req.user.cartItems không bị undefined
        if (!req.user || !Array.isArray(req.user.cartItems)) {
            return res.status(400).json({ message: "Cart is empty or user not found" });
        }

        // ✅ Tìm sản phẩm theo ID trong giỏ hàng
        const products = await Product.find({ _id: { $in: req.user.cartItems.map(item => item.id) } });

        // ✅ Đảm bảo tìm được `cartItems` hợp lệ
        const cartItems = products.map(product => {
            const item = req.user.cartItems.find(cartItem => cartItem.id == product._id);
            return item ? { ...product.toJSON(), quantity: item.quantity } : null;
        }).filter(item => item !== null); // Xóa các giá trị null nếu không tìm thấy sản phẩm phù hợp

        res.json(cartItems);
    } catch (error) {
        console.log("Error from getCartProducts:", error.message);
        res.status(500).json({ message: "Server Error" });
    }
};

export const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user; // Lấy user từ middleware auth
        console.log("User:", user);

        if (!user.cartItems) {
            user.cartItems = []; // ✅ Đảm bảo `cartItems` luôn tồn tại 
        }

        // Kiểm tra sản phẩm đã có trong giỏ chưa
        const existingProduct = user.cartItems.find(item => item.product === productId);

        if (existingProduct) {
            existingProduct.quantity += 1; // ✅ Tăng số lượng nếu sản phẩm đã có
        } else {
            user.cartItems.push(productId);
            ; // ✅ Đúng schema
        }

        await user.save(); // ✅ Lưu vào MongoDB
        res.json({ message: "Add to cart success", cart: user.cartItems });
    } catch (error) {
        console.error("Error from addToCart:", error.message);
        res.status(500).json({ message: "Server Error" });
    }
};



export const removeProductFromCart = async (req, res) => {
    try {
        const { productId } = req.body
        const user = req.user
        if (!productId) {
            user.cartItems = []
        } else {
            user.cartItems = user.cartItems.filter(item => item.id != productId)
        }
        await user.save()
        res.status(200).json(user.cartItems)
    } catch (error) {
        console.log("Error from removeProductFromCart", error.message);
        res.status(500).json({ message: "Server Error" })
    }
}


export const updateQuantity = async (req, res) => {
    try {
        const { id: productId } = req.params
        const user = req.user
        const { quantity } = req.body
        const existingProduct = user.cartItems.find(item => item.id == productId)
        if (existingProduct) {
            if (quantity == 0) {
                user.cartItems = user.cartItems.filter(item => item.id != productId)
                await user.save()
                return res.json(user.cartItems)
            }
            existingProduct.quantity = quantity
            await user.save()
            return res.json(user.cartItems)
        } else {
            return res.status(404).json({ message: "Product not found in cart" })
        }
    } catch (error) {
        console.log("Error from updateQuantity", error.message);
        res.status(500).json({ message: "Server Error" })

    }
}