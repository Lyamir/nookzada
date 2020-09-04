const mongoose = require('mongoose')
const orderSchema = mongoose.Schema({
        _id: {
            type: Number,
            required: true
        },
        userID: {
            type: String,
            required: true,
            unique: false
        },
        items: {
            type: []
        }
    })

    const orderModel = mongoose.model('orders', orderSchema);

    module.exports = {orderModel}