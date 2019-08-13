const express = require("express");
const router = express.Router();

const {helloWorldAuth, helloWorldAdmin, userById, readUser, updateUser, deleteUser} = require('../controllers/user');
const {isSignedIn, isAuth, isAdmin} = require('../controllers/auth');

router.get('/user/auth/:userId', isSignedIn, isAuth, helloWorldAuth);
router.get('/user/admin/:userId', isSignedIn, isAuth, isAdmin, helloWorldAdmin);
// createUser = auth-signup
router.get('/user/:userId', isSignedIn, isAuth, readUser);
router.put('/user/:userId', isSignedIn, isAuth, updateUser);
router.delete('/user/:userId', isSignedIn, isAuth, deleteUser);

router.param('userId', userById);

module.exports = router;