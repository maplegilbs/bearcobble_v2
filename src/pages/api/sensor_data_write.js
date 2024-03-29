//Libraries
import mysql from 'mysql2';
//Functions
import { calcVolFromHeight } from '@/utils/tankInfoHelpers';
import { adjustForUTC } from '@/utils/adjForUTCDate';
import { extractSensorData } from '@/utils/extractSensorData';

function convertDateForSQL(inputDate) { return inputDate.toISOString().slice(0, 19).replace('T', ' ') }

export default async function (req, res) {
    console.log(req.body)
    const body = req.body
    const sensor_type = body.sensor_type;

    const database_lookup_ref = {
        'tank': {
            table_name: 'tanksnapshots',
            key_shorthand: 'tank'
        },
        'vacuum': {
            table_name: 'vacuumlogs',
            key_shorthand: 'vac'
        }
    }
    if (req.method === 'POST') {
        let extracted_sensor_data;
        try {
            let sensor_response = await fetch(process.env.SMARTREK_SENSORS_JSON_URL);
            let sensor_json = await sensor_response.json();
            extracted_sensor_data = extractSensorData(sensor_json);
        } catch (error) {
            console.error(`There was an error fetching the requested data: ${error}`)
            res.send(null);
        }

        if (extracted_sensor_data.length > 0) {
            const pool = mysql.createPool({
                host: process.env.MYSQL_DB_HOST,
                user: process.env.MYSQL_DB_USER,
                password: process.env.MYSQL_DB_PASSWORD,
                database: process.env.MYSQL_DB_NAME
            }).promise();

            if (sensor_type.toLowerCase() === 'vacuum') {
                let insertedData = await pool.query(
                    ` insert into vacuumlogs (recordDateTime, vac1, vac1Time, vac2, vac2Time, vac3, vac3Time, vac4, vac4Time, vac5, vac5Time) values (?,?,?,?,?,?,?,?,?,?,?)`,
                    [
                        convertDateForSQL(adjustForUTC(new Date())),
                        extracted_sensor_data[0].section1.vacuum_reading, convertDateForSQL(adjustForUTC(new Date(extracted_sensor_data[0].section1.reading_time))),
                        extracted_sensor_data[0].section2.vacuum_reading, convertDateForSQL(adjustForUTC(new Date(extracted_sensor_data[0].section2.reading_time))),
                        extracted_sensor_data[0].section3.vacuum_reading, convertDateForSQL(adjustForUTC(new Date(extracted_sensor_data[0].section3.reading_time))),
                        extracted_sensor_data[0].section4.vacuum_reading, convertDateForSQL(adjustForUTC(new Date(extracted_sensor_data[0].section4.reading_time))),
                        extracted_sensor_data[0].section5.vacuum_reading, convertDateForSQL(adjustForUTC(new Date(extracted_sensor_data[0].section5.reading_time))),
                    ]
                )
                console.log(insertedData)
                res.json(insertedData[0].insertId)
            }
            else if (sensor_type.toLowerCase() === 'tank') {
                let insertedData = await pool.query(
                    `insert into tanksnapshots (recordDateTime, tank1Height, tank1Vol,  tank1Time, tank2Height, tank2Vol,  tank2Time, tank3Height, tank3Vol,  tank3Time, tank4Height, tank4Vol,  tank4Time, tank5Height, tank5Vol,  tank5Time) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                    [
                        convertDateForSQL(adjustForUTC(new Date())),
                        extracted_sensor_data[1].tank1.tank_level, calcVolFromHeight(extracted_sensor_data[1].tank1.tank_level), convertDateForSQL(adjustForUTC(new Date(extracted_sensor_data[1].tank1.reading_time))),
                        extracted_sensor_data[1].tank2.tank_level, calcVolFromHeight(extracted_sensor_data[1].tank2.tank_level), convertDateForSQL(adjustForUTC(new Date(extracted_sensor_data[1].tank2.reading_time))),
                        extracted_sensor_data[1].tank3.tank_level, calcVolFromHeight(extracted_sensor_data[1].tank3.tank_level), convertDateForSQL(adjustForUTC(new Date(extracted_sensor_data[1].tank3.reading_time))),
                        extracted_sensor_data[1].tank4.tank_level, calcVolFromHeight(extracted_sensor_data[1].tank4.tank_level), convertDateForSQL(adjustForUTC(new Date(extracted_sensor_data[1].tank4.reading_time))),
                        extracted_sensor_data[1].tank5.tank_level, calcVolFromHeight(extracted_sensor_data[1].tank5.tank_level), convertDateForSQL(adjustForUTC(new Date(extracted_sensor_data[1].tank5.reading_time))),

                    ]
                )
                console.log(insertedData)
                res.json(insertedData[0].insertId)
            }
        }
    }
}