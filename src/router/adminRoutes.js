import { Router } from "express"
import Token from "../middleware/Token"

// Import controllers
import UsersController from "../controllers/UsersController"

// initiate express router
const router = Router()

// sales rouets


// users routes
router.get('/users', Token.verify, UsersController.users)
router.put('/users/:id', Token.verify, UsersController.update)

export default router