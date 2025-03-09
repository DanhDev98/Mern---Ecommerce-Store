import Coupon from "../model/coupon.model.js"

export const getCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findOne({ userId: req.user._id, isActive: true })
        if (!coupon) {
            return res.status(404).json({ message: "No coupon found" })
        }
        res.status(200).json(coupon)
    } catch (error) {
        console.log("error in getCoupon", error.message)
        res.status(500).json({ message: "Server Error" })
    }
}

export const validateCoupon = async (req, res) => {
    try {
        const { code } = req.body
        const coupon = await Coupon.findOne({ code, userId: req.user._id, isActive: true })
        if (!coupon) {
            return res.status(404).json({ message: "Invalid coupon" })
        }
        if (coupon.expirationDate < new Date()) {
            coupon.isActive = false
            await coupon.save()
            return res.status(404).json({ message: "Coupon expired" })
        }
        res.status(200).json({ message: "Coupon is valid" }, coupon)
    } catch (error) {
        console.log("error in validateCoupon", error.message)
        res.status(500).json({ message: "Server Error" })
    }
}