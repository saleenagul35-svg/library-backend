const express = require('express')
const router = express.Router()
const {borrowBook,rejectRequest,acceptRequest,BookIssue,returnBook} = require("../controller/borrowRequestController")
const Token_Verfication = require("../middleware/authMiddleware")


router.post("/borrowRequest",Token_Verfication,borrowBook)
router.put("/rejectRequest/:id",Token_Verfication,rejectRequest)
router.put("/acceptRequest/:id",Token_Verfication,acceptRequest)
router.put("/BookIssue/:id",Token_Verfication,BookIssue)
router.put("/returnBook/:id",Token_Verfication,returnBook)
module.exports = router
