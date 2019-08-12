const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
mongoose.connect(process.env.DATABASE, {useNewUrlParser: true}, () => {
    console.log('database connected');
});

app.get('/', (req, res) => {
    res.send('hello world');
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`server running on port ${port}`);
});