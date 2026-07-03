require("dotenv").config()
const express = require('express')
const app = express()
const port = 5000
const cors = require("cors")
const connectDB = require("./config/db")
const cookieParser = require("cookie-parser")
const bookRoute = require("./routes/bookRoute")
const adminRoute = require("./routes/adminRoute")
const userRoute = require("./routes/userRoute")
const requestRoute = require("./routes/requestRoute")
const BorrowDataRoute = require("./routes/BorrowDataRoute")

const refreshRoute = require("./routes/refreshRoute")
const adminLogoutRoute = require("./routes/adminLogoutRoute")
const userLogoutRoute = require("./routes/userLogoutRoute")
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}))

connectDB();
app.use("/api",bookRoute)
app.use("/api",adminRoute)
app.use("/api", userRoute)
app.use("/api",requestRoute)
app.use("/api",BorrowDataRoute)
app.use("/api",refreshRoute)
app.use("/api",adminLogoutRoute)
app.use("/api",userLogoutRoute)

app.put("/edit/:id", async (req, res) => {
    const id = req.params.id
    const { Title, Detail, Status } = req.body

    try {
        await bookCollection.updateOne({ _id: id }, { $set: { Title: Title, Detail: Detail, Status: Status } })
        res.status(200).json({
            message: "task updated successfully"
        })

    } catch (error) {
        res.status(500).json({
            message: "error occured while updating"
        })
    }




})



app.put("/check/:id", async (req, res) => {
    const id = req.params.id
    const { Status } = req.body

    try {

        await user.updateOne({ _id: id }, { $set: { Status: Status } })
        res.status(500).json({
            message: "task checked successfully"
        })

    } catch (error) {
        res.status(500).json({
            message: "error occured while marking task"
        })


    }



})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})