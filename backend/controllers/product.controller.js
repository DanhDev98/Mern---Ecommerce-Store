import { redis } from "../lib/redis.js";
import Product from "../model/product.model.js";
import cloudinary from "../lib/cloudinary.js"

export const getAllProducts = async (req, res) => {

    try {
        const allProducts = await Product.find({})
        res.status(200).json(allProducts)
    } catch (error) {
        console.log('Error in getAllProducts: ', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};
export const getFeaturedProducts = async (req, res) => {
    try {
        let featuredProducts = await redis.get("featured-product")
        console.log(featuredProducts)
        if (featuredProducts) {
            return res.json(JSON.parse(featuredProducts))
        }

        featuredProducts = await Product.find({ isFeatured: true }).lean()
        console.log('check backend', featuredProducts)
        if (!featuredProducts) {
            return res.status(404).json({ message: "No Featured Product found" })
        }
        redis.set("featured-product", JSON.stringify(featuredProducts))
        res.json(featuredProducts)
    } catch (error) {
        console.log("Error from getFeaturedProducts", error.message)
        res.status(500).json({ message: "Error Server" })
    }
}


export const createProducts = async (req, res) => {
    try {
        const { name, description, category, price, image } = req.body
        let uploadImgRes = null
        if (image) {
            uploadImgRes = await cloudinary.uploader.upload(image)
        }
        const product = new Product({
            name,
            description,
            category,
            price,
            image: uploadImgRes?.secure_url ? uploadImgRes.secure_url : ""
        })

        await product.save()
        res.status(200).json({ message: "Create product successfull", product })
    } catch (error) {
        console.log("Error from createProduct", error.message);
        res.status(500).json({ message: "Error Server" })
    }
}

export const deleteProducts = async (req, res) => {
    try {
        const idProduct = req.params.id
        const product = await Product.findById(idProduct)
        if (!product) {
            return res.status(400).json({ message: "Product not found" })
        }
        if (product.image) {
            const idImage = product.image.split("/").pop().split(".")[0]
            try {
                await cloudinary.uploader.destroy(idImage)
                console.log("Image deleted in cloundinary");
            } catch (error) {
                console.log("Image dont delete in cloundinary", error.message);

            }
        }
        await Product.findByIdAndDelete(idProduct)
        res.status(200).json({ message: "Product is deleted" })
    } catch (error) {
        console.log("Error from delete Product", error.message);
        res.status(500).json({ message: "Error Server" })
    }
}

export const getRecommendProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            {
                $sample: { size: 6 }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    image: 1,
                    price: 1
                }
            }
        ])

        res.json(products)
    } catch (error) {
        console.log("Error from getRecommnendProduct", error.message)
        res.status(500).json({ message: "Server Error" })
    }
}
export const getProductCategory = async (req, res) => {
    const { category } = req.params
    try {
        const products = await Product.find({ category })
        if (!products) {
            return res.status(404).json({ message: "No Product found" })
        }
        res.json({ products })
    } catch (error) {
        console.log("Error from getProductCategory", error.message)
        return res.status(500).json({})
    }
}

export const toggleFeaturedProducts = async (req, res) => {

    try {
        const idProduct = req.params.id
        const product = await Product.findById(idProduct)
        if (product) {
            product.isFeatured = !product.isFeatured
            const updateProduct = await product.save()
            // SAVE trong redis cache
            await updateFeaturedProductCache()
            res.status(200).json(updateProduct)
        }
    } catch (error) {
        console.log("Error from updateProduct", error.message);
        res.status(500).json({ message: "Error Server" })
    }
}

const updateFeaturedProductCache = async () => {
    try {
        const featuredProducts = await Product.find({ isFeatured: true }).lean()
        await redis.set("featured-product", JSON.stringify(featuredProducts))
    } catch (error) {
        console.log("Error from updateFeaturedProductCache", error.message)
        throw new Error("Error from updateFeaturedProductCache")
    }
}

