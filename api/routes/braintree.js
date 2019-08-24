const express = require('express');
const router = express.Router();

const {generateToken} = require('../controllers/braintree');
const {isSignedIn, isAuth, isAdmin} = require('../controllers/auth');
const {userById} = require('../controllers/user');

router.get('/braintree/token', generateToken);

router.param('userId', userById);

module.exports = router;