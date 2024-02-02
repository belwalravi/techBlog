const asyncErrorWrapper = require("express-async-handler");
const { OAuth2Client } = require("google-auth-library");
const CustomError = require("../Helpers/error/CustomError");
const {
    isJWTTokenIncluded,
    getAccessTokenJWTFromHeader,
} = require("../Helpers/auth/tokenHelpers");
const User = require("../Models/user");
const { sendToken } = require("../Helpers/auth/tokenHelpers");

const performAuth = asyncErrorWrapper(async (req, res, next) => {

    const expectedAudience = process.env?.IAP_SIGNED_HEADER;     // console.log("--> cheking for verify_iap_jwt (performAuth) \n",req.header("x-goog-iap-jwt-assertion"))
    const admUserEnv = process.env?.TENANT_ADM_USER ? process.env?.TENANT_ADM_USER : null;
    console.log("tenantAd > ",admUserEnv);
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

        var userEmail = decoded_iap_jwt.payload.gcip.email;     // console.log("-> jwt payload decoded ",decoded_iap_jwt)

        const user = await User.findOne({ email: userEmail });  // console.log("user -> ",JSON.stringify(user))
        
        if(process.env?.AUTO_SIGNUP_GCIP_VERIFIED_USER == true && !user)
        {               
            if( false && admUserEnv && (admUserEnv == userEmail))
            {
                console.log("creating GCIP verified admin user.")
                user ?  null 
                            : await User.create({
                                email : admUserEnv,
                                username : admUserEnv,
                            })
            }
        }

        if (!user && ! process.env?.AUTO_SIGNUP_GCIP_VERIFIED_USER == true) {
            return next(
                new CustomError("Not authorized", 401)
            );
        }

        sendToken(res, user, next, 200);

    } catch (error) {
        console.log(error);
        new CustomError("Error occurred while processing request", 500)
    }
});
module.exports = { performAuth };
