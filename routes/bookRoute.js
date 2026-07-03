const express = require('express')
const router = express.Router()
const {storeBooks,fetchBooks,deleteBook,editBook,updateBookCopies,bookCount} = require("../controller/bookController")
const Token_Verfication = require("../middleware/authMiddleware")

router.post("/addBooks",Token_Verfication,storeBooks)
router.get("/bookData",Token_Verfication, fetchBooks)
router.delete("/deleteBook/:id",Token_Verfication,deleteBook)
router.put("/editBook/:id",Token_Verfication,editBook)
router.put("/editBook/:id",Token_Verfication,updateBookCopies)
router.get("/bookCount",Token_Verfication,bookCount)

module.exports = router