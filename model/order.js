const mongoose = require('mongoose')
const orderSchema = mongoose.Schema({
        userID: {
            type: String,
            required: true
        },
        items: {
            type: []
        }
    })

    const orderModel = mongoose.model('orders', orderSchema);

    module.exports = {orderModel}