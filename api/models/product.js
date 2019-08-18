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
        }
    }, {timestamps: true}
);

module.exports = mongoose.model('Product', productSchema);