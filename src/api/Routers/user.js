const express = require("express")
const imageUpload = require("../Helpers/Libraries/imageUpload");
const {profile,editProfile,addStoryToReadList,readListPage} = require("../Controllers/user");
const { authenticator } = require("../Middlewares/Authorization/authenticator");

const router = express.Router() ;

router.get("/profile",authenticator ,profile)

router.post("/editProfile",[authenticator,imageUpload.single("photo")],editProfile)

router.post("/:slug/addStoryToReadList" ,addStoryToReadList) // performAuth

router.get("/readList",authenticator ,readListPage)


module.exports = router