const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

require('dotenv').config();
const app = express();

const PORT = process.env.PORT || 3000;

const urlencoder = bodyParser.urlencoded({
    extended: false
})

//DB CONNECTION
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_KEY}@cluster0.fx7fb.gcp.mongodb.net/nookzada?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> console.log("Database connection successful!"))
.catch(err => console.error(err));

const {userModel} = require('./model/user');
const {itemModel} = require('./model/item.js');
const {orderModel} = require('./model/order.js');

app.use(bodyParser.json());
/*app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}));*/

//setting up session
app.use(cookieParser())
/*app.use(session({
	secret: 'very super secret',
	resave: false,
	saveUninitialized: true
}));*/
app.use(session({
	secret: 'very super secret',
	resave: true,
	saveUninitialized: true
}))

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'hbs');

//entry route
app.get('/', (req, res) => {
	if(req.session.user)
		res.render('index', {user:req.session.user})
	else
		res.render('index')
});

//about route
app.get('/about', (req, res)=>{
	if(req.session.user)
		res.render('about', {user:req.session.user})
	else
		res.render('about')
})

//contact route
app.get('/contact', (req, res)=>{
	if(req.session.user)
		res.render('contact', {user:req.session.user});
	else
		res.render('contact')
})

//shop route
app.get('/shop', (req, res)=>{
	if(req.session.user)
		res.render('shop', {user:req.session.user})
	else
		res.render('shop')
})

app.get('/cart', (req, res)=>{
	if(req.session.user)
		res.render('cart', {user:req.session.user})
	else
		res.render('cart')
})

//sign-in route
app.get('/login', (req, res)=>{
	if(req.session.user)
		res.render('login', {user:req.session.user})
	else
		res.render('login')
})

//index route
app.get('/index', (req, res)=>{
	if(req.session.user)
		res.render('index', {user:req.session.user})
	else
		res.render('index')
})

//register route
app.get('/register', (req, res)=>{
	if(req.session.user)
		res.render('register', {user:req.session.user})
	else
		res.render('register')
})

//item route
app.get('/item', (req, res)=>{
	if(req.session.user)
		res.render('item', {user:req.session.user})
	else
		res.render('item')
})

//logout route
app.get('logout', (req, res)=>{
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
})

//adds a user to the database
app.post('/register', urlencoder, (req,res)=>{
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
	}
	else{
		let user = new userModel({
			username: req.body.username,
			password: req.body.password,
			email: req.body.email,
			userType: 'User',
			reviewList: []
		}).save((err,response)=>{
			if(err){
				res.render('register', {
					error: "Error: " + err
				})
			}else{
				if(req.session.user)
					res.render('login', {user:req.session.user})
				else
					res.render('login')
			}
		})	
	}
})

//user login
app.post('/login', urlencoder, (req, res)=>{
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
					req.session.user = user
					res.locals.user = user
					res.render('index', {user:user})
				}
			})
		}
	})
})

//adds an item to the database
app.post('/addItem', urlencoder, (req,res)=>{
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
			return console.error(err)
		else{
			res.redirect('/')
			console.log(`${item.name} added`)
		}
	})
})

//search 
app.get('/', (req,res)=>{
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
})

//delete an item (admin feature)
app.get('/delete/:id', function(req, res){
	itemModel.remove({_id:req.params.id}, function(err, delItem){
		if(err){
			console.log("Error: " + err)
			throw(err)
		}
		res.redirect('/')
	});
});
//user logout
/*app.get('/logout', function(req, res, next){
	if(req.session.user){
		req.session.destroy((err)=>{
			if(err){
				res.render('index', (req, res)=>{
					error: "Error: " + err
				})
			}
			else{
				res.render('index')
			}
		})
	}
})*/
app.get('/logout', function(req, res, next){
	if(req.session.user){
		req.session.destroy((err)=>{
			if(err){
				res.render('index', (req, res)=>{
					error: "Error: " + err
				})
			}
			else{
				res.render('index')
			}
		})
	}
})
//edit an item (admin feature)
app.get('/edit/:id', function(req, res) {
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
});
//display all items
app.get('/items', function(req, res) {
	itemModel.find(function(err, items) {
		if (err)
			console.log("Error" + err)
		else
			res.json(items)
	})
})
//adds an order
app.post('/addOrder', urlencoder, (req,res)=>{
	let id;
	let userID = req.session.user._id;

	orderModel.countDocuments({}, function(err, result) {
		if (err) {
		  console.log(err);
		} else {
		  id = result+1;
		}
	  });

	let order = new orderModel({
		_id: id,
		userID: userID,
		items: []
	})

	order.save((err, order)=>{
		if(err)
			console.log("Error: " + err)
		else{
			res.redirect('/')
			console.log('Order successfully added to cart!')
		}
	})
})
//delete order
app.get('/deleteOrder/:id', function(req, res){
	orderModel.remove({_id:req.params.id}, function(err, delOrder){
		if(err){
			console.log("Error: " + err)
			throw(err)
		}
		res.redirect('/')
	});
});
//filter items by popularity
app.get('/sort', function(req, res){
	itemModel.find({}).sort({timesSold: -1}).exec(function(err, docs) { 
		if(err){
			console.log("Error: " + err)
			throw(err)
		}else{
			res.json(docs)
		}
	});
})
//404 route
app.get('*', (req, res) => {
	res.render('error', {
		title: '404 Error',
		status: '404',
		errormsg: 'Page not found'
	});
});
//listen to port 3000
app.listen(PORT, () => {
	console.log(`Listening to localhost on port ${PORT}`);
});
