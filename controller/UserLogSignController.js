const signUp = require("../models/UserLogSignModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const saltRounds = 10;

const registerUsers = async (req, res) => {
    const { id, name, email, phone, password } = req.body

    try {
        const existEmail = await signUp.findOne({ email: email })
        if (existEmail) {
            res.status(400).json({
                message: "email is already registered"
            })
        } else {
            const salt = await bcrypt.genSalt(saltRounds)

            const hash = await bcrypt.hash(password, salt)

            const gmailInfo = new signUp({
                id: Date.now(),
                name: name,
                email: email,
                phone: `+92${phone}`,
                password: hash,
                memberSince: new Date()
            })
            await gmailInfo.save()
            const refreshToken = jwt.sign(
                { id: gmailInfo._id, email: gmailInfo.email, role: "user" },
                process.env.JWT_REFRESH_SECRET_KEY,
                { expiresIn: "2d" }
            )

            const accessToken = jwt.sign(
                { id: gmailInfo._id, email: gmailInfo.email, role: "user" },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "2h" }
            )
            res.cookie("refreshToken",refreshToken,{
                httpOnly:true,
                secure: true,
                sameSite: "Strict",
                maxAge: 2 * 24 * 60 * 60 * 1000
            })
            res.status(201).json({
                message: "user signed up",
                accessToken: accessToken

            })
        }



    } catch (error) {
        res.status(500).json({
            message: "Something went wrong"
        })
    }
}
const loginUser = async (req, res) => {
    const { email, password } = req.body

    try {
        const testEmail = await signUp.findOne({ email: email })

        if (testEmail) {
            const testPassword = await bcrypt.compare(password, testEmail.password)
            if (testPassword) {
                const accessToken = jwt.sign(
                    { id: testEmail._id, email: testEmail.email, role: "user" },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: "2h" }

                )


                res.status(200).json({
                    message: "user verified",
                    accessToken: accessToken
                })
            } else {
                res.status(401).json({
                    message: "Invalid email or password"
                })
            }

        } else {
            res.status(404).json({
                message: "Email is not registered. Kindly sign up"
            })
        }

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong"
        })
    }
}
const profileInfo = async (req, res) => {
    try {
        const UserInfo = await signUp.findOne({ email: req.ActiveEmail })
        res.status(200).json({
            message: "Info of user",
            data: UserInfo
        })

    } catch (error) {
        res.status(500).json({
            message: "error occured",
        })
    }

}
const membersData = async (req, res) => {
    try {
        const data = await signUp.find({}, { password: 0 })
        res.status(200).json({
            message: "Student data found",
            data: data
        })

    } catch (error) {
        res.status(500).json({
            message: "Server error occured",

        })
    }
}
const membersCount = async (req, res) => {
    try {
        const data = await signUp.countDocuments()
        res.status(200).json({
            message: "data fetched",
            data: data
        })

    } catch (error) {
        res.status(500).json({
            message: "Server error occured",

        })
    }
}



module.exports = { registerUsers, loginUser, profileInfo, membersData, membersCount }