const jwt = require('jsonwebtoken');
const Token_Verfication = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]
    try {
        if (token) {

            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
                if (decoded.role === "user") {
                    req.ActiveEmail = decoded.email
                    req.ActiveID = decoded.id

                    next();
                }
                if (decoded.role === "admin") {
                    req.ActiveID = decoded.id
                    next();
                }
            


        } else {
            res.status(404).json({
                message: "token not found"
            })
        }
    } catch (error) {
        if (error.name === "TokenExpiredError") {
         return   res.status(401).json({ message: "Token expired" })
        }
        if (error.name === "JsonWebTokenError") {
         return   res.status(401).json({ message: "invalid token" })
        }
     return   res.status(500).json({ message: "Internal error" })
    }


}
module.exports = Token_Verfication