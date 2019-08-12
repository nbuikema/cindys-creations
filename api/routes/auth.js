const express = require("express");
const router = express.Router();

const {helloWorld} = require('../controllers/auth');

router.get('/auth', helloWorld);

module.exports = router;