import { Router } from "express"
import Token from "../middleware/Token"

// Import controllers
import UsersController from "../controllers/UsersController"
import ProductController from "../controllers/ProductController"

// initiate express router
const router = Router()

// sales rouets

// products routes
router.get('/products', Token.verify, ProductController.products)
router.post('/products', Token.verify, ProductController.create)
router.put('/products/:id', Token.verify, ProductController.update)

// users routes
router.get('/users', Token.verify, UsersController.users)
router.put('/users/:id', Token.verify, UsersController.update)

export default router