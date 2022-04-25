import { Router } from "express"
import Token from "../middleware/Token"

// Import controllers
import UsersController from "../controllers/UsersController"
import ProductController from "../controllers/ProductController"
import SalesController from "../controllers/SalesController"

// initiate express router
const router = Router()

// sales routs
router.get('/sales', Token.verify, SalesController.sales)
router.get('/sales/list/:sale_id', Token.verify, SalesController.get_by_id)

// products routes
router.get('/products', Token.verify, ProductController.products)
router.get('/products/search', Token.verify, ProductController.search)
router.post('/products', Token.verify, ProductController.create)
router.put('/products/:id', Token.verify, ProductController.update)

// users routes
router.get('/users', Token.verify, UsersController.users)
router.get('/users/:id', Token.verify, UsersController.byId)
router.put('/users/:id', Token.verify, UsersController.update)

export default router