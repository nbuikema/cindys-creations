const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const CartItemSchema = new mongoose.Schema(
    {
        product: {
            type: ObjectId,
            ref: 'Product'
        },
        name: String,
        price: Number,
        count: Number
    }, {timestamps: true}
);

const CartItem = mongoose.model('CartItem', CartItemSchema);

const OrderSchema = new mongoose.Schema(
    {
        transaction_id: {},
        user: {
            type: ObjectId,
            ref: 'User'
        },
        products: [CartItemSchema],
        total_price: Number,
        address: String,
        status: {
            type: String,
            enum: ['Received', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
            default: 'Received'
        },
        updated: Date
    }, {timestamps: true}
);

const Order = mongoose.model('Order', OrderSchema);

module.exports = {CartItem, Order};