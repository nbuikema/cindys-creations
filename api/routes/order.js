const express = require("express");
const router = express.Router();

const {createOrder} = require('../controllers/order');
const {isSignedIn, isAuth, isAdmin} = require('../controllers/auth');
const {userById, addOrderToUserHistory} = require('../controllers/user');

router.post('/order/create', addOrderToUserHistory, createOrder);

router.param('userId', userById);

module.exports = router;