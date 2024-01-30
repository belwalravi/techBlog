const express = require("express")
const imageupload = require("../Helpers/Libraries/imageUpload");

const {addStory,getAllStories,detailStory,likeStory, editStory, deleteStory, editStoryPage } = require("../Controllers/story")
const { checkStoryExist, checkUserAndStoryExist } = require("../Middlewares/database/databaseErrorhandler");
const { performAuth } = require("../Controllers/iapAuth");

const router = express.Router() ;

router.post("/:slug", checkStoryExist, detailStory)

router.get("/getAllStories",getAllStories)

router.post("/addstory" ,[imageupload.single("image")],addStory)//performAuth

router.post("/:slug/like",[performAuth,checkStoryExist] ,likeStory)

router.get("/editStory/:slug",[performAuth,checkStoryExist,checkUserAndStoryExist] , editStoryPage)

router.put("/:slug/edit",[performAuth,checkStoryExist,checkUserAndStoryExist, imageupload.single("image")] ,editStory)

router.delete("/:slug/delete",[performAuth,checkStoryExist,checkUserAndStoryExist] ,deleteStory)


module.exports = router