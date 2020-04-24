const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

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
            type: ObjectId,
            ref: 'Category',
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
        sold: {
            type: Number,
            default: 0
        },
        images: {
            type: Array
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }
);

module.exports = mongoose.model('Product', productSchema);