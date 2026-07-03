const adminLogout = async (req, res) => {
    res.clearCookie("refreshToken", refreshToken, {
        httpOnly: false,
        secure: false,
        sameSite: "Strict",

    })
    res.clearCookie("Admintoken", {
        path: '/'
    })
    res.status(200).json({
        message: "admin logged out successfully"
    })

}

module.exports = { adminLogout }