//Styles
import gauge_dial_styles from './gauge_dial.module.scss';

const degreesPerVacLevel = 180 / 30;
function getIndicatorColorFromVacLevel(vacLevel) {
    if (vacLevel > 25) return 'rgba(40,225,40,.9)';
    else if (vacLevel > 20) return 'goldenrod';
    else if (vacLevel > 0) return 'red';
    else return 'lightgrey'
}

export default function Dial_Gauge({ section, current_vacuum_level, reading_time}) {


    return (
        <div className={gauge_dial_styles.dial_container}>
            <div
                className={gauge_dial_styles.outer_dial}
                style={{ background: `conic-gradient(from 270deg, black, rgba(230,230,230,1) 1deg ${180 - current_vacuum_level * degreesPerVacLevel}deg, ${getIndicatorColorFromVacLevel(current_vacuum_level)} ${180 - current_vacuum_level * degreesPerVacLevel}deg 179deg, black 179deg, transparent 180deg  )` }}
            >
                <div className={gauge_dial_styles.inner_dial}>
                    <h1 className={gauge_dial_styles.vac_reading}>{current_vacuum_level}</h1>
                    <div className={gauge_dial_styles.shadow_div}></div>
                    <p className={gauge_dial_styles.section_label}>{section}</p>
                    <p className={gauge_dial_styles.reading_time}>{reading_time.time} {reading_time.amPm}<br/>{reading_time.dow} {reading_time.date}</p>
                </div>
            </div>
        </div>
    )
}