const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

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

app.use(bodyParser.json());
//ITEMS COLLECTION
let itemsModel = mongoose.model('items', ({}, {strict: false})) 

//USERS COLLECTION


/*app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}));*/

//setting up session
app.use(session({
	secret: 'very super secret',
	resave: false,
	saveUninitialized: true
}));

app.set('view engine', 'hbs');

//entry route
app.get('/', (req, res) => {
    res.render('home');
});

//adds a user to the database
app.post('/user/signup', urlencoder, (req,res)=>{

	let user = new userModel({
		name: req.body.name,
		password: req.body.password,
		email: req.body.email,
		userType: 'User',
		reviewList: []
	}).save((err,response)=>{
		if(err)
			res.status(400).send(err)
		res.status(200).send(response)
	})
})

app.post('/user/login', urlencoder, (req,res)=>{
	userModel.findOne({'email': req.body.email}, (err, user)=>{
		if(!user) res.json({message: 'Login failed, user not found!'})

		user.comparePassword(req.body.password, (err, isMatch)=>{
			if(err) console.error(err);
			if(!isMatch) return res.status(400).json({
				message: 'Wrong Password'
			});
			res.status(200).send('Logged in Successfully')
			})
	})
})
//adds an item to the database
app.post('/addItem', urlencoder, (req,res)=>{
	let name = req.body.name;
	let price = req.body.price;
	let description = req.body.desc;
	let image = req.body.image;
	let stock = req.body.stock;

	let item = new itemsModel({
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


app.post('/login', urlencoder, (req,res)=>{

})

//delete an item (admin feature)
app.delete('/items/deleteItem/:item_id', function(req, res) {
	let id = req.params.item_id;
	itemsModel.remove({
		_id : id
	}, function(err) {
		if (err)
			console.log("Error" + err)
		else{
			res.send('Item successfully deleted!')
			res.redirect('/')
		}
	})
})

//user logout
app.get('/user/logout', function(req, res, next){
	if(req.session){
		req.session.destroy((err)=>{
			if(err)
				console.log("Error: " + err)
			else
				res.redirect('/')
		})
	}
})

//edit an item (admin feature)
app.put('items/editItem/:item_id', function(req, res) {
	let id = req.params.item_id;
	var item = {
		name: req.body.name,
		price: req.body.price,
		description: req.body.desc,
		itemList: [],
		image: req.body.image,
		stock: req.body.stock,
		timesSold: req.body.timesSold
	}
	itemsModel.findByIdAndUpdate(id, item, function(err, item) {
		if (err) {
			console.log("Error: " + err)
			throw err;
		}else{
			res.send('Item informations successfully updated!')
			res.redirect('/')
		}
	})
})

//display all items
app.get('/items', function(req, res) {
	itemsModel.find(function(err, items) {
		if (err)
			console.log("Error" + err)
		else
			res.json(items);
	})
})

//404 route
app.get('*', (req, res) => {
	res.render('error', {
		title: '404 Error',
		status: '404',
		errormsg: 'Page not found'
	});
});



app.listen(PORT, () => {
	console.log(`Listening to localhost on port ${PORT}`);
});
