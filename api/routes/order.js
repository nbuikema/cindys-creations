const express = require("express");
const router = express.Router();

const {createOrder} = require('../controllers/order');
const {isSignedIn, isAuth, isAdmin} = require('../controllers/auth');
const {userById} = require('../controllers/user');

router.post('/order/create', createOrder);

router.param('userId', userById);

module.exports = router;