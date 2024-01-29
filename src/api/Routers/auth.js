const express = require("express")

const {getPrivateData} = require("../Controllers/auth");

const router = express.Router() ;

router.get("/private",getPrivateData)

module.exports = router