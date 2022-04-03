import connection from "../database/connection"

class CheckController {

    get_product_by_barcode(request, response) {
        if (!request.params.barcode) return response.status(400).send({ messege: "Sorry! something went wrong" })
        const barcode = request.params.barcode
        const statement = `SELECT * FROM products WHERE barcode = ${barcode}`
        connection.query(statement, (error, results) => {
            if (error) return response.status(500).send({ messege: "Internal Sever Error"})
            if (results.length < 1) return response.status(404).send({ message: "Sorry! this product is not found in our database" })
            if (results[0].quantity < 1) return response.status(400).send({ message: "The product is OUT OF STOCK" })
            response.send(results[0])
        })
    }

    checkout(request, response) {
        // validate data needed
        const sale_data = [
            request.user.id,
            request.body.total_price,
            request.body.is_cash,
            request.body.cash,
            request.body.cash_change
        ]
        const sale_sql_statement = "INSERT INTO sales(user_id, total_price, is_cash, cash, cash_change) VALUES(?, ?, ?, ?, ?)"
        connection.execute(sale_sql_statement, sale_data, async(error, results) => {
            if (error) return response.status(500).send({ messege: "Internal Sever Error"})
            const sale_id = results.insertId
            await request.body.products.forEach(product => {
                const new_product_qty = (product.quantity - product.qty)
                const update_product_sql = "UPDATE products SET quantity=? WHERE id=?"
                connection.execute(update_product_sql, [new_product_qty, product.id])
                const sale_list_data = [
                    sale_id,
                    product.id,
                    product.qty,
                    product.total_price
                ]
                const sale_list_sql = "INSERT INTO sale_product_lists(sale_id, product_id, quantity, total_price) VALUES(?, ?, ?, ?)"
                connection.execute(sale_list_sql, sale_list_data)
            })
            await response.send({ message: "Checkout Successful" })
        })
    }

    
}

export default new CheckController