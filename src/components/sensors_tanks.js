//Libraries
import { useEffect, useState } from 'react';
//Components
import Tank_Container from './tank.js';
//Functions
import { extractSensorData } from '@/utils/extractSensorData.js';
import { formatTime } from '@/utils/formatDate.js';
//Styles
import tank_sensor_styles from './sensors_tanks.module.scss';

function buildTankComponents ({tank1, tank2, tank3, tank4, tank5}){
    let tankDataArray = [tank5, tank4, tank3, tank2, tank1];
    let tankComponents = tankDataArray.map(tankDataItem =>{
        return <Tank_Container 
        key ={tankDataItem.tank_name}
        tank_num={tankDataItem.tank_name} 
        current_tank_level={tankDataItem.tank_level} 
        reading_time={formatTime(new Date(tankDataItem.reading_time))}/>
    })
    return tankComponents;
}

export default function Tank_Sensors() {
    const [tankSensorData, setTankSensorData] = useState(null);

    useEffect(() => {
        async function getTankData() {
            try {
                const sensor_data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/sensor_data_read`);
                const sensor_json = await sensor_data.json();
                let extracted_sensor_data = extractSensorData(sensor_json);
                setTankSensorData(extracted_sensor_data[1]);
            }
            catch (error) { console.error(`There was an error fetching sensor data: ${error}`) }
        }
        if (!tankSensorData) { getTankData() }
        setInterval(() => {
            getTankData()
        }, 30000);
    }, [])

    return (
        <div className={tank_sensor_styles.tank_container}>
        {tankSensorData &&
        buildTankComponents(tankSensorData)
        }
        </div>
    )
}