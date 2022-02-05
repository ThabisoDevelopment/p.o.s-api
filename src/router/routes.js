import { Router } from "express"
// import Token from "../middleware/Token"

// Import controllers
import AuthController from "../controllers/AuthController"

// initiate express router
const router = Router()

// auth routes
router.post('/oauth/login', AuthController.login)
router.post('/oauth/register', AuthController.create)

//  Check out routes



export default router