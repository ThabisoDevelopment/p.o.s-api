import 'dotenv/config'
import express, { json } from "express"
import cors from "cors"

/**  Initializing or Starting Express Server */
const app = express()

/**
 * CORS middleware
 * Enable body-parser 
 */
const corsOptions = {
    origin: '*',
    methods: "GET, POST, PUT, PATCH, DELETE",
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions))
app.use(json())

/**
 * Import Routes
 *  add routes to app
 */
import routes from './router/routes'
app.use('/api', routes)

/** Server Listening */ 
const PORT = process.env.PORT || 3000
app.listen(PORT, ()=> console.log(`Server Running on port: ${PORT}`))
