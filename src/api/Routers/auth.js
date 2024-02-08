const express = require("express")
const { performAuth } = require("../Controllers/iapAuth");

const router = express.Router() ;

router.get("/private",performAuth)

module.exports = router