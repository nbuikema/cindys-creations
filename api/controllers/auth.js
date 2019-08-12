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

exports.signupValidator = (req, res, next) => {
    req.check('first_name', 'First name is required.').notEmpty();
    req.check('last_name', 'Last name is required.').notEmpty();
    req.check('email', 'Email must contain @ symbol.').matches(/.+\@.+\..+/);
    req.check('password', 'Password is required.').notEmpty();
    req.check('password', 'Password must contain at least 6 characters.').isLength({min: 6});
    req.check('password', 'Password must contain a number.').matches(/\d/);
    const errors = req.validationErrors();
    if(errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({error: firstError});
    }
    next();
};