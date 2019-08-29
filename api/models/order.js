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
        email: {
            type: String,
            trim: true,
            required: true
        },
        user: {
            type: ObjectId,
            ref: 'User'
        },
        products: [CartItemSchema],
        total_price: Number,
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        zip: {
            type: String,
            required: true
        }, 
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