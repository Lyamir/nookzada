const userModel = require('../model/user')
const itemModel = require ('../model/item')
var mongoose = require('mongoose')


function isAdmin(user) {
    if(user === undefined)
        return false
    return user.userType === 'Admin'? true : false
}

const routerFunctions = {
    getIndex: (req, res)=>{
        if(req.session.user)
		    res.render('index', {user: req.session.user})
	    else
		    res.render('index')
    },

    getAbout: (req, res)=>{
        if(req.session.user)
		    res.render('about', {user:req.session.user})
	    else
		    res.render('about')
    },

    getContact: (req, res)=>{
        if(req.session.user)
		    res.render('contact', {user:req.session.user})
	    else
		    res.render('contact')
    },

    getSignup: (req, res)=>{
        if(req.session.user)
            res.render('register', {user: req.session.user})
        else
            res.render('register')
    },

    getLogin: (req, res)=>{
        if(req.session.user)
            res.render('login', {user: req.session.user})
        else
            res.render('login')
    },

    getShop: async (req, res)=>{
        await itemModel.find({}).sort({name: +1}).exec(function(err, item) { 
            if(err){
                console.log("Error: " + err)
                throw(err)
            }else{
                if(req.session.user){
                    res.render('shop', {
                        user: req.session.user,
                        item:item,
                        name: item.name,
                        price: item.price,
                        id: item._id,
                        description: item.description,
                        itemList: item.itemList,
                        image: item.image,
                        stock: item.stock,
                        value_d: "shop",
                        title_d: "Default sorting",
                        value_p: "sort",
                        title_p: "Popularity"
                    })
                }
                else{
                    res.render('shop', {
                        item:item,
                        name: item.name,
                        price: item.price,
                        id: item._id,
                        description: item.description,
                        itemList: item.itemList,
                        image: item.image,
                        stock: item.stock,
                        value_d: "shop",
                        title_d: "Default sorting",
                        value_p: "sort",
                        title_p: "Popularity"
                    })
                }
            }
        })
    },

    getItem: async (req, res)=>{
        if(req.session.user){
            await itemModel.findById(req.params._id, (function(err, item){
                res.render('item', {
                    name: item.name,
                    price: item.price,
                    id: item._id,
                    description: item.description,
                    itemList: item.itemList,
                    image: item.image,
                    stock: item.stock,
                    user:req.session.user
                })
            }))
        }else{
            console.log(req.params.id)
            await itemModel.findById(req.params._id, (function(err, item){
                    console.log(item.name)
                    res.render('item', {
                        name: item.name,
                        price: item.price,
                        id: item._id,
                        description: item.description,
                        itemlist: item.itemlist,
                        image: item.image,
                        stock: item.stock
                    })
                }))
        }
    },

    getLogout: (req, res)=>{
        if(req.session.user){
            req.session.destroy((err)=>{
                if(err){
                    res.render('index', {
                        error: "Error in logging out!"
                    })
                }
                else{
                    res.render('index')
                }
            })
        }
    },

    sortShop: function(req, res){
            itemModel.find({}).sort({timesSold: -1}).exec(function(err, item) { 
                if(err){
                    console.log("Error: " + err)
                    throw(err)
                }else{
                    if(req.session.user){
                        res.render('shop', {
                            user: req.session.user,
                            item:item,
                            name: item.name,
                            price: item.price,
                            id: item._id,
                            description: item.description,
                            itemList: item.itemList,
                            image: item.image,
                            stock: item.stock,
                            value_d: "sort",
                            title_d: "Popularity",
                            value_p: "shop",
                            title_p: "Default sorting"
                        })
                    }
                    else{
                        res.render('shop', {
                            item:item,
                            name: item.name,
                            price: item.price,
                            id: item._id,
                            description: item.description,
                            itemList: item.itemList,
                            image: item.image,
                            stock: item.stock,
                            value_d: "sort",
                            title_d: "Popularity",
                            value_p: "shop",
                            title_p: "Default sorting"
                        })
                    }
                }
            });
    },

    postLogin: (req, res)=>{
        userModel.findOne({'email': req.body.email}, (err, user)=>{
            if(!user){
                res.render('login', {
                    error: "Login failed, user not found!"
                })
            }else{
                user.comparePassword(req.body.password, (err, isMatch)=>{
                    if(!isMatch){
                        res.render('login', {
                            error: "Wrong password!"
                        })
                    }else{
                        if(isAdmin(user)){
                            req.session.user = user
                            res.locals.user = user
                            console.log(req.session.user.email)
                            res.render('add', {user:user})    
                        }
                        else{
                            req.session.user = user
                            res.locals.user = user
                            console.log(req.session.user.email)
                            res.render('index', {user:user})                            
                        }

                    }
                })
            }
        })
    },

    postSignup: (req,res)=>{
        userModel.findOne({'email': req.body.email}, (err, user)=>{
            if(user){
                res.render('register', {
                    error: "Email already exist!"
                })
            }
            })
        if(req.body.password != req.body.confirmpassword){
            res.render('register', {
                error: "Passwords do not match!"
            })
        }else{
            let user = new userModel({
                _id: new mongoose.Types.ObjectId(),
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                userType: 'User',
                reviewList: []
            })
            
            user.save(function (err){
                if (err)
                    res.render('register',{
                        error: "Error: ${err}"
                    })    
            })
        }
    },

    addItem: (req,res)=>{
        let name = req.body.name;
        let price = req.body.price;
        let description = req.body.desc;
        let image = req.body.image;
        let stock = req.body.stock;
        let id;
        itemModel.countDocuments({}, function(err, result) {
            if (err) {
              console.log(err);
            } else {
              id = result+1;
            }
          });
    
        let item = new itemModel({
            _id: id,
            name: name,
            price: price,
            description: description,
            itemList: [],
            image: image,
            stock: stock,
            timesSold: 0
        })
    
        item.save((err, item)=>{
            if(err)
                console.log(err)
            else{
                res.redirect('/')
                console.log(`${item.name} added`)
            }
        })
    },
    
    searchItem: (req,res)=>{
        let search = new RegExp (req.query.search, "i");
    
        itemsModel.aggregate([{$match: {name: search}}], (err, data)=>{
            if (data === undefined)
                console.log('ops wala')
            else{
                res.render('index', {
                    searchname: JSON.parse(JSON.stringify(data))
                })
            }
        })
    },

    deleteItem: function(req, res){
        itemModel.remove({_id:req.params.id}, function(err, delItem){
            if(err){
                console.log("Error: " + err)
                throw(err)
            }
            res.redirect('/')
        });
    },

    editItem: function(req, res) {
        var id = req.params.id;
        var item = new itemModel({
            name: req.body.name,
            price: req.body.price,
            description: req.body.desc,
            itemList: [],
            image: req.body.image,
            stock: req.body.stock,
            timesSold: req.body.timesSold
        })
        itemModel.findByIdAndUpdate(id, item, function(err, item){
            if(err){
                console.log("Error: " + err)
                throw(err)
            }
            res.redirect('/')
        });
    },

    getCart: async function(req, res){
        let total = 0;
        if(req.session.user){
            await userModel.findById(req.session.user._id, (err, user)=>{
                if(err)
                    console.log(err)
                else{   
                        for(let i = 0; i < user.cart.length; i++){
                            total += user.cart[i].subtotal;
                        } 
                        res.render('cart', {
                                user: user,
                                cart: user.cart,
                                total: total
                            })                    
                    }
                })            
            }else{
                res.redirect('/login')
            }
    },

    addCart: (req, res)=>{
        let id = req.params.id
        let qty;
        let total = 0;
        console.log(req.body.qty)
        if(req.body.qty != null)
            qty = req.body.qty
        else
            qty = 1
        itemModel.findById(id, (err, item)=>{
            if(err)
                console.log(err)
            else{
                console.log(item)
                let query = {
                    $push: {"cart": {
                        itemID: item._id,
                        itemname: item.name,
                        image: item.image,
                        price: item.price,
                        quantity: qty,
                        subtotal: item.price * qty   
                    }}    
                }
                console.log(req.session.user._id)
                userModel.findByIdAndUpdate(req.session.user._id, query, {safe: true, upsert: true}, (err, user)=>{
                    if(err)
                        console.error(err)
                    else   
                        console.log("pushed to cart")
                })
                res.redirect('/cart')
            }
        })
    },

    deleteCart: (req, res)=>{
        let id = req.params.id
        let delID;
        let total = 0;

        itemModel.findById(id, (err, item)=>{
            if(err)
                console.log(err)
            else{
                for(let i = 0; i < req.session.user.cart.length; i ++){
                    if(req.session.user.cart[i].itemID == req.params.id)
                        delID = req.session.user.cart[i]._id
                }
                console.log(item)
                let query = {
                    $pull: {"cart": {
                        //itemID: id
                        _id:delID 
                    }}    
                }
                console.log(req.session.user._id)
                userModel.findByIdAndUpdate(req.session.user._id, query, {safe: true, upsert: true}, (err, user)=>{
                    if(err)
                        console.error(err)
                    else   
                        console.log("deleted from cart")
                })
                res.redirect('/cart')
            }
        })
    },

    getProfile: (req, res)=>{
        let numReview = 0;
        if(req.session.user){
            for(let i = 0; i < req.session.user.reviews.length; i++){
                numReview++; 
            }
            res.render('profile', {
                user: req.session.user,
                username: req.session.user.username,
                numReview: numReview,
                reviews: req.session.user.reviews,
                r_itemname: req.session.user.reviews.itemname,
                r_rating: req.session.user.reviews.rating,
                r_description: req.session.user.reviews.description,
                r_date: req.session.user.reviews.Date
            })     
        }
        else{
            res.redirect('/login')
        }
    },
    getAddItem: (req, res)=>{
        if(isAdmin(req.session.user)){
            res.render('add')
        }
        else
            res.redirect('/')
    },
    getEditItem: (req, res)=>{
        if(isAdmin(req.session.user)){
            itemModel.find({}, (err, items)=>{
                res.render('edit', {
                    items: items
                })
            })
        }
        else
            res.redirect('/')
    },
    getDeleteItem: (req, res)=>{
        if(isAdmin(req.session.user)){
            itemModel.find({}, (err, items)=>{
                res.render('delete', {
                    items: items
                })
            })
        }
        else
            res.redirect('/')
    }
}

module.exports = routerFunctions