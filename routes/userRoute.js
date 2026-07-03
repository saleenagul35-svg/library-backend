const express = require('express')
const router = express.Router()
const {registerUsers,loginUser,profileInfo,membersData,membersCount} = require("../controller/UserLogSignController")
const Token_Verfication = require("../middleware/authMiddleware")

router.post("/signUp",registerUsers)
router.post("/userLogin",loginUser)
router.get("/CUserInfo",Token_Verfication,profileInfo)
router.get("/membersData",Token_Verfication,membersData)
router.get("/membersCount",Token_Verfication,membersCount)


module.exports = router

