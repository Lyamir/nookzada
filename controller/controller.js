const userModel = require('../model/user')
const itemModel = require ('../model/item')


const routerFunctions = {
    getIndex: (req, res)=>{
        if(req.session.user)
		    res.render('index', {user:req.session.user})
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
            res.render('register', {user: req.session.user})
        else
            res.render('register')
    },

    getShop: async (req, res)=>{
        await itemModel.find({}, (err, item)=>{
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
                    stock: item.stock
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
                    stock: item.stock
                })
            }
    
        })
    },



}

module.exports = {routerFunctions}