import { generateToken } from "../lib/util.js";
import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please fill all fields" });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "Email already registered" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        // bycrypt password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully", newUser });
    } catch (error) {
        console.log("Error in signup: ", error.message);
        res.status(500).json({ message: "Server error" });
    }

};


export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Email not registered" })
        }
        //check password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Password incorrect" })
        }

        //authenticate user
        const { accessToken, refreshToken } = generateToken(user._id)
        res.status(200).json({ message: "Login successful", user })
    } catch (error) {
        console.log("Error in login: ", error.message);
        res.status(500).json({ message: "Server error" });
    }
};


export const logout = (req, res) => {
    res.send("logout route");
};