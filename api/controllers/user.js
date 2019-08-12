const User = require("../models/user");

exports.helloWorldAuth = (req, res) => {
    res.send('hello world user routes authorized user');
};

exports.helloWorldAdmin = (req, res) => {
    res.send('hello world user routes admin');
};

exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if(err || !user) {
            return res.status(400).json({
                error: 'User was not found.'
            });
        }
        req.profile = user;
        next();
    });
};