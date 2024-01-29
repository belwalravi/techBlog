const express = require("express")

const imageUpload = require("../Helpers/Libraries/imageUpload");

const {profile,editProfile,addStoryToReadList,readListPage} = require("../Controllers/user");
const { performAuth } = require("../Controllers/iapAuth");


const router = express.Router() ;

router.get("/profile",performAuth ,profile)

router.post("/editProfile",[performAuth ,imageUpload.single("photo")],editProfile)

router.post("/:slug/addStoryToReadList",performAuth ,addStoryToReadList)

router.get("/readList",performAuth ,readListPage)


module.exports = router