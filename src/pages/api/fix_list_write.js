//Libraries
import mysql from 'mysql2';

export default async function Fix_List_Write(req, res){

    
    const body = JSON.parse(req.body)
    let action = body.action;
    let ids = body.ids;
    
    const pool = mysql.createPool({
        host: process.env.MYSQL_DB_HOST,
        user: process.env.MYSQL_DB_USER,
        password: process.env.MYSQL_DB_PASSWORD,
        database: process.env.MYSQL_DB_NAME
    }).promise();

    if(req.method ==='POST' && action === 'markComplete'){
        try {
            let query = `update woodsfixlist set isResolved = 1 where id in (${ids.join(', ')})`
            let updated_records = await pool.query(query);
            res.send(updated_records[0])
        } catch (error) {
            console.error(`Unable to update selected records.  Error: ${error}`)
            res.send(null)
        }
    }
}