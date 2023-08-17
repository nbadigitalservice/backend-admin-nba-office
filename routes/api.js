var express = require('express');
var router = express.Router();
var Orders = require("../controller/orders.controller");
var {AuthorizeUser} = require('../middleware/auth');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/orders',AuthorizeUser,Orders.GetOrders);

router.post('/login' )

module.exports = router;
