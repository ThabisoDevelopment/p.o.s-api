import connection from '../database/connection'
import { genSalt, hash, compare } from "bcryptjs"
import { sign } from 'jsonwebtoken'
import { validateCreate, validateLogin, validatePassword, validateEmail } from '../validation/AuthValidation'

class AuthController {
    // create new user
    create(request, response) {
        // Validate request body Input | name | email | password |
        const { error } = validateCreate(request.body)
        if (error) return response.status(422).send({ message: error.details[0].message })

        // Check if email Exits
        const statement = `SELECT * FROM users WHERE email=?`
        connection.execute(statement, [ request.body.email ], async(error, results) => {
            if (error) return response.status(500).send({ message: "Internal Server Error" })
            if (results.length > 0) return response.status(422).send({ message: "Sorry email already exists" })

            // Generate a Hashed Password
            const salt = await genSalt(10)
            const hashedPassword = await hash(request.body.password, salt)

            // Register new user to Database
            const data = [ 
                request.body.name,
                request.body.email,
                hashedPassword
            ]
            const statement = `INSERT INTO users(name, email, password) VALUES(?, ?, ?)`
            connection.execute(statement, data, (error) => {
                if (error) return response.status(500).send({ message: "Internal Server Error" })
                response.status(201).send({ message:  `${request.body.name} your account have been created` })
            })
        })
    }

    login(request, response) {
        // Login Validation request body | email | password |
        const { error } = validateLogin(request.body)
        if (error) return response.status(422).send({ message: error.details[0].message })

        const statement = `SELECT id, name, password, active, email_verified FROM users WHERE email=?`

        connection.execute(statement, [ request.body.email ], async(error, results) => {
            if (error) return response.status(500).send({ message: "Internal Server Error" })
            if (results.length < 1) return response.status(422).send({ message: "Sorry! this user does not exist" })
            // validate if account is active 
            if (!results[0].active) return response.status(401).send({ message: "Account in not active - see management" })
            // validate password
            const validPass = await compare(request.body.password, results[0].password)
            if(!validPass) return response.status(422).send({ message: "Sorry! user password is incorrect" })
            
            const user = {
                id: results[0].id,
                name: results[0].name,
                on_shift: results[0].on_shift,
                email_verified: results[0].email_verified
            }
            // Create and Assign Token
            const token = sign({id: user.id}, process.env.JWT_SECRET, { expiresIn: '1d'})
            response.header('authorization', token).send({ token, user })
        })
    }

    sendPasswordResetEmail(request, response) {
        const { error } = validateEmail(request.body)
        if (error) return response.status(422).send({ message: error.details[0].message })

        // Check if email Exits
        const statement = `SELECT id, name, email FROM users WHERE email=?`
        connection.execute(statement, [ request.body.email ], async(error, results) => {
            if (error) return response.status(500).send({ message: "Internal Server Error" })
            if (results.length < 1) return response.status(404).send({ message: "Sorry! Pleace enter your correct email address" })
            
            const user = results[0]
            const token = sign({id: user.id}, process.env.JWT_PASSWORD_RESET, { expiresIn: '60min'})

            /**
             * Sign a Password Reset JWT token and send an email to user
             * jwt sing JWT_PASSWORD_RESET
             */
            response.send({ message: "password reset email sent", resetTokenTest: token })
        })
    }

    async passwordReset(request, response) {
        const { error } = validatePassword(request.body)
        if (error) return response.status(422).send({ message: error.details[0].message })

        // Generate a Hashed Password
        const salt = await genSalt(10)
        const hashedPassword = await hash(request.body.password, salt)
        const data = [ hashedPassword, request.user.id ]

        const statement = `UPDATE users SET password=? WHERE id=?`
        connection.execute(statement, data, (error) => {
            if (error) return response.status(500).send({ message: "Internal Server Error" })
            response.send({ message: "Your password have been updated"})
        })
    }
}

export default new AuthController