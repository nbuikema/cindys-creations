const express = require("express");
const router = express.Router();

const {helloWorld} = require('../controllers/user');

router.get('/user', helloWorld);

module.exports = router;