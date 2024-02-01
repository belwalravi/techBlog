const CustomError = require("../error/CustomError");

const sendToken = (res ,user={}, statusCode)=>{

    if(!user)
    {  
        return next(new CustomError("Not authorized", 401));
    }

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
