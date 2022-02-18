import connection from "../database/connection"

class CheckController {

    get_product_by_barcode(request, response) {
        if (!request.params.barcode) return response.status(400).send({ messege: "Sorry! something went wrong" })
        const barcode = request.params.barcode
        const statement = "SELECT * FROM products WHERE barcode = ?"
        connection.query(statement, [barcode], (error, results) => {
            if (error) return response.status(500).send({ messege: "Internal Sever Error"})
            if (results.length < 1) return response.status(404).send({ message: "Sorry! this product is not fount in our database" })
            if (results[0].quantity < 1) return response.status(400).send({ message: "The product is OUT OF STOCK" })
            response.send(results[0])
        })
    }
    
    purchase(request, response) {
        response.send('Sold')
    }
}

export default new CheckController