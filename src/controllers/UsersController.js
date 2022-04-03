import connection from "../database/connection"

class UsersController {

    get_current_user(request, response) {
        const statement = "SELECT * FROM users WHERE id = ?"
        connection.query(statement, [request.user.id], (error, results) => {
            if (error) return response.status(500).send({ messege: "Internal Sever Error"})
            const data = {
                id: results[0].id,
                name: results[0].name,
                email: results[0].email,
                active: results[0].active,
                email_verified: results[0].email_verified,
                is_admin: results[0].is_admin,
                created_at: results[0].created_at,
                updated_at: results[0].updated_at,
            }
            response.send(data)
        })
    }
    
}

export default new UsersController