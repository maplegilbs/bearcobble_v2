//Functions
import { formatTime } from '@/utils/formatDate';
//Styles
import current_conditions_styles from './weather_current_conditions.module.scss';

export default function Current_Conditions({curWeatherData}) {
    return (<>
        <h3>Bear Cobble Weather Station<br />Current Conditions</h3>
        {curWeatherData &&
            <>
                <h2 className={current_conditions_styles.temp}>{curWeatherData.observations[0].imperial.temp}°</h2>
                <div className={current_conditions_styles.condition_details}>
                    <p>
                        <span className={current_conditions_styles.category}>Wind</span>
                        {curWeatherData.observations[0].imperial.windSpeed} mph
                    </p>
                    <p>
                        <span className={current_conditions_styles.category}>Gusts</span>
                        {curWeatherData.observations[0].imperial.windGust} mph
                    </p>
                    <p>
                        <span className={current_conditions_styles.category}>Windchill</span>
                        {curWeatherData.observations[0].imperial.windChill}°
                    </p>
                    <p>
                        <span className={current_conditions_styles.category}>Barometer</span>
                        {curWeatherData.observations[0].imperial.pressure}
                    </p>
                    <br/>
                    <p>Updated<br/> {`${formatTime(new Date(curWeatherData.observations[0].obsTimeLocal)).dow} @ ${formatTime(new Date(curWeatherData.observations[0].obsTimeLocal)).time} ${formatTime(new Date(curWeatherData.observations[0].obsTimeLocal)).amPm} `}</p>
                </div>
            </>
        }

    </>)
}