const express = require('express');
const router = express.Router();

const {orderById, createOrder, readAllOrders, ordersByEmail, readOrdersByEmail, readOrderStatusValues, updateOrderStatus} = require('../controllers/order');
const {isSignedIn, isAuth, isAdmin} = require('../controllers/auth');
const {userById, addOrderToUserHistory} = require('../controllers/user');

router.post('/order/create', addOrderToUserHistory, createOrder);
router.get('/orders/read/all/:userId', isSignedIn, isAuth, isAdmin, readAllOrders);
router.get('/orders/read/email/:orderEmail', readOrdersByEmail);
router.get('/order/status/values/:userId', isSignedIn, isAuth, isAdmin, readOrderStatusValues);
router.put('/order/status/update/:orderId/:userId', isSignedIn, isAuth, isAdmin, updateOrderStatus);

router.param('userId', userById);
router.param('orderId', orderById);
router.param('orderEmail', ordersByEmail);

module.exports = router;