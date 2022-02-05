import Joi from 'joi'

// NEW USER DATA VALIDATION
export const validateCreate = data => {
    const schema = Joi.object({
        name: Joi.string().required().min(3).max(50),
        email: Joi.string().required().min(5).email(),
        password: Joi.string().required().min(8),
    })
    return schema.validate(data)
}

// POST - USER AUTHENTICATION VALIDATION
export const validateLogin = data => {
    const schema = Joi.object({
        email: Joi.string().required().min(5).email(),
        password: Joi.string().required().min(8),
    })
    return schema.validate(data)
}

// POST - USER EMAIL PASSWORD RESET VALIDATION
export const validateEmail = data => {
    const schema = Joi.object({
        email: Joi.string().required().min(5).email(),
    })
    return schema.validate(data)
}

// PUT - USER PASSWORD RESET VALIDATION
export const validatePassword= data => {
    const schema = Joi.object({
        password: Joi.string().required().min(8),
    })
    return schema.validate(data)
}