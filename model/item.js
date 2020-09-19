const mongoose = require('mongoose')

const reviewSchema = mongoose.Schema({
    userID: mongoose.Schema.ObjectId,
    username: String,
    rating: Number,
    description: String,
    date: Date
})

const itemSchema = mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    itemlist: {
        type: [],
        required: false
    },
    image: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    timesSold: {
        type: Number,
        required: true
    },
    reviews: {
        type: [reviewSchema]
    }
})

const itemModel = mongoose.model('items', itemSchema)

module.exports = itemModel