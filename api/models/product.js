const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        image: {
            data: Buffer,
            contentType: String
        },
        price: {
            type: Number,
            trim: true,
            required: true
        },
        quantity: {
            type: Number
        }
    }, {timestamps: true}
);

module.exports = mongoose.model('Product', productSchema);