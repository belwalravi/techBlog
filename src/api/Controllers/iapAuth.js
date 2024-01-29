const asyncErrorWrapper = require("express-async-handler");
const { OAuth2Client } = require("google-auth-library");
const CustomError = require("../Helpers/error/CustomError");
const {
    isJWTTokenIncluded,
    getAccessTokenJWTFromHeader,
} = require("../Helpers/auth/jwtTokenHelper");
const User = require("../Models/user");
const { sendToken } = require("../Helpers/auth/tokenHelpers");

const performAuth = asyncErrorWrapper(async (req, res, next) => {

    const expectedAudience = process.env.IAP_SIGNED_HEADER;

    // console.log("--> cheking for verify_iap_jwt (performAuth)");
    // console.log(req.header("x-goog-iap-jwt-assertion"))

    try {
        if (!isJWTTokenIncluded(req)) { //checks if token included, returns token or thorws error
            return next(
                new CustomError("You are not authorized to access this route ", 401)
            );
        }

        const iapAccessToken = getAccessTokenJWTFromHeader(req); //iap access token

        const client = new OAuth2Client();
        const response = await client.getIapPublicKeys(); //for pubic key
        const decoded_iap_jwt = await client.verifySignedJwtWithCertsAsync(
            iapAccessToken, //verify IAP JWT
            response.pubkeys, //for pubic key
            expectedAudience,  // expectedAudience
            ["https://cloud.google.com/iap"] //certs_url
        );

        // console.log("-> jwt payload decoded ",decoded_iap_jwt)
        var userEmail = decoded_iap_jwt.payload.gcip.email;

        const user = await User.findOne({ email: userEmail });
        // console.log("user -> ",JSON.stringify(user))

        if (!user) {
            return next(
                new CustomError("You are not authorized to access this route ", 401)
            );
        }

        sendToken(iapAccessToken, 200, res, user);

    } catch (error) {
        console.log(error);
        new CustomError("Error occurred while processing request", 500)
    }
});
module.exports = { performAuth };
