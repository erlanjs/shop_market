const Router = require("express")
const router = new Router()
const userController = require("../controlers/userController")

router.post('/registration' , userController.registration)
router.post('/login' , userController.login)
router.get('/auth' , userController.check )
router.get('/users' , userController.getUsers )



module.exports = router