const express = require("express");
const router = express.Router();

const {createOrder, readAllOrders} = require('../controllers/order');
const {isSignedIn, isAuth, isAdmin} = require('../controllers/auth');
const {userById, addOrderToUserHistory} = require('../controllers/user');

router.post('/order/create', addOrderToUserHistory, createOrder);
router.get('/orders/read/all/:userId', isSignedIn, isAuth, isAdmin, readAllOrders)

router.param('userId', userById);

module.exports = router;