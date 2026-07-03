const adminVerify = require("../models/AdminVerificationModel")
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt")
require("dotenv").config()
const adminVerification = async (req, res) => {
    const { email, password } = req.body

    try {

        const testAdmin = await adminVerify.findOne({ email: email })

        if (testAdmin) {
            const testadminPass = await bcrypt.compare(password, testAdmin.password)
            if (testadminPass) {
                const accessToken = jwt.sign(
                    { id: testAdmin._id, email: testAdmin.email, role: "admin" },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: "2h" }
                )
                const refreshToken = jwt.sign(
                    { id: testAdmin._id, email: testAdmin.email, role: "admin" },
                    process.env.JWT_REFRESH_SECRET_KEY,
                    { expiresIn: "2d" }
                )
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "Strict",
                    maxAge: 2 * 24 * 60 * 60 * 1000
                })

                res.status(200).json({
                    message: "Admin verified",
                    accessToken: accessToken
                })
            } else {
                res.status(401).json({
                    message: "Invalid email or password "
                })

            }
        } else {
            res.status(401).json({
                message: "Invalid email or password "
            })


        }

    } catch (error) {
        console.log(error.message);

        res.status(500).json({
            message: "server error occured"
        })
    }
}
const saltRounds = 10;
const adminsignup = async (req, res) => {
    const { email, password } = req.body

    try {
        const testEmail = await adminVerify.findOne({ email: email })
        if (testEmail) {
            res.status(200).json({
                message: "Email Exists Please Login",

            })
        } else {
            const salt = await bcrypt.genSalt(saltRounds)

            const hash = await bcrypt.hash(password, salt)
            const gmailInfo = new adminVerify({
                email: email,

                password: hash,

            })
            await gmailInfo.save()
            const accessToken = jwt.sign(
                { id: gmailInfo._id, email: gmailInfo.email, role: "admin" },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "2h" }
            )
            const refreshToken = jwt.sign(
                { id: gmailInfo._id, email: gmailInfo.email, role: "admin" },
                process.env.JWT_REFRESH_SECRET_KEY,
                { expiresIn: "2d" }
            )
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "Strict",
                maxAge: 2 * 24 * 60 * 60 * 1000
            })
            res.status(200).json({
                message: "Admin signed up",

            })
        }


    } catch (error) {
        console.log(error.message);

        res.status(500).json({
            message: "server error occured"
        })
    }
}

module.exports = { adminVerification, adminsignup }