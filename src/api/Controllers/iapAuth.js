const asyncErrorWrapper = require("express-async-handler");
const { OAuth2Client } = require("google-auth-library");
const CustomError = require("../Helpers/error/CustomError");
const {
    isJWTTokenIncluded,
    getAccessTokenJWTFromHeader,
} = require("../Helpers/auth/tokenHelpers");
const User = require("../Models/user");
const { sendToken } = require("../Helpers/auth/tokenHelpers");

const expectedAudience = (process.env?.IAP_SIGNED_HEADER).replace(/\n/g, '');     // console.log("--> cheking for verify_iap_jwt (performAuth) \n",req.header("x-goog-iap-jwt-assertion"))
const admUserEnv = process.env?.TENANT_ADM_USER ? process.env?.TENANT_ADM_USER : null;

const performAuth = asyncErrorWrapper(async (req, res, next) => {

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
        
        if(!userEmail || !admUserEnv){
            !admUserEnv?console.log("Check environment variables TENANT_ADM_USER"):null
            return next(
            new CustomError("Not authorized", 401)
            );
        }

        const user = await User.findOne({ email: userEmail });  // console.log("user -> ",JSON.stringify(user))
        
        if(Boolean(process.env?.AUTO_SIGNUP_GCIP_VERIFIED_USER) == true && !user)
        {   
            if(admUserEnv == userEmail)
            {
                console.log("creating GCIP verified admin user.")
                var createRes= await User.create({ email : userEmail, username : userEmail.split('@')[0]})
                console.log("createRes >> ",createRes.username)
            }
        }

        if (!user && !Boolean(process.env?.AUTO_SIGNUP_GCIP_VERIFIED_USER) == true) {
            console.log("user 404")
            return next(
                new CustomError("Not authorized", 401)
            );
        }

        else { sendToken(res, user, next, 200); }

    } catch (error) {
        console.log(error);
        new CustomError("Error occurred while processing request", 500)
    }
});

module.exports = { performAuth };


777