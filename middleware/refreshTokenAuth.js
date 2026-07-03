const jwt = require('jsonwebtoken');

const refreshTokenAuth = async (req, res) => {
    const token = req.cookies.refreshToken
    try {
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY)
            if (decoded) {
                const newAccessToken = jwt.sign(
                    { id: decoded.id, email: decoded.email, role: decoded.role },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: "2h" }
                )
                res.status(200).json({
                    accessToken: newAccessToken
                })
            }else{
            res.status(403).json({
                message:"Invalid refresh token"
            })                
            }
        }else{
            res.status(404).json({
                message:"Refresh token not found"
            })
        }
    } catch (error) {
            res.status(500).json({
                message:"Server error occured"
            })
    }


}
module.exports = {refreshTokenAuth}