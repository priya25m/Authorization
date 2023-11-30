const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const userSchema = require("../models/users")
const jwt = require('jsonwebtoken');
require('dotenv').config();
exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await userSchema.findOne({ email: email })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User Already Exists"
            })
        }
        //secure pass
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: "error in creating password"
            })
        }
        const user = await userSchema.create({
            name, email, password: hashedPassword, role
        })
        return res.status(200).json({
            success: true,
            message: "User Created Successfully"
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err

        })
    }
}
exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "Please provide email and password",
            success: false
        })
    }
    try {
        let user = await userSchema.findOne({ email: email })
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User Doesnot Exist, Please SignUp"
            })
        }
        //check pass
        const payload = {
            email: user.email,
            id: user._id,
            role: user.role
        }
        if (await bcrypt.compare(password, user.password)) {
            let token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h"
            })
            user=user.toObject();
            user.token = token;
            user.password = undefined;
            // cookies
            const option = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), httpOnly: true
            }
            res.cookie("token", token, option).status(200).json({
                success: true,
                token, user, message: "User Logged In Successfully"
            })
        }
        else {
            return res.status(403).json({
                success: false,
                message: "Passwords Do not match"
            })
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err
        })
    }
}