const express = require('express')
const router = express.Router()
const { adminVerification, adminsignup } = require("../controller/AdminVerificationController")

router.post("/adminVerification", adminVerification)
router.post("/adminsignup", adminsignup)
module.exports = router