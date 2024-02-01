const asyncErrorWrapper = require("express-async-handler")
const { performAuth } = require("./iapAuth");

const getPrivateData = asyncErrorWrapper((req, res, next) => {
    performAuth(req, res, next)
})

module.exports = {
    getPrivateData
}
