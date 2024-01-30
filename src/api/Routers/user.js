const express = require("express")

const imageUpload = require("../Helpers/Libraries/imageUpload");

const {profile,editProfile,addStoryToReadList,readListPage} = require("../Controllers/user");
const { performAuth } = require("../Controllers/iapAuth");
const { authenticator } = require("../Helpers/auth/authenticator");


const router = express.Router() ;

// router.get("/profile",performAuth ,profile)
router.get("/profile",authenticator ,profile)

router.post("/editProfile",[authenticator,imageUpload.single("photo")],editProfile)

router.post("/:slug/addStoryToReadList" ,addStoryToReadList) // performAuth

router.get("/readList",performAuth ,readListPage)


module.exports = router