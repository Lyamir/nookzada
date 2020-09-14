const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
let SALT = 10
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
            type: [],
            itemID: {
                type: mongoose.Types.ObjectId(),
                required: true
            },
            itemname: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            description: {
                type: String
            },
            date: {
                type: Date,
                required: true
            }
        },
        orders: {
            type: [],
            _id: {
                type: mongoose.Types.ObjectId(),
                required: true
            },
            items: {
                type: [],
                itemname: {
                    type: String,
                    required: true
                },
                price: {
                    type: Number,
                    required: true
                }
            },
            totalprice: {
                type: Number,
                required: true
            }
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

    module.exports = {userModel}