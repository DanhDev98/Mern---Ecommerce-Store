import jwt from "jsonwebtoken"
import User from "../model/user.model.js"

export const protectRoute = async (req, res , next) => {
    try {
        const accessToken = req.cookies.accessToken
        if(!accessToken){
            return res.status(400).json({message:"No token provided"})
        }

        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
            const user = await User.findById(decoded.userId).select("-password")
            if(!user){
                return res.status(400).json({message:"User not found" })
            }
            req.user = user
            next()
        } catch (error) {
            if(error.name === "TokenExpiredError"){
                return res.status(401).json({message: "Access token expired"})
            }
            throw error
        }
    } catch (error) {
        console.log("Error from protectRoute", error.message);
        res.status(500).json("Error server")
    }
}

export const adminRoute = (req,res, next) => {
    if(req.user && req.user.role === "admin"){
        next()
    }else {
        return res.status(401).json({message: "Access denied - Admin only"})
    }
}