//Libraries
import mysql from 'mysql2'


export default async function (req, res){
    if(req.method === 'GET'){
        console.log(req.query)
        const database_lookup_ref = {
            'tank': {
                db_name: 'tanklogs',
                key_shorthand: 'tank'
            },
            'vacuum': {
                db_name: 'vacuumlogs',
                key_shorthand: 'vac'
            }
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
            date_format(recordDateTime, '%m/%d %H:%i') as dbEntryTime,
            date_format(${database_lookup_ref[req.query.sensor_type].key_shorthand}1Time, '%m/%d %H:%i') as ${database_lookup_ref[req.query.sensor_type].key_shorthand}1TimeFormatted,
            date_format(${database_lookup_ref[req.query.sensor_type].key_shorthand}2Time, '%m/%d %H:%i') as ${database_lookup_ref[req.query.sensor_type].key_shorthand}2TimeFormatted,
            date_format(${database_lookup_ref[req.query.sensor_type].key_shorthand}3Time, '%m/%d %H:%i') as ${database_lookup_ref[req.query.sensor_type].key_shorthand}3TimeFormatted,
            date_format(${database_lookup_ref[req.query.sensor_type].key_shorthand}4Time, '%m/%d %H:%i') as ${database_lookup_ref[req.query.sensor_type].key_shorthand}4TimeFormatted,
            date_format(${database_lookup_ref[req.query.sensor_type].key_shorthand}5Time, '%m/%d %H:%i') as ${database_lookup_ref[req.query.sensor_type].key_shorthand}5TimeFormatted
            from ${database_lookup_ref[req.query.sensor_type].db_name}
            where recordDateTime between '${req.query.period_start}' and '${req.query.period_end}'
            order by recordDateTime desc
            `;
            console.log(query)
            const historical_data = await pool.query(query)
            res.send(historical_data)
            
        } catch (error) {
            console.error(`There was an error fetching vacuum data: ${error}`);
            res.send(null)
        }
    }

}