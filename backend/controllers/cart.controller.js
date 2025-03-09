import Product from "../model/product.model.js";

export const getCartProducts = async (req, res) => {
    try {
        const products = await Product.find({ _id: { $in: req.user.cardItems } })
        const cartItems = products.map(product => {
            const item = req.user.cardItems.find(cartItems => cartItems.id == product._id)
            return { ...product.toJSON(), quantity: item.quantity }
        })
        res.json(cartItems)
    } catch (error) {
        console.log("Error from getCartProducts", error.message);
        res.status(500).json({ message: "Server Error" })
    }
}
export const addToCart = async (req, res) => {
    try {
        const { productId } = req.body
        const userId = req.user._id

        const existingProduct = await user.cardItems.find(item => item.id == productId)
        if (existingProduct) {
            existingProduct.quantity += 1
        }
        else {
            user.cardItems.push({ productId })
        }

        await user.save()
        res.json({ message: "Add to cart success" }, user.cardItems)
    } catch (error) {
        console.log("Error from addToCart", error.message);
        res.status(500).json({ message: "Server Error" })
    }
}

export const removeProductFromCart = async (req, res) => {
    try {
        const { productId } = req.body
        const userId = req.user._id
        if (!productId) {
            user.cardItems = []
        } else {
            user.cardItems = user.cardItems.filter(item => item.id != productId)
        }
        await user.save()
        res.json({ message: "Remove product from cart success" }, user.cardItems)
    } catch (error) {
        console.log("Error from removeProductFromCart", error.message);
        res.status(500).json({ message: "Server Error" })
    }
}


export const updateQuantity = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user._id
        const { quantity } = req.body
        const existingProduct = user.cardItems.find(item => item.id == productId)
        if (existingProduct) {
            if (quantity == 0) {
                user.cardItems = user.cardItems.filter(item => item.id != productId)
                await user.save()
                return res.json(user.cardItems)
            }
            existingProduct.quantity = quantity
            await user.save()
            return res.json(user.cardItems)
        } else {
            return res.status(404).json({ message: "Product not found in cart" })
        }
    } catch (error) {
        console.log("Error from updateQuantity", error.message);
        res.status(500).json({ message: "Server Error" })

    }
}