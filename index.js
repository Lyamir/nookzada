
/* 
mongo "mongodb+srv://cluster0.fx7fb.gcp.mongodb.net/nookzada" --username angels

password: ccapdev
*/
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express()

const PORT = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//DB CONNECTION
mongoose.connect('mongodb+srv://angels:ccapdev@cluster0.fx7fb.gcp.mongodb.net/nookzada?retryWrites=true&w=majority', {useNewUrlParser: true}, (err)=>{
	if(err)
		console.error(err)
	else
		console.log("Connection successful")
});

//ITEMS COLLECTION
let itemsModel = mongoose.model('items', ({}, {strict: false})) 
itemsModel.find({},(err, item)=>{
	if(err)
		console.log(err)
	else
		console.log(item)
})

//USERS COLLECTION
let usersModel = mongoose.model('users', ({}, {strict: false})) 
usersModel.find({},(err, item)=>{
	if(err)
		console.log(err)
	else
		usersModel.count({}, (err, count)=>{
			console.log(count);
		})
})


/*app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}));*/

app.set('view engine', 'hbs');



//entry route
app.get('/', (req, res) => {
    res.render('home');
});


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