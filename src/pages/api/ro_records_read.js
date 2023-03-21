//Libraries
import mysql from 'mysql2'

export default async function (req, res){
    let recordIds = req.query.record_ids;
    let requestAllRecords = recordIds? false: true; 
    console.log(recordIds, requestAllRecords)

    const pool = mysql.createPool({
            host: process.env.MYSQL_DB_HOST,
            user: process.env.MYSQL_DB_USER,
            password: process.env.MYSQL_DB_PASSWORD,
            database: process.env.MYSQL_DB_NAME
    }).promise();

    let query = requestAllRecords?
    `select * from ro_records order by record_date desc`:
    `select * from ro_records where id in (${recordIds}) order by record_date desc`;

    if(req.method === 'GET'){
        try {
            let selectedRecords = await pool.query(query)
            res.send(selectedRecords[0])
            
        } catch (error) {
            console.error(`Unable to fetch the requested RO records.  Error: ${error}`);
            res.send(null)
        }
    }

}