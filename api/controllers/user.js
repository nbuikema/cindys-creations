const User = require("../models/user");

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

exports.readUser = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};

exports.updateUser = (req, res) => {
    User.findOneAndUpdate(
        {_id: req.profile._id},
        {$set: req.body},
        {new: true},
        (err, user) => {
            if(err) {
                return res.status(400).json({error: 'You are not authorized to do that.'});
            }
            user.hashed_password = undefined;
            user.salt = undefined;
            return res.json(user);
        }
    );
};

exports.deleteUser = (req, res) => {
    User.findOneAndDelete(
        {_id: req.profile._id},
        (err, deletedUser) => {
            if(err) {
                return res.status(400).json({error: 'You are not authorized to do that.'});
            }
            return res.json({message: 'User successfully deleted.'});
        }
    );
};