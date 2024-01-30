//Libraries
import { useState, useEffect } from 'react';
//Styles
import gauge_box_styles from './gauge_box.module.scss';

const percentPerVacLevel = 100 / 29;
function getIndicatorColorFromVacLevel(vacLevel) {
    if (vacLevel >= 27) return 'darkgreen';
    if (vacLevel >= 26) return 'green';
    else if (vacLevel >= 25) return 'yellow';
    else if (vacLevel >= 20) return 'darkorange';
    else if (vacLevel > 0) return 'red';
    else return 'lightgrey'
}

export default function Box_Gauge({ section, current_vacuum_level, reading_time, status }) {
    const [isStale, setIsStale] = useState(false);
    let msTillDataIsStale = 5 * 60 * 1000 // 5 minute delay then data is considered "stale"
    let msBetweenEachStaleCheck = 1 * 60 * 1000 //check if data is stale every minute

    useEffect(() => {
        function checkIfStale() {
            if (new Date() - new Date(reading_time.inputTime) > msTillDataIsStale) setIsStale(true);
            else setIsStale(false)
        }
        checkIfStale();
        let checkIfStaleInterval = setInterval(checkIfStale, msBetweenEachStaleCheck)
        return (() => clearInterval(checkIfStaleInterval));
    }, [reading_time])

    return (
        <div className={gauge_box_styles.box_container}>
            <div
                className={gauge_box_styles.inner_box}
                style={status === 0 ? { background: `linear-gradient(white ${100-current_vacuum_level * percentPerVacLevel}%, ${getIndicatorColorFromVacLevel(current_vacuum_level)} ${150-current_vacuum_level * percentPerVacLevel}%) 100%` } : {backgroundColor: "white"}}
            >
                <p className={gauge_box_styles.section_label}>{section}</p>
                {status === 0 ?
                <h1 className={gauge_box_styles.vac_reading}>{current_vacuum_level}</h1>
                :
                <p className={gauge_box_styles.sensor_alert}>Sensor Offline</p>
                }
                <p
                    className={gauge_box_styles.reading_time}
                    style={{ backgroundColor: `${isStale ? 'rgba(220,20,20,.5)' : 'transparent'}` }}>
                    {reading_time.time} {reading_time.amPm}<br />{reading_time.dow} {reading_time.date}
                </p>
            </div>
        </div>
    )
}