import Joi from "joi"


class OrdersController {

    orders(request, response) {
        let statement = "SELECT * FROM orders"
        connection.query(statement, async(error, results) => {
            if (error) return response.status(500).send({ message: "Internal Sever Error"})
            const data = await results.map(item => ({
                ...item,
                created_at: dayjs(product.created_at).format('DD/MMM/YYYY'),
                updated_at: dayjs(product.updated_at).format('DD/MMM/YYYY')
            }))
            response.send(data)
        })
    }

    create(request, response) {
        const schema = Joi.object({
            search: Joi.string().required()
        })
        const { error } = schema.validate(request.body)
        // continue
    }


}

export default new OrdersController