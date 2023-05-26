//Libraries
import mysql from 'mysql2'
import { formatTime } from '@/utils/formatDate';

export default async function (req, res){
    //if not info in query string exists return all recrds by setting selectAll to true
    let selectAll = Object.keys(req.query).length < 1;
    //get current date
    let now = formatTime(new Date());

    //pull out necessary query info for filtering records
    let recordIds = req.query.record_ids;  
    let selectedRO = req.query.selected_ro;
    let processType = req.query.process_type;
    let startDate = req.query.start_date || '2015-01-01'; 
    let endDate = req.query.end_date || `${now.year}-${now.month}-${now.day}T${now.time24Hr}`;
    
    //build sql query string AND clauses
    let selectedROString = ``;
    if (selectedRO) selectedROString = `AND selected_ro = '${selectedRO}'`; 
    let processQueryString = ``;
    switch(processType){
        case 'benchmark': processQueryString = `AND is_benchmark = 1`;
        break;
        case 'first_pass': processQueryString = `AND sugar_percent_in < 2.5`;
        break;
        case 'second_pass': processQueryString = 'AND sugar_percent_in >= 2.5';
        break;
    }
    let dateQueryString = ``;
    if(startDate && endDate){
        dateQueryString = `AND record_date between '${startDate}' AND '${endDate}'`
    }

    const pool = mysql.createPool({
            host: process.env.MYSQL_DB_HOST,
            user: process.env.MYSQL_DB_USER,
            password: process.env.MYSQL_DB_PASSWORD,
            database: process.env.MYSQL_DB_NAME
    }).promise();

    //build full query string using and clauses created above
    let query = `select * from ro_records order by record_date desc`;
    if(!selectAll){
        if(recordIds) query = `select * from ro_records where id in (${recordIds}) order by record_date desc`;
        else query = `select * from ro_records where id IS NOT NULL ${selectedROString} ${processQueryString} ${dateQueryString} order by record_date desc`;
    }

    console.log(query)
    

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