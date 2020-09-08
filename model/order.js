const mongoose = require('mongoose')
const orderSchema = mongoose.Schema({
        userID: {
            type: String,
            required: true,
            unique: false,
            ref: 'userModel'
        },
        items: {
            type: []
        }
    })

    const orderModel = mongoose.model('orders', orderSchema);

    module.exports = {orderModel}