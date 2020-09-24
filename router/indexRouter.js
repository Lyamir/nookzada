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

router.post('/login', urlencoder, controller.postLogin)
router.post('/register', urlencoder, controller.postSignup)
router.post('/addItem', urlencoder, controller.addItem)
router.post('/shop', controller.searchItem)
router.post('/deleteItem', controller.deleteItem)
router.post('/editItem', controller.editItem)
router.post('/addCart/:id', urlencoder, controller.addCart)
module.exports = router





