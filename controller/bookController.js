const bookCollection = require("../models/BooksModel");

const storeBooks = async (req, res) => {
    const { Title, Author, ISBN, Genre, Publisher, Year, Language, Copy, Pages, Description,ImageURL } = req.body
    const CheckValidity = await bookCollection.findOne({ ISBN: ISBN })

    try {
        if (!CheckValidity) {
            const book = new bookCollection({
                Title: Title,
                Author: Author,
                ISBN: ISBN,
                Genre: Genre,
                Publisher: Publisher,
                Year: Year,
                Language: Language,
                Copy: Copy,
                Pages: Pages,
                Status: "available",
                Description: Description,
                ImageURL:ImageURL
            })
            await book.save()
            res.status(200).json({
                message: "book saved successfully"
            })
        } else {
            res.status(400).json({
                message: "This book already exists"
            })
        }


    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server error"
        })

    }

}
const fetchBooks = async (req, res) => {
    try {
        let Books = await bookCollection.find({})
        res.status(200).json({
            message: "Books data found",
            data: Books
        })
    } catch (error) {
        res.status(500).json({
            message: "erver error occured",
        })
    }
}
const deleteBook = async (req, res) => {
    const id = req.params.id

    try {
        await bookCollection.deleteOne({ _id: id })
        res.status(200).json({
            message: "book deleted successfully"
        })

    } catch (error) {
        res.status(500).json({
            message: "error occured while deleting book"
        })
    }


}
const editBook = async (req, res) => {
    const id = req.params.id
    const { Title, Author, ISBN, Genre, Publisher, Year, Language, Copy, Pages, Description,ImageURL } = req.body

    try {
        await bookCollection.updateOne({ _id: id }, {
            $set: {
                Title: Title,
                Author: Author,
                ISBN: ISBN,
                Genre: Genre,
                Publisher: Publisher,
                Year: Year,
                Language: Language,
                Copy: Copy,
                Pages: Pages,
                Status: "available",
                Description: Description,
                ImageURL:ImageURL
            }
        })
        res.status(200).json({
            message: "book updated successfully"
        })

    } catch (error) {
        res.status(500).json({
            message: "error occured while updating book details"
        })
    }
}
const bookCount = async (req, res) => {
    try {
        const totalBooks = await bookCollection.countDocuments()
        res.status(200).json({
            message: "data fetched successfully",
            data: totalBooks
        })


    } catch (error) {
        res.status(500).json({
            message: "internal server error occured"
        })
    }
}
const updateBookCopies = async (req, res) => {
    const id = req.params.id
    const { Copy, Status } = req.body

    try {
        await bookCollection.updateOne({ _id: id }, {
            $set: {
                Copy: Copy,
                Status: Status,
            }
        })
        res.status(200).json({
            message: "book updated successfully"
        })

    } catch (error) {
        res.status(500).json({
            message: "error occured while updating book details"
        })
    }
}
module.exports = { storeBooks, fetchBooks, deleteBook, editBook, updateBookCopies, bookCount };