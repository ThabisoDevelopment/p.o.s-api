import connection from '../database/connection'
import { genSalt, hash, compare } from "bcryptjs"
import { sign } from 'jsonwebtoken'
import Joi from 'joi'
import Mail from '../mail/Mail'

class AuthController {
    // create new user
    create(request, response) {
        // Validate request body Input | name | email | password |
        const schema = Joi.object({
            name: Joi.string().required().min(3).max(50),
            email: Joi.string().required().email(),
            password: Joi.string().required().min(8),
        })
        const { error } = schema.validate(request.body)
        if (error) return response.status(422).send(error.details[0].message)

        // Check if email Exits
        const statement = `SELECT * FROM users WHERE email=?`
        connection.execute(statement, [ request.body.email ], async(error, results) => {
            if (error) return response.status(500).send("Internal Server Error")
            if (results.length > 0) return response.status(422).send("Sorry! email already exists")

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
            connection.execute(statement, data, async(error) => {
                if (error) return response.status(500).send("Internal Server Error")
                const mail_template = {
                    name: request.body.name,
                    email: request.body.email,
                    subject: 'welcome to the pos stystems',
                    text: 'welcome to the pos stystems and this is the body of the email'
                }
                const info = await Mail(mail_template)
                response.status(201).send({
                    message:  `${request.body.name} your account have been created`,
                    mail: info
                })
            })
        })
    }

    login(request, response) {
        // Login Validation request body | email | password
        const schema = Joi.object({
            email: Joi.string().required().email(),
            password: Joi.string().required().min(8),
        })
        const { error } = schema.validate(request.body)
        if (error) return response.status(422).send(error.details[0].message)

        const statement = `SELECT id, name, password, active, email_verified FROM users WHERE email=?`

        connection.execute(statement, [ request.body.email ], async(error, results) => {
            if (error) return response.status(500).send("Internal Server Error")
            if (results.length < 1) return response.status(422).send("Sorry! this user does not exist")
            // validate if account is active 
            if (!results[0].active) return response.status(401).send("Account in not active - contact management")
            // validate password
            const validPass = await compare(request.body.password, results[0].password)
            if(!validPass) return response.status(422).send("Sorry! user password is incorrect")
            
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
        const schema = Joi.object({
            email: Joi.string().required().email(),
        })
        const { error } = schema.validate(request.body)
        if (error) return response.status(422).send(error.details[0].message)

        // Check if email Exits
        const statement = `SELECT id, name, email FROM users WHERE email=?`
        connection.execute(statement, [ request.body.email ], async(error, results) => {
            if (error) return response.status(500).send("Internal Server Error")
            if (results.length < 1) return response.status(404).send("Sorry! Pleace enter your correct email address")
            
            const user = results[0]
            const reset_token = sign({id: user.id}, process.env.JWT_PASSWORD_RESET, { expiresIn: '1d'})
            // Sign a Password Reset JWT token and send an email to user
            const mail_template = {
                name: results[0].name,
                email: request.body.email,
                subject: 'welcome to the pos stystems',
                text: 'welcome to the pos stystems and this is the body of the email'
            }
            const info = await Mail(mail_template)
            response.send({
                message: "password reset email sent",
                reset_token,
                mail: info
            })
        })
    }

    async passwordReset(request, response) {
        const schema = Joi.object({
            password: Joi.string().required().min(8),
        })
        const { error } = schema.validate(request.body)
        if (error) return response.status(422).send(error.details[0].message)

        // Generate a Hashed Password
        const salt = await genSalt(10)
        const hashedPassword = await hash(request.body.password, salt)
        const data = [ hashedPassword, request.user.id ]

        const statement = `UPDATE users SET password=? WHERE id=?`
        connection.execute(statement, data, (error) => {
            if (error) return response.status(500).send("Internal Server Error")
            response.send({ message: "Your password have been updated"})
        })
    }
}

export default new AuthController