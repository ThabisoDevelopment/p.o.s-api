import dayjs from "dayjs"
import connection from "../database/connection"

class SalesController {

    sales(request, response) {
        let statement = `SELECT
                sale.id, 
                sale.is_cash,
                sale.cash,
                sale.cash_change,
                sale.total_price,
                sale.created_at,
                sale.updated_at,
                user.name,
                user.email,
                user.active,
                user.is_admin,
                (SELECT COUNT(id) FROM sale_product_lists WHERE sale_id=sale.id) AS count
            FROM sales AS sale
            INNER JOIN users AS user
            ON sale.user_id = user.id
            ORDER BY sale.id DESC
            LIMIT 20;`
        connection.query(statement, (error, results) => {
            if (error) return response.status(500).send({ message: "Internal server error" })
            const data = results.map(item => ({
                ...item,
                cash: item.cash.toFixed(2),
                cash_change: item.cash_change.toFixed(2),
                total_price: item.total_price.toFixed(2),
                created_at: dayjs(item.created_at).format('DD/MMM/YYYY HH:MM'),
                updated_at: dayjs(item.updated_at).format('DD/MMM/YYYY HH:MM')
            }))
            response.send(data)
        })
    }

    get_by_id(request, response) {
        const sales_sql = `SELECT
                sale.id, 
                sale.is_cash,
                sale.cash,
                sale.cash_change,
                sale.total_price,
                sale.created_at,
                sale.updated_at,
                user.name,
                user.email,
                (SELECT COUNT(id) FROM sale_product_lists WHERE sale_id=sale.id) AS count
            FROM sales AS sale
            INNER JOIN users AS user
            ON sale.user_id = user.id
            WHERE sale.id = ?`
        // Query sales data with user who made each sale
        connection.query(sales_sql, [request.params.sale_id], (error, results) => {
            if (error) return response.status(500).send({ message: "Internal server error" })
            let sale_data = results[0]
            sale_data.cash = sale_data.cash.toFixed(2)
            sale_data.cash_change = sale_data.cash_change.toFixed(2)
            sale_data.total_price = sale_data.total_price.toFixed(2)
            sale_data.created_at = dayjs(sale_data.created_at).format('DD/MMM/YYYY HH:MM'),
            sale_data.updated_at = dayjs(sale_data.updated_at).format('DD/MMM/YYYY HH:MM')
            /** sales product list query statement below */
            const sale_list_sql = `SELECT
                    item.id,
                    item.quantity,
                    item.total_price,
                    pro.name,
                    pro.type
                FROM sale_product_lists AS item
                INNER JOIN products AS pro
                ON item.product_id = pro.id
                WHERE item.sale_id = ?`
            /** Get the sales product list */
            connection.query(sale_list_sql, [sale_data.id], (error, product_list) => {
                if (error) return response.status(500).send({ message: "Internal server error" })
                const product_list_data = product_list.map(item => ({
                    ...item,
                    total_price: item.total_price.toFixed(2)
                }))
                const data = {
                    ...sale_data,
                    product_list: product_list_data
                }
                response.send(data)
            })
        })
    }


}

export default new SalesController