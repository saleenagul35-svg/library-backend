const express = require("express")
const router = express.Router()
const {refreshTokenAuth} = require("../middleware/refreshTokenAuth")

router.post("/refreshTokenAuth", refreshTokenAuth)

module.exports = router