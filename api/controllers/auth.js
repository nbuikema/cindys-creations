const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const bcrypt = require('bcrypt');
const crs = require('crypto-random-string');
const sgMail = require('@sendgrid/mail');
const User = require('../models/user');

exports.signup = (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    const user = new User(req.body);
    user.save((err, user) => {
        if(err) {
            return res.status(400).json({error: 'Could not signup new user.'});
        }
        user.password = undefined;
        res.json({user: user});
    });
};

exports.signupValidator = (req, res, next) => {
    req.check('first_name', 'First name is required.').notEmpty();
    req.check('last_name', 'Last name is required.').notEmpty();
    req.check('email', 'Email is required.').notEmpty();
    req.check('email', 'Invalid email format.').matches(/.+\@.+\..+/);
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

exports.signin = (req, res) => {
    const {email, password} = req.body;
    User.findOne({email}, (err, user) => {
        if(err || !user) {
            return res.status(400).json({error: 'Could not signin user.'});
        }
        if(!bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({error: 'Email and Password do not match.'});
        }
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: '60m'});
        const {_id, email, first_name, last_name, role, address, city, state, zip} = user;
        return res.json({token, user: {_id, email, first_name, last_name, role, address, city, state, zip}});
    });
};

exports.signinValidator = (req, res, next) => {
    req.check('email', 'Email is required.').notEmpty();
    req.check('email', 'Invalid email format.').matches(/.+\@.+\..+/);
    req.check('password', 'Password is required.').notEmpty();
    const errors = req.validationErrors();
    if(errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({error: firstError});
    }
    next();
};

exports.signout = (req, res) => {
    res.clearCookie('jwt');
    res.json({message: 'User signed out.'});
};

exports.isSignedIn = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'auth'
});

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id.toString() === req.auth._id.toString();
    if(!user) {
        return res.status(403).json({error: 'You are not authorized to do that.'});
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if(req.profile.role === 0) {
        return res.status(403).json({error: 'You must be an admin to do that.'});
    }
    next();
};

exports.forgotPassword = (req, res) => {
    const tempPassword = crs({length: 20});
    req.body.password = bcrypt.hashSync(tempPassword, 10);
    User.findOneAndUpdate(
        {email: req.body.email},
        {$set: req.body},
        {new: true},
        (err, user) => {
            if(err) {
                return res.status(400).json({error: 'You are not authorized to do that.'});
            }
            const emailData = {
                to: req.body.email,
                from: 'noreply@cindyscreations.com',
                subject: `Password Reset Instructions`,
                html: `<p>You have recently requested a new password. To reset your password, sign in with the temporary password ${tempPassword} and visit Update Account to change your password.</p>`
            };
            sgMail.send(emailData);
            user.password = undefined;
            return res.json(user);
        }
    );
};