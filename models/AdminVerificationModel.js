const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema({
    email: String,
    password: String
})

const adminVerify = mongoose.model("adminVerify", adminSchema)

module.exports = adminVerify