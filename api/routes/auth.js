const express = require("express");
const router = express.Router();

const {helloWorld, signup} = require('../controllers/auth');

router.get('/auth', helloWorld);
router.post('/auth/signup', signup);

module.exports = router;