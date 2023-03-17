//Styles
import home_styles from '@/styles/home_page_styles.module.scss';

export async function getServerSideProps() {
    let vacuumData, tankData;
    try {
        const sensor_data = await fetch(`${process.env.BASE_URL}api/sensor_data_read`);
        const sensor_json = await sensor_data.json();
        let extracted_sensor_data =
            [
                {
                    section1: {
                        section_name: 'Section 1',
                        vacuum_reading: sensor_json.database.table.row[1].data_EXT.PRESSURE,
                        reading_time: sensor_json.database.table.row[1].timeTag_EXT.realtime
                    },
                    section2: {
                        section_name: 'Section 2',
                        vacuum_reading: sensor_json.database.table.row[1].data_EXT.PRESSURE2,
                        reading_time: sensor_json.database.table.row[1].timeTag_EXT.realtime
                    },
                    section3: {
                        section_name: 'Section 3',
                        vacuum_reading: sensor_json.database.table.row[2].data_EXT.PRESSURE2,
                        reading_time: sensor_json.database.table.row[2].timeTag_EXT.realtime
                    },
                    section4: {
                        section_name: 'Section 4',
                        vacuum_reading: sensor_json.database.table.row[3].data_EXT.PRESSURE,
                        reading_time: sensor_json.database.table.row[3].timeTag_EXT.realtime
                    },
                    section5: {
                        section_name: 'Section 5',
                        vacuum_reading: sensor_json.database.table.row[3].data_EXT.PRESSURE2,
                        reading_time: sensor_json.database.table.row[3].timeTag_EXT.realtime
                    },
                },
                {
                    tank1: {
                        tank_name: 'Tank 1',
                        tank_level: sensor_json.database.table.row[4].data_1,
                        reading_time: sensor_json.database.table.row[4].timeTag_EXT.realtime
                    },
                    tank2: {
                        tank_name: 'Tank 2',
                        tank_level: sensor_json.database.table.row[5].data_1,
                        reading_time: sensor_json.database.table.row[5].timeTag_EXT.realtime
                    },
                    tank3: {
                        tank_name: 'Tank 3',
                        tank_level: sensor_json.database.table.row[6].data_1,
                        reading_time: sensor_json.database.table.row[6].timeTag_EXT.realtime
                    },
                    tank4: {
                        tank_name: 'Tank 4',
                        tank_level: sensor_json.database.table.row[7].data_1,
                        reading_time: sensor_json.database.table.row[7].timeTag_EXT.realtime
                    },
                    tank5: {
                        tank_name: 'Tank 5',
                        tank_level: sensor_json.database.table.row[8].data_1,
                        reading_time: sensor_json.database.table.row[8].timeTag_EXT.realtime
                    }
                }
            ];
        vacuumData = extracted_sensor_data[0];
        tankData = extracted_sensor_data[1];
    }
    catch (error) { console.error(`There was an error fetching sensor data: ${error}`); }
    return ({props: {vacuumData: vacuumData, tankData: tankData}})
}


export default function Main({vacuumData, tankData}) {
    console.log(vacuumData, tankData)
    return (
        <>
            <div className={home_styles.tank_container}>
            </div>
            <div className={home_styles.vacuum_container}>
            </div>
            <div className={home_styles.weather_container}>
            </div>
            <div className={home_styles.fix_list_container}>
            </div>
        </>)
}