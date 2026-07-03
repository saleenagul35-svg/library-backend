const mongoose = require("mongoose")

const signUpSchema = new mongoose.Schema({
    id: Number,
    name: String,
    email: String,
    phone: Number,
    password: String,
    memberSince: Date
})
const signUp = mongoose.model("signUp", signUpSchema)

module.exports = signUp