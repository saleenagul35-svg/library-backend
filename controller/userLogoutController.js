const userLogout = async (req, res) => {
    res.clearCookie("refreshToken", refreshToken, {
        httpOnly: false,
        secure: false,
        sameSite: "Strict",

    })
    res.clearCookie("activeUser", {
        path: '/'
    })
    res.status(200).json({
        message: "user logged out successfully"
    })

}

module.exports = { userLogout }