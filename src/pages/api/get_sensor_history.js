//Libraries
import mysql from 'mysql2'


export default async function getSensorHistory(req, res){
    if(req.method === 'GET'){
        console.log(req.query)
        const database_lookup_ref = {
            'tank': 'tanklogs',
            'vacuum': 'vacuumlogs'
        }

        try {
            const pool = mysql.createPool(
                {
                    host: process.env.MYSWL_DB_HOST,
                    user: process.env.MYSQL_DB_USER,
                    password: process.env.MYSQL_DB_PASSWORD,
                    database: process.env.MYSQL_DB_NAME
                }
            ).promise()
            const query = `
            select *,
            date_format(recordDateTime, '%b %d %y, %H:%i') as dbEntryTime
            from ${database_lookup_ref[req.query.sensor_type]}
            where recordDateTime between '${req.query.period_start}' and '${req.query.period_end}'
            `;
            const historical_data = await pool.query(query)
            res.send(historical_data)
            
        } catch (error) {
            
        }
    }

}