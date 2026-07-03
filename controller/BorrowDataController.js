const RequestsCollection = require("../models/borrowRequestModel");
const topBooks = async (req, res) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        const result = await RequestsCollection.aggregate([
            {
               
                $match: {
                     status:{$in:["Borrowed", "Overdued", "Returned"]},
                    issueDate: {
                        $gte: startOfMonth,
                        $lte: endOfMonth
                    }

                }
            },
            {
                $group: {
                    _id: "$bookId",
                    totalBorrowed: { $sum: 1 }
                }
            },
            {
                $lookup:{
                    from:"booksdatas",
                    localField:"_id",
                    foreignField:"_id",
                    as:"bookDetails"
                }
            },
            {
                $unwind:"$bookDetails"
            },
            {
                $sort:{
                    totalBorrowed:-1
                }
            },
            {
                $limit:6
            },
            {
                $project:{
                    _id:0,
                    bookID: "$_id", 
                    Title: "$bookDetails.Title",
                    Author: "$bookDetails.Author",
                    totalBorrowed:1
                }
            }

        ])
          res.status(200).json({
            message: "top books fetched",
            data: result
        })      

    } catch (error) {
        res.status(500).json({
            message: "internal server error occured"
        })
    }
}
const adminNotification = async (req, res) => {
    try {
        const pendingRequests = await RequestsCollection.find({ status: "Pending" }).populate("userId", "id name").populate("bookId", "Title Copy ISBN")
        const FinalRequests = await Promise.all(pendingRequests.map(async (request) => {
            const userApprovedRequests = await RequestsCollection.find({ userId: request.userId, status: "Borrowed" })
            const userOverDueBooks = await RequestsCollection.find({ userId: request.userId, status: "Overdued" })
            let status = null;
            if (userApprovedRequests.length >= 1) {
                status = `${userApprovedRequests.length} borrowed`
            }
            if (userOverDueBooks.length >= 1) {
                status = `${userOverDueBooks.length} overdue`
            }
            if ((userOverDueBooks.length === 0) && (userApprovedRequests.length === 0)) {
                status = "Eligible"
            }
            return {
                _id: request._id,
                userId: request.userId,
                bookId: request.bookId,
                requestDate: request.requestDate,
                status: status

            }
        }))


        res.status(200).json({
            message: "data fetched successfully",
            data: FinalRequests
        })



    } catch (error) {
        res.status(500).json({
            message: "internal server error occured"
        })
    }

}
const UserpendingRequestData = async (req, res) => {
    const id = req.ActiveID
    try {
        const pendingRequests = await RequestsCollection.find({ userId: id, status: "Pending" }).populate("bookId", "Title Author ISBN")

        res.status(200).json({
            message: "data fetched successfully",
            data: pendingRequests
        })



    } catch (error) {
        res.status(500).json({
            message: "internal server error occured"
        })
    }

}
const UserApprovedRequestData = async (req, res) => {
    const id = req.ActiveID
    try {
        const approvedRequests = await RequestsCollection.find({ userId: id, status: "Approved" }).populate("bookId", "Title Author ISBN")

        res.status(200).json({
            message: "data fetched successfully",
            data: approvedRequests
        })



    } catch (error) {
        res.status(500).json({
            message: "internal server error occured"
        })
    }

}
const UserRejectedRequestData = async (req, res) => {
    const id = req.ActiveID
    try {
        const approvedRequests = await RequestsCollection.find({ userId: id, status: "Rejected" }).populate("bookId", "Title Author ISBN")

        res.status(200).json({
            message: "data fetched successfully",
            data: approvedRequests
        })



    } catch (error) {
        res.status(500).json({
            message: "internal server error occured"
        })
    }

}
const UserExpiredApprovalsData = async (req, res) => {
    const id = req.ActiveID
    try {
        const approvedRequests = await RequestsCollection.find({ userId: id, status: "Expired" }).populate("bookId", "Title Author ISBN")

        res.status(200).json({
            message: "data fetched successfully",
            data: approvedRequests
        })



    } catch (error) {
        res.status(500).json({
            message: "internal server error occured"
        })
    }

}
const UserData = async (req, res) => {
    const id = req.ActiveID
    try {
        const data = await RequestsCollection.find({ userId: id, status: { $in: ["Borrowed", "Overdued", "Returned"] } }).populate("bookId", "Title Author Pages Genre")

        res.status(200).json({
            message: "data fetched successfully",
            data: data
        })



    } catch (error) {
        res.status(500).json({
            message: "internal server error occured"
        })
    }

}
const requestCount = async (req, res) => {
    try {
        const pendingRequests = await RequestsCollection.find({ status: "Pending" })
        res.status(200).json({
            message: "data fetched successfully",
            data: pendingRequests.length
        })


    } catch (error) {
        res.status(500).json({
            message: "internal server error occured"
        })
    }
}
const borrowedRequestCount = async (req, res) => {
    try {
        const ApprovedRequests = await RequestsCollection.find({ status: { $in: ["Borrowed", "Overdued"] } })
        res.status(200).json({
            message: "data fetched successfully",
            data: ApprovedRequests.length
        })


    } catch (error) {
        res.status(500).json({
            message: "internal server error occured"
        })
    }
}
const overDueCount = async (req, res) => {
    try {
        const overDueBooks = await RequestsCollection.find({ status: "Overdued" })
        res.status(200).json({
            message: "data fetched successfully",
            data: overDueBooks.length
        })


    } catch (error) {
        res.status(500).json({
            message: "internal server error occured"
        })
    }
}

