const express = require("express")
const router = express.Router()
const {adminLogout} = require("../controller/AdminLogoutController")
router.post("/adminLogout", adminLogout)

module.exports = router