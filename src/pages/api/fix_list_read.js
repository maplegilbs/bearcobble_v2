//Libraries
import mysql from 'mysql2';

const orderBy = {
    'newest': 'submitTime desc',
    'oldest': 'submitTime asc',
    'section': 'section asc',
    'priority': 'priority asc'
}


export default async function Fix_List_Read(req, res) {
    const sortby = req.query.sortBy;

    const pool = mysql.createPool({
        host: process.env.MYSQL_DB_HOST,
        user: process.env.MYSQL_DB_USER,
        password: process.env.MYSQL_DB_PASSWORD,
        database: process.env.MYSQL_DB_NAME
    }).promise();

    let query = `select * from woodsfixlist where isResolved = 0 order by ${orderBy[sortby]}`
    
    if(req.method === 'GET'){
        try {
            let selectedRecords = await pool.query(query);
            res.send(selectedRecords[0])
        } catch (error) {
            console.error(`Unable to fetch the request fix list records.  Error: ${error}`)
            res.send(null)
        }
    }
    pool.query()
}