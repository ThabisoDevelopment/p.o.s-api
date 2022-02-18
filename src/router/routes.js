import { Router } from "express"
import Token from "../middleware/Token"

// Import controllers
import AuthController from "../controllers/AuthController"
import CheckController from "../controllers/CheckController"

// initiate express router
const router = Router()

// auth routes
router.post('/oauth/login', AuthController.login)
router.post('/oauth/register', AuthController.create)

//  Check out routes
router.get('/product/:barcode', Token.verify, CheckController.get_product_by_barcode)


export default router