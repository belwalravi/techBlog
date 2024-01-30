const asyncErrorWrapper = require("express-async-handler");
const { OAuth2Client } = require("google-auth-library");
const CustomError = require("../error/CustomError");
const {
    isJWTTokenIncluded,
    getAccessTokenJWTFromHeader,
} = require("./jwtTokenHelper");
const User = require("../../Models/user");
const { sendToken } = require("./tokenHelpers");

const authenticator = asyncErrorWrapper(async (req, res, next) => {

    const expectedAudience = process.env.IAP_SIGNED_HEADER;

    try {
        if (!isJWTTokenIncluded(req)) { //checks if token included, returns token or thorws error
            return next(
                new CustomError("You are not authorized to access this route ", 401)
            );
        }

        const iapAccessToken = getAccessTokenJWTFromHeader(req); 

        const client = new OAuth2Client();
        const response = await client.getIapPublicKeys();
        const decoded_iap_jwt = await client.verifySignedJwtWithCertsAsync( iapAccessToken, response.pubkeys, expectedAudience,  ["https://cloud.google.com/iap"] 
        );

        var userEmail = decoded_iap_jwt.payload.gcip.email;
        
        if(!userEmail){
            return next(
                new CustomError("User not found", 404)
            );
        }

        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return next(
                new CustomError("Not authorized to access this route ", 401)
            );
        }

        req.user = user ; 

        next()
    } catch (error) {
        console.log(error);
        new CustomError("Error occurred while processing request", 500)
    }
});
module.exports = { authenticator };
