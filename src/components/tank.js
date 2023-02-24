//Libraries
import { useEffect, useState } from 'react';
//Functions
import { calcVolFromHeight } from '@/utils/tankVolFromHeight';
//Styles
import tank_styles from './tank.module.scss';


export default function Tank_Container({ tank_num, current_tank_level, reading_time }) {
    const [isStale, setIsStale] = useState(false);
    let msTillDataIsStale = 5 * 60 * 1000 // 5 minute delay then data is considered "stale"
    let msBetweenEachStaleCheck = 1 * 60 * 1000 //check if data is stale every minute
    let percentFull = Math.round(calcVolFromHeight(current_tank_level) / 8700 * 100);


    useEffect(() => {
        function checkIfStale() {
            console.log(reading_time.time)
            if (new Date() - new Date(reading_time.inputTime) > msTillDataIsStale) setIsStale(true);
            else setIsStale(false)
        }
        checkIfStale()
        let checkIfStaleInterval = setInterval(checkIfStale, msBetweenEachStaleCheck)
        return (() => clearInterval(checkIfStaleInterval));
    }, [reading_time])


    return (
        <div className={tank_styles.tank_outer_container}>
            <div
                className={tank_styles.tank_inner_container}
                style={{ background: `linear-gradient(white ${100 - percentFull}%, rgba(51, 114, 200, 0.5) ${100 - percentFull}% 100%)` }}>
                <h4 className={tank_styles.tank_number}>{tank_num}</h4>
                <p className={tank_styles.tank_volume}>{calcVolFromHeight(current_tank_level)} <span className={tank_styles.tank_level_gallons}>gal</span></p>
                <p className={tank_styles.tank_level}>{Math.round(current_tank_level)}"</p>
                <p
                    className={tank_styles.reading_time}
                    style={{ backgroundColor: `${isStale ? 'rgba(220,20,20,.5)' : 'transparent'}` }}>
                    {reading_time.time} {reading_time.amPm}<br />{reading_time.dow}  {reading_time.date}
                </p>
            </div>
        </div>
    )
}