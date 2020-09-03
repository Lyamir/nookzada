const mongoose = require('mongoose')

const reviewSchema = mongoose.Schema({
    _id: {
        userid:{
            type: ObjectId(),
            required: true
        },
        itemid: {
            type: ObjectId(),
            required: true
        }
    },
    rating: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: false
    }
})

const reviewModel = mongoose.model('reviews', reviewSchema)

module.exports = {reviewModel}