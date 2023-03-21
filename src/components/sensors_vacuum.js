//Libraries
import { useEffect, useState } from 'react';
//Components
import Box_Gauge from './gauge_box';
//Functions
import { extractSensorData } from '@/utils/extractSensorData.js';
import { formatTime } from '@/utils/formatDate.js';
//Styles
import vacuum_sensor_styles from './sensors_vacuum.module.scss';

function buildVacuumComponents ({section1, section2, section3, section4, section5}){
    let sectionDataArray = [section1, section2, section3, section4, section5];
    let sectionComponents = sectionDataArray.map(sectionDataItem =>{
        return <Box_Gauge 
        style={{fontSize: '5rem'}}
        key ={sectionDataItem.section_name}
        section={sectionDataItem.section_name} 
        current_vacuum_level={sectionDataItem.vacuum_reading.toFixed(1)} 
        reading_time={formatTime(new Date(sectionDataItem.reading_time))}/>
    })
    return sectionComponents;
}

export default function Vacuum_Sensors() {
    const [vacuumSensorData, setVacuumSensorData] = useState(null);

    useEffect(() => {
        async function getVacuumData() {
            try {
                const sensor_data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/sensor_data_read`);
                const sensor_json = await sensor_data.json();
                let extracted_sensor_data = extractSensorData(sensor_json);
                setVacuumSensorData(extracted_sensor_data[0]);
            }
            catch (error) { console.error(`There was an error fetching sensor data: ${error}`) }
        }
        if (!vacuumSensorData) { getVacuumData() }
        setInterval(() => {
            getVacuumData()
        }, 30000);
    }, [])

    
    return (
        <div className={vacuum_sensor_styles.vacuum_container}>
        {vacuumSensorData &&
        buildVacuumComponents(vacuumSensorData)
        }
        </div>
    )
}