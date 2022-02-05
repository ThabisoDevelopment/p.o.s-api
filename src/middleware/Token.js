import jwt from "jsonwebtoken"

class Token {
    // verify token if user is authenticated
    verify(request, response, next) {
        const token = request.header('authorization') || null
        if(!token) return response.status(401).send("Access Denied")
        try {
            const verified = jwt.verify(token, process.env.JWT_SECRET) /** JWT_PASSWORD_RESET */
            request.user = verified
            next()
        } catch (error) {
            return response.status(403).send(error.message)
        }
    }

    // verify password reset token
    verifyPasswordReset(request, response, next) {
        const token = request.header('authorization') || null
        if(!token) return response.status(401).send("Access Denied")
        try {
            const verified = jwt.verify(token, process.env.JWT_PASSWORD_RESET) /** JWT_PASSWORD_RESET */
            request.user = verified
            next()
        } catch (error) {
            return response.status(403).send(error.message)
        }
    }
}

export default new Token