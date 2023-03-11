//Libraries
import mysql from 'mysql2';
//Functions
import { calcVolFromHeight } from '@/utils/tankInfoHelpers';
import { adjustForUTC } from '@/utils/adjForUTCDate';

function convertDateForSQL(inputDate) { return inputDate.toISOString().slice(0, 19).replace('T', ' ') }

export default async function (req, res) {
    let sensor_type = req.body.sensor_type;
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
        let extractedSensorData;
        try {
            let sensorResponse = await fetch(process.env.SMARTREK_SENSORS_JSON_URL);
            let sensorJSON = await sensorResponse.json();
            extractedSensorData =
                [
                    {
                        section1: {
                            section_name: 'Section 1',
                            vacuum_reading: sensorJSON.database.table.row[1].data_EXT.PRESSURE,
                            reading_time: sensorJSON.database.table.row[1].timeTag_EXT.realtime
                        },
                        section2: {
                            section_name: 'Section 2',
                            vacuum_reading: sensorJSON.database.table.row[1].data_EXT.PRESSURE2,
                            reading_time: sensorJSON.database.table.row[1].timeTag_EXT.realtime
                        },
                        section3: {
                            section_name: 'Section 3',
                            vacuum_reading: sensorJSON.database.table.row[2].data_EXT.PRESSURE2,
                            reading_time: sensorJSON.database.table.row[2].timeTag_EXT.realtime
                        },
                        section4: {
                            section_name: 'Section 4',
                            vacuum_reading: sensorJSON.database.table.row[3].data_EXT.PRESSURE,
                            reading_time: sensorJSON.database.table.row[3].timeTag_EXT.realtime
                        },
                        section5: {
                            section_name: 'Section 5',
                            vacuum_reading: sensorJSON.database.table.row[3].data_EXT.PRESSURE2,
                            reading_time: sensorJSON.database.table.row[3].timeTag_EXT.realtime
                        },
                    },
                    {
                        tank1: {
                            tank_name: 'Tank 1',
                            tank_level: sensorJSON.database.table.row[4].data_1,
                            reading_time: sensorJSON.database.table.row[4].timeTag_EXT.realtime
                        },
                        tank2: {
                            tank_name: 'Tank 2',
                            tank_level: sensorJSON.database.table.row[5].data_1,
                            reading_time: sensorJSON.database.table.row[5].timeTag_EXT.realtime
                        },
                        tank3: {
                            tank_name: 'Tank 3',
                            tank_level: sensorJSON.database.table.row[6].data_1,
                            reading_time: sensorJSON.database.table.row[6].timeTag_EXT.realtime
                        },
                        tank4: {
                            tank_name: 'Tank 4',
                            tank_level: sensorJSON.database.table.row[7].data_1,
                            reading_time: sensorJSON.database.table.row[7].timeTag_EXT.realtime
                        },
                        tank5: {
                            tank_name: 'Tank 5',
                            tank_level: sensorJSON.database.table.row[8].data_1,
                            reading_time: sensorJSON.database.table.row[8].timeTag_EXT.realtime
                        }
                    }
                ];
        } catch (error) {
            console.error(`There was an error fetching the requested data: ${error}`)
            res.send(null);
        }

        if (extractedSensorData.length > 0) {
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
                        extractedSensorData[0].section1.vacuum_reading, convertDateForSQL(adjustForUTC(new Date(extractedSensorData[0].section1.reading_time))),
                        extractedSensorData[0].section2.vacuum_reading, convertDateForSQL(adjustForUTC(new Date(extractedSensorData[0].section2.reading_time))),
                        extractedSensorData[0].section3.vacuum_reading, convertDateForSQL(adjustForUTC(new Date(extractedSensorData[0].section3.reading_time))),
                        extractedSensorData[0].section4.vacuum_reading, convertDateForSQL(adjustForUTC(new Date(extractedSensorData[0].section4.reading_time))),
                        extractedSensorData[0].section5.vacuum_reading, convertDateForSQL(adjustForUTC(new Date(extractedSensorData[0].section5.reading_time))),
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
                        extractedSensorData[1].tank1.tank_level, calcVolFromHeight(extractedSensorData[1].tank1.tank_level), convertDateForSQL(adjustForUTC(new Date(extractedSensorData[1].tank1.reading_time))),
                        extractedSensorData[1].tank2.tank_level, calcVolFromHeight(extractedSensorData[1].tank2.tank_level), convertDateForSQL(adjustForUTC(new Date(extractedSensorData[1].tank2.reading_time))),
                        extractedSensorData[1].tank3.tank_level, calcVolFromHeight(extractedSensorData[1].tank3.tank_level), convertDateForSQL(adjustForUTC(new Date(extractedSensorData[1].tank3.reading_time))),
                        extractedSensorData[1].tank4.tank_level, calcVolFromHeight(extractedSensorData[1].tank4.tank_level), convertDateForSQL(adjustForUTC(new Date(extractedSensorData[1].tank4.reading_time))),
                        extractedSensorData[1].tank5.tank_level, calcVolFromHeight(extractedSensorData[1].tank5.tank_level), convertDateForSQL(adjustForUTC(new Date(extractedSensorData[1].tank5.reading_time))),

                    ]
                )
                console.log(insertedData)
                res.json(insertedData[0].insertId)
            }
        }
    }
}