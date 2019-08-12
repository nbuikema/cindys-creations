const User = require('../models/user');

exports.helloWorld = (req, res) => {
    res.send('hello world auth routes');
};

exports.signup = (req, res) => {
    const user = new User(req.body);
    user.save((err, user) => {
        if(err) {
            return res.status(400).json({
                error: 'Could not signup new user.'
            });
        }
        user.salt = undefined;
        user.hashed_password = undefined;
        res.json({user: user});
    });
};