const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

require('dotenv').config();
const app = express();

const PORT = process.env.PORT || 3000;


//DB CONNECTION
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_KEY}@cluster0.fx7fb.gcp.mongodb.net/nookzada?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> console.log("Database connection successful!"))
.catch(err => console.error(err));

//setting up session
app.use(cookieParser())
app.use(session({
	secret: 'very super secret',
	resave: true,
	saveUninitialized: true
}))

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

//entry route
const indexRouter = require('./router/indexRouter')
app.use('/', indexRouter)

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
