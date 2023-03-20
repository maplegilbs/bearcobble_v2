//Libraries
import { useEffect } from 'react';
//Compontents
import Link from 'next/link';
import Image from 'next/image';
import Current_Conditions from '@/components/weather_current_conditions';
import Hourly_Forecast_Box from '@/components/weather_hourly_box';
import Short_Forecast from '@/components/weather_short_forecast';
import Box_Gauge from '@/components/gauge_box';
//Functions
import { extractSensorData } from '@/utils/extractSensorData';
//Styles
import home_styles from '@/styles/home_page_styles.module.scss';
//Images
import WeatherIcon from '../../public/IconColor-Weather.png'
import SensorIcon from '../../public/IconColor-Sensor.png'
import MapIcon from '../../public/IconColor-Map.png'

export async function getServerSideProps() {
    let vacuumData = null;
    let tankData = null;
    let curWeatherData = null;
   
    
    try {
        const sensor_data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/sensor_data_read`);
        const sensor_json = await sensor_data.json();
        let extracted_sensor_data = extractSensorData(sensor_json);
        vacuumData = extracted_sensor_data[0];
        tankData = extracted_sensor_data[1];
    }
    catch (error) { console.error(`There was an error fetching sensor data: ${error}`) }
    try {
        const weather_data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/weather_current`);
        const weather_json = await weather_data.json();
        curWeatherData = weather_json;
    } catch (error) {
        console.error(`There was an error fetching current weather data: ${error}`)
        curWeatherData = null
    }
    return ({ props: { vacuumData: vacuumData, tankData: tankData, curWeatherData: curWeatherData } })
}


export default function Main({ vacuumData, tankData, curWeatherData }) {

    useEffect(() => {

    }, [])

    return (
        <>
            <div className={home_styles.main_container}>
                <div className={home_styles.info_grid}>
                    <div className={`${home_styles.sensor_summary} ${home_styles.info_box}`}>
                        <div className={home_styles.tab}>
                            <Link href="./sensors">Sensors
                                <Image src={SensorIcon} alt='Icon of a sensor' />
                            </Link>
                        </div>
                        <div className={home_styles.sensor_headers}></div>
                        <div className={home_styles.sensor_details}>
                        </div>
                    </div>
                    <div className={`${home_styles.weather}  ${home_styles.info_box}`}>
                        <div className={home_styles.tab}>
                            <Link href="./weather">Weather
                                <Image src={WeatherIcon} alt='Icon of a sun and clouds' />
                            </Link>
                        </div>
                        <div className={home_styles.current_conditions}>
                            <Current_Conditions curWeatherData={curWeatherData} />
                        </div>
                        <div className={home_styles.hourly_forecast}>
                            <Hourly_Forecast_Box />
                        </div>
                        <div className={home_styles.daily_forecast}>
                            <Short_Forecast />
                        </div>

                    </div>
                    <div className={`${home_styles.fix_list}  ${home_styles.info_box}`}>
                        <div className={home_styles.tab}></div>
                        <div className={home_styles.display_controls}></div>
                        <div className={home_styles.table_container}></div>
                    </div>
                </div>
            </div>
        </>)
}