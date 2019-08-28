const {Order, CartItem} = require('../models/order');

exports.createOrder = (req, res) => {
    const order = new Order(req.body.order);
    order.save((error, data) => {
        if(error) {
            res.status(400).json({error: 'Could not create order.'});
        }
        res.json(data);
    });
};