const membersActivity = async (req, res) => {
    try {
        const allHistory = await RequestsCollection.find({ status: { $nin: ["Pending", "Rejected"] } }).populate("userId", "id name").populate("bookId", "Title")
        res.status(200).json({
            message: "data fetched successfully",
            data: allHistory
        })
        console.log(allHistory);

    } catch (error) {
        res.status(500).json({
            message: "internal server error occured"
        })
    }

}
const approvedRequestsData = async (req, res) => {
    try {
        const approvedBooksData = await RequestsCollection.find({ status: "Approved" }, { issueDate: 0, rejectedDate: 0, rejectionReason: 0, dueDate: 0, returnDate: 0 }).populate("userId", "id name").populate("bookId", "Title Author")
        res.status(200).json({
            message: "data fetched successfully",
            data: approvedBooksData
        })
        console.log(allHistory);

    } catch (error) {
        res.status(500).json({
            message: "internal server error occured"
        })
    }

}
const expiredApprovalsData = async (req, res) => {
    try {
        const approvedBooksData = await RequestsCollection.find({ status: "Expired" }, { issueDate: 0, rejectedDate: 0, rejectionReason: 0, dueDate: 0, returnDate: 0 }).populate("userId", "id name").populate("bookId", "Title Author",)
        res.status(200).json({
            message: "data fetched successfully",
            data: approvedBooksData
        })
        console.log(allHistory);

    } catch (error) {
        res.status(500).json({
            message: "internal server error occured"
        })
    }

}
const rejectedRequetsData = async (req, res) => {
    try {
        const approvedBooksData = await RequestsCollection.find({ status: "Rejected" }, { issueDate: 0, approvedDate: 0, expireDate: 0, dueDate: 0, returnDate: 0 }).populate("userId", "id name").populate("bookId", "Title Author",)
        res.status(200).json({
            message: "data fetched successfully",
            data: approvedBooksData
        })
        console.log(allHistory);

    } catch (error) {
        res.status(500).json({
            message: "internal server error occured"
        })
    }

}
const BorrowedBooks = async (req, res) => {
    try {
        const BorrowedBooksData = await RequestsCollection.find({ status: { $in: ["Borrowed", "Overdued"] } }, { approvedDate: 0, expireDate: 0, rejectedDate: 0, rejectionReason: 0, requestDate: 0 }).populate("userId", "id name email").populate("bookId", "Title Author")
        res.status(200).json({
            message: "data fetched successfully",
            data: BorrowedBooksData
        })


    } catch (error) {
        res.status(500).json({
            message: "internal server error occured"
        })
    }

}
const returnedBooks = async (req, res) => {
    try {
        const returnedBooksData = await RequestsCollection.find({ status: "Returned" }, { approvedDate: 0, expireDate: 0, rejectedDate: 0, rejectionReason: 0, requestDate: 0, }).populate("userId", "id name email").populate("bookId", "Title Author")
        res.status(200).json({
            message: "data fetched successfully",
            data: returnedBooksData
        })


    } catch (error) {
        res.status(500).json({
            message: "internal server error occured"
        })
    }

}
const RecentActvity = async (req, res) => {
    try {
        const Recent = await RequestsCollection.find({ status: { $in: ["Returned", "Borrowed", "Overdued"] } }, { approvedDate: 0, expireDate: 0, rejectedDate: 0, rejectionReason: 0, requestDate: 0, }).populate("userId", "name").populate("bookId", "Title").sort({ activityDate: -1 }).limit(6)
        res.status(200).json({
            message: "data fetched successfully",
            data: Recent
        })


    } catch (error) {
        res.status(500).json({
            message: "internal server error occured"
        })
    }

}
module.exports = {topBooks, UserData, UserRejectedRequestData, UserExpiredApprovalsData, UserApprovedRequestData, adminNotification, BorrowedBooks, UserpendingRequestData, requestCount, borrowedRequestCount, overDueCount, membersActivity, approvedRequestsData, rejectedRequetsData, expiredApprovalsData, returnedBooks, RecentActvity }