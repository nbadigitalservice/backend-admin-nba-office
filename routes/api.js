var express = require('express');
var router = express.Router();
var Orders = require("../controller/orders.controller");
var {AuthorizeUser} = require('../middleware/auth');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'NBA Official api' });
});

router.get('/orders',AuthorizeUser,Orders.GetOrders);
router.get('/orders/:id',AuthorizeUser,Orders.GetOrdersById);
router.post('/sendfeedback/:id',AuthorizeUser,Orders.OrderFeedback);
router.post('/doneorder/:id',AuthorizeUser,Orders.DoneOrder);

module.exports = router;
