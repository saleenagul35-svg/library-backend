const mongoose = require("mongoose");
const RequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "signUp"
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BooksData"
  },
  status: String,
  requestDate: String,
  issueDate: Date,
  approvedDate: Date,
  expireDate:Date,
  dueDate: Date,
  returnDate: Date,
  rejectedDate: Date,
  rejectionReason: String,
  activityDate: Date
},{ timestamps: true })
const RequestsCollection = mongoose.model("RequestsCollection", RequestSchema)

module.exports = RequestsCollection