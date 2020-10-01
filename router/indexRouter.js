const express = require('express')
const router = express()
const controller = require('../controller/indexController')
const bodyParser = require('body-parser')
const urlencoder = bodyParser.urlencoded({
    extended: false
})

router.get('/', controller.getIndex)
router.get('/index', controller.getIndex)
router.get('/about', controller.getAbout)
router.get('/contact', controller.getContact)
router.get('/shop', controller.getShop)
router.get('/register', controller.getSignup)
router.get('/login', controller.getLogin)
router.get('/item/:_id', controller.getItem)
router.get('/logout', controller.getLogout)
router.get('/sort', controller.sortShop)
router.get('/cart', controller.getCart)
router.get('/addCart/:id', controller.addCart)
router.get('/deleteCart/:id', controller.deleteCart)
router.get('/profile', controller.getProfile)
router.get('/add', controller.getAddItem)
router.get('/edit', controller.getEditItem)
router.get('/delete', controller.getDeleteItem)
router.get('/profile', controller.getProfile)
router.get('/payment', controller.getPayment)
router.get('/success', controller.getSuccess)
router.get('/deleteItem/:id', controller.deleteItem)

router.post('/login', urlencoder, controller.postLogin)
router.post('/register', urlencoder, controller.postSignup)
router.post('/addItem', urlencoder, controller.addItem)
router.post('/shop', controller.searchItem)
router.post('/editItem', urlencoder, controller.editItem)
router.post('/addCart/:id', urlencoder, controller.addCart)
router.post('/addReview/:id', urlencoder, controller.addReview)
router.post('/sendEmail', urlencoder, controller.sendEmail)



module.exports = router





