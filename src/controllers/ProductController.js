import dayjs from "dayjs"
import Joi from "joi"
import connection from "../database/connection"

class ProductController {

    products(request, response) {
        const statement = "SELECT * FROM products"
        connection.query(statement, async(error, results) => {
            try {
                if (error) throw "Internal server error"
                const data = await results.map(product => ({
                    ...product,
                    created_at: dayjs(product.created_at).format('DD/MMM/YYYY'),
                    updated_at: dayjs(product.updated_at).format('DD/MMM/YYYY')
                }))
                response.send(data)
            } catch (error) {
                response.status(500).send({ message: error.message })
            }
        })
    }

    create(request, response) {
        const schema = Joi.object({
            barcode: Joi.string().required(),
            name: Joi.string().min(3).required(),
            type: Joi.string().required(),
            unit_price: Joi.number().required()
        })
        const { error } = schema.validate(request.body)
        if (error) return response.status(422).send({ message: error.details[0].message })
        const data = [
            request.body.barcode,
            request.body.name,
            request.body.type,
            request.body.unit_price
        ]
        const statement = "INSERT INTO products(barcode, name, type, unit_price) VALUES(?, ?, ?, ?)"
        connection.query(statement, data, (error, results)=> {
            if (error) return response.status(500).send({ message: "Internal server error" })
            response.status(201).send({ 
                message: "New product have been created successful",
                product_id: results.insertId
            })
        })
    }

    update(request, response) {
        const schema = Joi.object({
            name: Joi.string().min(3).required(),
            type: Joi.string().required(),
            unit_price: Joi.number().required()
        })
        const { error } = schema.validate(request.body)
        if (error) return response.status(422).send({ message: error.details[0].message })
        const data = [
            request.body.name,
            request.body.type,
            request.body.unit_price,
            request.params.id
        ]
        const statement = "UPDATE products SET name=?, type=?, unit_price=? WHERE id=?"
        connection.query(statement, data, error => {
            if (error) return response.status(500).send({ message: "Internal server error" })
            response.send({ message: "product have been updated successful" })
        })
    }

}

export default new ProductController