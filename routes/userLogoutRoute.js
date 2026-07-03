const express = require("express")
const router = express.Router()
const {userLogout} = require("../controller/userLogoutController")
router.post("/userLogout", userLogout)

module.exports = router