var express = require('express');
var router = express.Router();
var Callback = require("../controller/callback.controller");

router.post('/shopcallback',Callback.ShopCallback);

module.exports = router;