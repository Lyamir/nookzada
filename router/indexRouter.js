const express = require('express')
const router = express.Router()
const controller = require('../controller/controller')

router.get('/', controller.getIndex)
router.get('/index', controller.getIndex)
router.get('/about', controller.getAbout)
router.get('/contact', controller.getContact)
router.get('/shop', controller.getShop)
router.get('/signup', controller.getSignup)
router.get('/login', controller.getLogin)
router.get('/item/:id', controller.getItem)
router.get('/logout', controller.getLogout)
router.get('/sort', controller.sortShop)
router.get('*', controller.errorRoute)

router.post('/login', controller.postLogin)
router.post('/signup', controller.postSignup)
router.post('/addItem', controller.addItem)
router.post('/shop', controller.searchItem)
router.post('/deleteItem', controller.deleteItem)
router.post('/editItem', controller.editItem)







