const express = require("express")
const imageupload = require("../Helpers/Libraries/imageUpload");
const {addStory,getAllStories,detailStory,likeStory, editStory, deleteStory, editStoryPage } = require("../Controllers/story")
const { checkStoryExist, checkUserAndStoryExist } = require("../Middlewares/database/databaseErrorhandler");
const { authenticator } = require("../Middlewares/Authorization/authenticator");

const router = express.Router() ;

router.post("/addstory" ,[authenticator, imageupload.single("image")], addStory)//performAuth

router.get("/getAllStories",authenticator,getAllStories)

router.post("/:slug/like",[authenticator,checkStoryExist] ,likeStory)

router.get("/editStory/:slug",[authenticator,checkStoryExist,checkUserAndStoryExist] , editStoryPage)

router.put("/:slug/edit",[authenticator,checkStoryExist,checkUserAndStoryExist, imageupload.single("image")] ,editStory)

router.delete("/:slug/delete",[authenticator,checkStoryExist,checkUserAndStoryExist] ,deleteStory)

router.post("/:slug", detailStory)

module.exports = router