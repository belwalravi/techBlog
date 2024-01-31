const sendToken = (token,statusCode ,res ,user={})=>{
    return res.status(statusCode).json({
        user,
        success: true 
    })
}

const isJWTTokenIncluded =(req) => {
    return (req.header("x-goog-iap-jwt-assertion"))
}

const getAccessTokenJWTFromHeader = (req) => {
    return req.header("x-goog-iap-jwt-assertion")
}

module.exports ={
    sendToken,
    isJWTTokenIncluded,
    getAccessTokenJWTFromHeader
}
