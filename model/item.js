const mongoose = require('mongoose')

const reviewSchema = mongoose.Schema({
    userID: String,
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

itemSchema.methods.getAverageStars = function(){
    let average, sum;
    if(this.reviews.length == 0)
        return 0
    else{
        for(let i = 0; i < this.reviews.length; i++){
            sum += this.reviews[i].rating
        }
        average = sum/this.reviews.length
        return Math.round(average)
    }
}
const itemModel = mongoose.model('items', itemSchema)

module.exports = itemModel