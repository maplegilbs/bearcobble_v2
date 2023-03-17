//Functions
import { extractSensorData } from '@/utils/extractSensorData';
//Styles
import home_styles from '@/styles/home_page_styles.module.scss';

export async function getServerSideProps() {
    let vacuumData, tankData;
    try {
        const sensor_data = await fetch(`${process.env.BASE_URL}api/sensor_data_read`);
        const sensor_json = await sensor_data.json();
        let extracted_sensor_data = extractSensorData(sensor_json);
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