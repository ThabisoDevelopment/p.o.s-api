import { Router } from "express"
import Token from "../middleware/Token"

// Import controllers
import AuthController from "../controllers/AuthController"
import CheckController from "../controllers/CheckController"
import UsersController from "../controllers/UsersController"

// initiate express router
const router = Router()

// auth routes
router.post('/oauth/login', AuthController.login)
router.post('/oauth/register', AuthController.create)
router.post('/oauth/verify', Token.verify, (request, response) =>{
    response.status(200).send('authoried')
})

//  Check out routes
router.get('/product/:barcode', Token.verify, CheckController.get_product_by_barcode)
router.post('/checkout', Token.verify, CheckController.checkout)

// users routes
router.get('/user', Token.verify, UsersController.get_current_user)

export default router