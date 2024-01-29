const isTokenIncluded =(req) => {
   
    return (
        req.headers.authorization && req.headers.authorization.startsWith("Bearer")
    )

}

const getAccessTokenFromHeader = (req) => {

    const authorization = req.headers.authorization

    const access_token = authorization.split(" ")[1]

    return access_token
}

const sendToken = (token,statusCode ,res ,user={})=>{
    // console.log("token sent")
    return res.status(statusCode).json({
        user,
        success: true 
    })
}

module.exports ={
    sendToken,
    isTokenIncluded,
    getAccessTokenFromHeader
}
