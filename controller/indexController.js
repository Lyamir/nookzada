const userModel = require('../model/user')
const itemModel = require ('../model/item')
var mongoose = require('mongoose')
var multer = require('multer')
var upload = multer({dest: __dirname + 'public/images/items/'})
const emailjs = require('emailjs');
require('dotenv').config();

const client = new emailjs.SMTPClient({
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS,
    host: 'smtp-mail.outlook.com',
    tls: {
        ciphers: 'SSLv3',
    },
});

const hbs = require('hbs')
function isAdmin(user) {
    if(user === undefined)
        return false
    return user.userType === 'Admin'? true : false
}
hbs.registerHelper('times', function(n, block) {
    var accum = '';
    for(var i = 0; i < n; ++i)
        accum += block.fn(i);
    return accum;
});

hbs.registerHelper('emptystars', function(n, block) {
    var accum = '';
    for(var i = 0; i < n; ++i)
        accum += block.fn(i);
    if(isNaN(5-accum))
        return ""
    return 5-accum;
});

const routerFunctions = {
    getIndex: (req, res)=>{
        if(req.cookies.user)
            req.session.user = req.cookies.user
        if(req.session.user){
            if(isAdmin(req.session.user)){
                res.render('index', {
                    user: req.session.user,
                    admin: true
                })
            }else
                res.render('index', {user: req.session.user})
        }
	    else
		    res.render('index')
    },

    getAbout: (req, res)=>{
        if(req.cookies.user)
            req.session.user = req.cookies.user
        if(req.session.user){
            if(isAdmin(req.session.user)){
                res.render('about', {
                    user: req.session.user,
                    admin: true
                })
            }else
                res.render('about', {user: req.session.user})
        }
	    else
		    res.render('about')
    },

    getContact: (req, res)=>{
        if(req.cookies.user)
            req.session.user = req.cookies.user
        if(req.session.user){
            if(isAdmin(req.session.user)){
                res.render('contact', {
                    user: req.session.user,
                    admin: true
                })
            }else
                res.render('contact', {user: req.session.user})
        }
	    else
		    res.render('contact')
    },

    getSignup: (req, res)=>{
        if(req.cookies.user)
            req.session.user = req.cookies.user
        if(req.session.user){
            if(isAdmin(req.session.user)){
                res.render('register', {
                    user: req.session.user,
                    admin: true
                })
            }else
                res.render('register', {user: req.session.user})
        }
        else
            res.render('register')
    },

    getLogin: (req, res)=>{
        if(req.cookies.user)
            req.session.user = req.cookies.user
        if(req.session.user){
            if(isAdmin(req.session.user)){
                res.render('login', {
                    user: req.session.user,
                    admin: true
                })
            }else
                res.render('login', {user: req.session.user})
        }
        else
            res.render('login')
    },

    getShop: async (req, res)=>{
        await itemModel.find({}).sort({name: +1}).exec(function(err, item) { 
            if(err){
                console.log("Error: " + err)
                throw(err)
            }else{
                if(req.cookies.user)
                    req.session.user = req.cookies.user
                if(req.session.user){
                    if(isAdmin(req.session.user)){
                        res.render('index', {
                            user: req.session.user,
                            admin: true,
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
                    }else
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
        if(req.cookies.user)
            req.session.user = req.cookies.user
        if(req.session.user){
            await itemModel.findById(req.params._id, (function(err, item){
                if(isAdmin(req.session.user)){
                    res.render('login', {
                        user: req.session.user,
                        admin: true,
                        name: item.name,
                        price: item.price,
                        id: item._id,
                        description: item.description,
                        itemList: item.itemList,
                        image: item.image,
                        reviews: item.reviews,
                        stock: item.stock,
                        stars: item.getAverageStars(),
                        emptystars: 5-item.getAverageStars()
                    })
                }else{                 
                    console.log(item.reviews[0])
                    res.render('item', {
                        name: item.name,
                        price: item.price,
                        id: item._id,
                        description: item.description,
                        itemList: item.itemList,
                        image: item.image,
                        reviews: item.reviews,
                        stock: item.stock,
                        user:req.session.user,
                        stars: item.getAverageStars(),
                        emptystars: 5-item.getAverageStars()
                    })
                }
   
            }))
        }else{
            await itemModel.findById(req.params._id, (function(err, item){
                    console.log(item.name)
                    console.log(item.reviews)
                    console.log(item.getAverageStars())
                    res.render('item', {
                        name: item.name,
                        price: item.price,
                        id: item._id,
                        description: item.description,
                        itemlist: item.itemlist,
                        image: item.image,
                        reviews: item.reviews,
                        stock: item.stock,
                        stars: item.getAverageStars(),
                        emptystars: 5-item.getAverageStars()
                    })
                }))
        }
    },

    getLogout: (req, res)=>{
        if(req.cookies.user)
            req.session.user = req.cookies.user
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
                    if(req.cookies.user)
                        req.session.user = req.cookies.user
                    if(req.session.user){
                            if(isAdmin(req.session.user)){
                                res.render('login', {
                                    user: req.session.user,
                                    admin: true,
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
                            }else
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
                            if(req.body.remember){
                                res.cookie("user", req.session.user,{
                                    maxAge:1000*60*60*24*365,
                                    httpOnly:true
                                })
                            }
                            res.render('add', {user:user})    
                        }
                        else{
                            req.session.user = user
                            res.locals.user = user
                            console.log(req.session.user.email)
                            if(req.body.remember){
                                console.log("remember me!")
                                res.cookie("user", req.session.user,{
                                    maxAge:1000*60*60*24*365,
                                    httpOnly:true
                                })
                            }
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
                else
                    res.render('login', {
                        success: "Succesfully registered account!"
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
              console.log(err)
            } else {
              id = result + 1;
            }
       
          console.log(id)
            if (err) {  
                console.log("Something went wrong!");  
            }  
            // upload.single(req.body.image)
            // return res.send("File uploaded sucessfully!."); 
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
            console.log(item)
            item.save((err, item)=>{
                        if(err)
                            console.log(err)
                        else{
                            res.render('add', {
                                success: true
                            })
                            console.log('${item.name} added')
                        }
                    })  

        // let item = new itemModel({
        //     _id: id,
        //     name: name,
        //     price: price,
        //     description: description,
        //     itemList: [],
        //     image: image,
        //     stock: stock,
        //     timesSold: 0
        // })
        // console.log(item)
        // item.save((err, item)=>{
        //             if(err)
        //                 console.log(err)
        //             else{
        //                 res.redirect('/')
        //                 console.log('${item.name} added')
        //             }
        //         })
        // upload.single(req.body.image)
        
    });
    },
    
    searchItem: (req,res)=>{
        let search = new RegExp (req.body.search, 'gi');
    
        itemModel.aggregate([{$match: {name: search}}], (err, items)=>{
            if (items.length == 0)
               res.render('shop', {
                   item: items,
                   none:  `No items named ${req.body.search} were found`
               })
            else{
                res.render('shop', {
                    item: items
                })
            }
        })
    },

    deleteItem: function(req, res){
        itemModel.deleteOne({_id:req.params.id}, function(err, delItem){
            if(err){
                console.log("Error: " + err)
                throw(err)
            }
            res.redirect('/delete')
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
        if(req.cookies.user)
            req.session.user = req.cookies.user
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
        if(req.cookies.user)
            req.session.user = req.cookies.user
        if(req.session.user){
            
            userModel.findById(req.session.user._id, (err, user)=>{
                for(let i = 0; i < req.session.user.reviews.length; i++){
                    numReview++; 
                }

                let reviews2 = []

                for(let i = 1; i < numReview; i++){
                    reviews2.push(user.reviews[i]);
                }

                console.log(reviews2)
                res.render('profile', {
                user: user,
                username: user.username,
                numReview: numReview,
                review1: user.reviews[0],
                reviews: reviews2,
                r_itemname: req.session.user.reviews.itemname,
                r_rating: req.session.user.reviews.rating,
                r_description: req.session.user.reviews.description,
                r_date: req.session.user.reviews.Date
            })  
            })
   
        }
        else{
            res.redirect('/login')
        }
    },
    getAddItem: (req, res)=>{
        if(isAdmin(req.session.user)){
            res.render('add',{
                user:req.session.user
            })
        }
        else
            res.redirect('/')
    },
    getEditItem: (req, res)=>{
        if(req.cookies.user)
            req.session.user = req.cookies.user
        if(isAdmin(req.session.user)){
            itemModel.find({}, (err, items)=>{
                res.render('edit', {
                    user:req.session.user,
                    items: items,
                    id: items._id,
                    name: items.name,
                    price: items.price,
                    stock: items.stock,
                    image: items.image
                })
            })
        }
        else
            res.redirect('/')
    },
    getDeleteItem: (req, res)=>{
        if(req.cookies.user)
            req.session.user = req.cookies.user
        if(isAdmin(req.session.user)){
            itemModel.find({}, (err, items)=>{
                res.render('delete', {
                    user:req.session.user,
                    items: items,
                    id: items._id,
                    name: items.name,
                    price: items.price,
                    stock: items.stock,
                    image: items.image
                })
            })
        }
        else
            res.redirect('/')
    },
    addReview: (req, res)=>{
        itemModel.findById(req.params.id, (err, item)=>{
            userModel.findById(req.session.user._id, (err, user)=>{
                if(err)
                    console.log(err)
                else{
                    let date = new Date()
                    let description = req.body.description || ""
                    user.reviews.push({
                        itemID: item.id,
                        itemname: item.name,
                        rating: req.body.rating,
                        description: description,
                        date: `${date.getYear()+1900}-${date.getMonth()+1}-${date.getDate()}`
                    })
                    item.reviews.push({
                        userID: user._id,
                        username: user.username,
                        rating: req.body.rating,
                        description: description,
                        date: `${date.getYear()+1900}-${date.getMonth()+1}-${date.getDate()}`
                    })

                    user.save()
                    item.save()
                    console.log("review added")
                    res.redirect(`/item/${req.params.id}`)
                }
            })
        })
    },
    sendEmail : (req, res)=>{
        const message = new emailjs.Message({
            text: req.body.description,
            from: `${req.body.name} ${req.body.email}`,
            subject: 'Nookzada Inquiry',
            to: 'Nookzada carlos_doble@dlsu.edu.ph',
        });

        client.send(message, (err, message) => {
            console.log(err || message);    
        });

        res.redirect('/contact')
    },
    
    getPayment: async (req, res)=>{
        let total = 0;
        if(req.session.user){
            await userModel.findById(req.session.user._id, (err, user)=>{
                if(err)
                    console.log(err)
                else{   
                        for(let i = 0; i < user.cart.length; i++){
                            total += user.cart[i].subtotal;
                        } 
                        res.render('payment', {
                                user: user,
                                cart: user.cart,
                                total: total,
                                carttotal: user.cart.length
                            })                    
                    }
                })            
            }else{
                res.redirect('/login')
            }
    },

    getSuccess: (req, res)=>{
        if(req.session.user){
            userModel.findById(req.session.user._id, async (err, user)=>{
                let itemList = []
                user.cart.forEach(item => {
                    itemList.push({
                        items: item.itemname, 
                        quantity: item.quantity, 
                        subtotal: item.subtotal
                    })
                });
                let totalprice = 0;
                itemList.forEach(item => {
                    totalprice += item.subtotal;
                });
                user.orders.push({
                    items: itemList,
                    totalprice: totalprice
                })
                console.log("order added");
                user.cart = [];
                await user.save()
            })
            res.render('success')
            }else{
                res.redirect('/login')
            }
    }
}

module.exports = routerFunctions