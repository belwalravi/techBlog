const express = require("express")
const imageupload = require("../Helpers/Libraries/imageUpload");

const {addStory,getAllStories,detailStory,likeStory, editStory, deleteStory, editStoryPage } = require("../Controllers/story")
const { checkStoryExist, checkUserAndStoryExist } = require("../Middlewares/database/databaseErrorhandler");
const { performAuth } = require("../Controllers/iapAuth");
const { authenticator } = require("../Helpers/auth/authenticator");

const router = express.Router() ;

// router.post("/addstory" ,addStory)//performAuth

// router.post("/:slug", checkStoryExist, detailStory)

router.post("/addstory" ,[authenticator, imageupload.single("image")], addStory)//performAuth

router.get("/getAllStories",getAllStories)

router.post("/:slug/like",[performAuth,checkStoryExist] ,likeStory)

router.get("/editStory/:slug",[performAuth,checkStoryExist,checkUserAndStoryExist] , editStoryPage)

router.put("/:slug/edit",[performAuth,checkStoryExist,checkUserAndStoryExist, imageupload.single("image")] ,editStory)

// router.delete("/:slug/delete",[performAuth,checkStoryExist,checkUserAndStoryExist] ,deleteStory)
router.delete("/:slug/delete",[authenticator,checkStoryExist,checkUserAndStoryExist] ,deleteStory)

router.post("/:slug", detailStory)

module.exports = router