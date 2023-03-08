//Libraries
import mysql from 'mysql2'

export default async function (req, res){


    if(req.method === 'POST'){
        let data = JSON.parse(req.body)
        let values = [data.selected_ro, data.record_date, data.sugar_percent_in, data.sugar_percent_out, data.temperature, data.conc_flow, data.membrane_1, data.membrane_2, data.membrane_3, data.membrane_4, data.membrane_5, data.membrane_6, data.membrane_7, data.membrane_8, data.is_benchmark]
        console.log(values)
        const pool = mysql.createPool({
            host: process.env.MYSQL_DB_HOST,
            user: process.env.MYSQL_DB_USER,
            password: process.env.MYSQL_DB_PASSWORD,
            database: process.env.MYSQL_DB_NAME
        }).promise();

        pool.query('insert into ro_records (selected_ro, record_date, sugar_percent_in, sugar_percent_out, temperature, conc_flow, membrane_1, membrane_2, membrane_3, membrane_4, membrane_5, membrane_6, membrane_7, membrane_8, is_benchmark) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', values)
        
    }
}