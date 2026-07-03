const RequestsCollection = require("../models/borrowRequestModel")
const bookCollection = require("../models/BooksModel");
const cron = require('node-cron');



cron.schedule('* * * * *', async () => {

    const now = new Date();
    const overDueRequests = await RequestsCollection.find({ dueDate: { $lt: now }, status: "Borrowed", })
    for (let req of overDueRequests) {
        await RequestsCollection.updateOne({ _id: req._id }, { $set: { status: "Overdued", activityDate: new Date(), } })
    }
    const ExpiredApprovals = await RequestsCollection.find({ expireDate: { $lt: now }, status: "Approved" })
    for (let req of ExpiredApprovals) {
        await RequestsCollection.updateOne({ _id: req._id }, { $set: { status: "Expired" } })
        await bookCollection.updateOne({ _id: req.bookId }, { $inc: { Copy: 1 } })
    }

});
const borrowBook = async (req, res) => {
    const { bookId } = req.body
    const userId = req.ActiveID
    try {
        const limitChecking = await RequestsCollection.find({ userId: userId, status: { $in: ["Borrowed", "Pending", "Approved", "Overdued"] } })
        if (limitChecking.length === 5) {
            return res.status(409).json({
                message: "Your request cannot be entertained. Maximum limit of 5 reached",
            })
        } else {
            const CheckingBook = await bookCollection.findOne({ _id: bookId })
            
            if (CheckingBook.Copy > 0) {
                const CheckRequest = await RequestsCollection.findOne({ userId: userId, bookId: bookId,  status: { $in: ["Pending", "Approved", "Borrowed", "Overdued"]} }).sort({ requestDate: -1 })

                if (CheckRequest) {
                    
                    if (CheckRequest.status === "Pending") {
                        return res.status(409).json({
                            message: "Request already submitted",
                        })
                    } else if (CheckRequest.status === "Approved") {
                        return res.status(409).json({
                            message: "Your request has been approved! You can now collect the book from the library.",
                        })
                    } else if (CheckRequest.status === "Overdued") {
                        return res.status(409).json({
                            message: "You have already borrowed this book and it is overdue. Please return it as soon as possible",
                        })
                    } else if (CheckRequest.status === "Borrowed") {
                        return res.status(409).json({
                            message: "You are currently holding this book. You cannot request the same book again.",

                        })
                    }
                }
                const newRequest = new RequestsCollection({
                    userId: userId,
                    bookId: bookId,
                    status: "Pending",
                    requestDate: new Date(),
                })
                await newRequest.save()
                return res.status(200).json({
                    message: "Request submitted successfully! Please pickup your book within 48 hours.",
                })
            } else {
                return res.status(409).json({
                    message: "This book is currently unavailable.",
                })
            }
        }


    } catch (error) {
        res.status(500).json({
            message: "Something went wrong"
        })
    }


}
const rejectRequest = async (req, res) => {
    const id = req.params.id
    const { reason } = req.body


    try {
        await RequestsCollection.updateOne({ _id: id }, {
            $set: {
                status: "Rejected",
                rejectedDate: new Date(),
                rejectionReason: reason
            }
        })
        res.status(200).json({
            message: "borrow request rejected"
        })

    } catch (error) {
        res.status(500).json({
            message: "error occured rejecting borrow request"
        })
    }
}
const acceptRequest = async (req, res) => {
    const id = req.params.id
    try {
        const findRequest = await RequestsCollection.findOne({ _id: id })

        const checkingCopies = await bookCollection.findOne({ _id: findRequest.bookId })

        if (checkingCopies.Copy < 1) {
            res.status(409).json({
                message: "book is not available"
            })
        } else {
            await bookCollection.updateOne({ _id: findRequest.bookId }, { $inc: { Copy: - 1 } })
            let expireDateCounting = new Date();
            expireDateCounting.setDate(expireDateCounting.getDate() + 2)
            await RequestsCollection.updateOne({ _id: id }, {
                $set: {
                    status: "Approved",
                    approvedDate: new Date(),
                    expireDate: expireDateCounting,
                }
            })
            res.status(200).json({
                message: "borrow request approved"
            })

        }

    } catch (error) {
        res.status(500).json({
            message: "error occured rejecting borrow request"
        })
    }

}
const BookIssue = async (req, res) => {
    const id = req.params.id
    try {
        const findRequest = await RequestsCollection.findOne({ _id: id })

        const checkingCopies = await bookCollection.findOne({ _id: findRequest.bookId })

        if (checkingCopies.Copy < 1) {
            res.status(409).json({
                message: "book is not available"
            })
        } else {

            let dueDateCounting = new Date();
            dueDateCounting.setDate(dueDateCounting.getDate() + 14)
            await RequestsCollection.updateOne({ _id: id }, {
                $set: {
                    status: "Borrowed",
                    issueDate: new Date(),
                    dueDate: dueDateCounting,
                    activityDate: new Date(),
                    expireDate: null
                }
            })
            res.status(200).json({
                message: "borrow request approved"
            })

        }

    } catch (error) {
        res.status(500).json({
            message: "error occured rejecting borrow request"
        })
    }

}
const returnBook = async (req, res) => {
    const id = req.params.id
    try {
        const findRequest = await RequestsCollection.findOne({ _id: id })

        const bookInc = await bookCollection.findOne({ _id: findRequest.bookId })
        await bookCollection.updateOne({ _id: bookInc._id }, { $inc: { Copy: 1 } })
        await RequestsCollection.updateOne({ _id: id }, {
            $set: {
                status: "Returned",
                returnDate: new Date(),
                activityDate: new Date(),
                dueDate: null,
            }
        })
        res.status(200).json({
            message: "book returned"
        })



    } catch (error) {
        res.status(500).json({
            message: "server error occured"
        })
    }

}

module.exports = { borrowBook, rejectRequest, acceptRequest, BookIssue, returnBook }