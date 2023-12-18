//Libraries
import { useCallback, useEffect, useState } from "react";
//Components
import Dial_Gauge from "@/components/gauge_dial";
import Box_Gauge from "@/components/gauge_box";
import Tank_Container from "@/components/tank";
import Slider_Toggler from "@/components/slider_toggler";
import Vacuum_History from "@/components/vacuum_history";
import Tank_History from "@/components/tank_history";
//Functions
import { formatTime } from "@/utils/formatDate";
import { extractSensorData } from "@/utils/extractSensorData";
//Styles
import sensor_page_styles from "../styles/sensor_page_styles.module.scss";

export default function Sensors() {
    const [vacuumData, setVacuumData] = useState()
    const [tankData, setTankData] = useState();
    const [isVacuumHistoryShown, setIsVacuumHistoryShown] = useState(false)
    const [isTankHistoryShown, setIsTankHistoryShown] = useState(false)

    //custom hook, see https://github.com/vercel/next.js/discussions/14810
    const useMediaQuery = (width) => {
        //set state variable
        const [targetReached, setTargetReached] = useState(false);
        //set a function to update state variable based on if the media query matches
        const updateTarget = useCallback(e => e.matches ? setTargetReached(true) : setTargetReached(false), []);
        useEffect(() => {
            //Will return a media query list object that can be used to determine if the document matches the passed in media query string
            //The mql object handles sending notifications to listeners when the media query state has changed
            const media = window.matchMedia(`(max-width: ${width}px)`)
            //Update the targetReached state variable whenever media query changes (whenever the test of if max-width exceeds our passed in media query string changes from true to false or vice-versa)
            media.addEventListener("change", updateTarget);
            //check on mount
            if (media.matches) { setTargetReached(true) }
            //cleanup
            return () => media.removeEventListener("change", updateTarget);
        }, [])
        return targetReached;
    }

    console.log(tankData)

    useEffect(() => {
        async function getSensorData() {
            try {
                const sensor_data = await fetch(`../api/sensor_data_read`);
                const sensor_json = await sensor_data.json();
                let extracted_sensor_data = extractSensorData(sensor_json);
                setVacuumData(extracted_sensor_data[0])
                setTankData(extracted_sensor_data[1])
            } catch (error) {
                console.error(`There was an error fetching sensor data: ${error}`);
            }
        }
        if (!vacuumData || !tankData) { getSensorData() }
        setInterval(() => {
            getSensorData()
        }, 30000);
    }, [])

    const isBreakpoint = useMediaQuery(1000);
    let gauge_containers = [];

    if (vacuumData) {
        for (let section_data in vacuumData) {
            gauge_containers.push(
                (isBreakpoint ?
                    <Box_Gauge
                        key={vacuumData[section_data].section_name}
                        section={vacuumData[section_data].section_name}
                        current_vacuum_level={Math.round(vacuumData[section_data].vacuum_reading * 10) / 10}
                        reading_time={formatTime(new Date(vacuumData[section_data].reading_time))}
                    /> :
                    <Dial_Gauge
                        key={vacuumData[section_data].section_name}
                        section={vacuumData[section_data].section_name}
                        current_vacuum_level={Math.round(vacuumData[section_data].vacuum_reading * 10) / 10}
                        reading_time={formatTime(new Date(vacuumData[section_data].reading_time))}
                    />)
            )
        }
    }

    let tank_containers = [];
    if (tankData) {
        for (let tank_data in tankData) {
            tank_containers.push(
                <Tank_Container
                    key={tankData[tank_data].tank_name}
                    tank_num={tankData[tank_data].tank_name}
                    current_tank_level={tankData[tank_data].tank_level}
                    reading_time={formatTime(new Date(tankData[tank_data].reading_time))}
                    status={tankData[tank_data].status}
                />
            )
        }
    }

    return (
        <>
            <div className={sensor_page_styles.section_heading_container}>
                <h1>Vacuum</h1>
                <hr className={sensor_page_styles.section_heading_hr} />
            </div>
            <div className={sensor_page_styles.sensor_container}>
                {vacuumData &&
                    gauge_containers
                }
            </div>
            <div className={sensor_page_styles.section_heading_container}>
                <h3>Vacuum History</h3><Slider_Toggler istoggled={isVacuumHistoryShown} setIsToggled={setIsVacuumHistoryShown}/>
                <hr className={sensor_page_styles.section_heading_hr} />
            </div>
            <div>
                {isVacuumHistoryShown &&
                <Vacuum_History />}
            </div>
            <div className={sensor_page_styles.section_heading_container}>
                <h1>Tanks</h1>
                <hr className={sensor_page_styles.section_heading_hr} />
            </div>
            <div className={sensor_page_styles.sensor_container}>
                {tankData &&
                    tank_containers.reverse()
                }
            </div>
            <div className={sensor_page_styles.section_heading_container}>
                <h3>Tank History</h3><Slider_Toggler istoggled={isTankHistoryShown} setIsToggled={setIsTankHistoryShown}/>
                <hr className={sensor_page_styles.section_heading_hr} />
            </div>
            <div>
                {isTankHistoryShown &&
                <Tank_History />}
            </div>
        </>
    )

}