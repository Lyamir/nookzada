const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
let SALT = 10

const reviewSchema = mongoose.Schema({
    itemID: String,
    itemname: String,
    rating: Number,
    description: String,
    date: Date
})

const userSchema = mongoose.Schema({
        username: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        userType: {
            type: String,
            required: true
        },
        reviews: {
            type: [reviewSchema]
        },
        cart: {
            type: [{
                itemID: String, 
                itemname: String,
                image: String, 
                price: Number, 
                quantity: Number,
                subtotal: Number
            }],
        },
        orders: {
            type: [{
                items: [{
                    itemname: String,
                    quantity: Number,
                    subtotal: Number, 
                }], 
                totalprice: Number
            }]
        }
    })

    userSchema.pre('save', function(next){
        var user = this;

        if(user.isModified('password')){
            bcrypt.genSalt(SALT, (err, salt)=>{
                if(err) return next(err)

                bcrypt.hash(user.password, salt, (err, hash)=>{
                    if(err) return next(err)
                    user.password = hash;
                    next();
                })
            })
        }
        else{
            next();
        }
    })

    userSchema.methods.comparePassword = function(candidatePassword, checkpassword){
        bcrypt.compare(candidatePassword, this.password, (err, isMatch)=>{
            if(err) return checkpassword(err)
            checkpassword(null, isMatch)
        })
    }

    const userModel = mongoose.model('users', userSchema);

    module.exports = userModel