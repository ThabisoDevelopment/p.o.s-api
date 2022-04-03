import connection from "../database/connection"
import dayjs from "dayjs"
import Joi from "joi"

class UsersController {

    get_current_user(request, response) {
        const statement = "SELECT id, name, email, email_verified, active, is_admin, created_at, updated_at FROM users WHERE id = ?"
        connection.query(statement, [request.user.id], (error, results) => {
            if (error) return response.status(500).send({ messege: "Internal Sever Error"})
            results[0].created_at = dayjs(results[0].created_at).format('DD/MMM/YYYY')
            results[0].updated_at = dayjs(results[0].updated_at).format('DD/MMM/YYYY')
            response.send(results[0])
        })
    }

    users(request, response) {
        const statement = "SELECT id, name, email, email_verified, active, is_admin, created_at, updated_at FROM users"
        connection.query(statement, async(error, results) => {
            try {
                if (error) throw "Internal server error"
                const data = await results.map(user => ({
                    ...user,
                    created_at: dayjs(user.created_at).format('DD/MMM/YYYY'),
                    updated_at: dayjs(user.updated_at).format('DD/MMM/YYYY')
                }))
                response.send(data)
            } catch (error) {
                response.status(500).send({ message: error.message })
            }
        })
    }

    update(request, response) {
        const schema = Joi.object({
            active: Joi.boolean().required(),
            is_admin: Joi.boolean().required()
        })
        const { error } = schema.validate(request.body)
        if (error) return response.status(422).send({ message: error.details[0].message })
        const data = [
            request.body.active,
            request.body.is_admin,
            request.params.id
        ]
        const statement = "UPDATE users SET active=?, is_admin=? WHERE id=?"
        connection.query(statement, data, error => {
            if (error) return response.status(500).send({ message: "Internal Server Error" })
            response.send({ message: "users successfuly updated" })
        })
    }
    
}

export default new UsersController