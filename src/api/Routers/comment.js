const express = require("express")

const { addNewCommentToStory ,getAllCommentByStory,commentLike ,getCommentLikeStatus} = require("../Controllers/comment")

const { checkStoryExist } = require("../Middlewares/database/databaseErrorhandler");
const { performAuth } = require("../Controllers/iapAuth");
const { authenticator } = require("../Helpers/auth/authenticator");

const router = express.Router() ;

router.post("/:slug/addComment",[authenticator,checkStoryExist] ,addNewCommentToStory)

router.get("/:slug/getAllComment",getAllCommentByStory)

router.post("/:comment_id/like",commentLike)

router.post("/:comment_id/getCommentLikeStatus",getCommentLikeStatus)


module.exports = router