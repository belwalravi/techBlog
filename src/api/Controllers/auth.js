const asyncErrorWrapper = require("express-async-handler")
const { performAuth } = require("./iapAuth");

const getPrivateData = asyncErrorWrapper((req, res, next) => {
    // console.log("--> getPrivateData")
    performAuth(req, res, next)

})

const login = asyncErrorWrapper(async (req, res, next) => {

    if (process.env.IAP_ENABLED !== "false") {
        performAuth(req, res, next)
    }
})

module.exports = {
    login,
    getPrivateData
}
