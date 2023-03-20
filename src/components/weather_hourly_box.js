//Libraries
import { useEffect, useState } from 'react';
//Styles
import hourly_box_styles from './weather_hourly_box.module.scss';

const hoursToForecast = 6;

function setHourlyArray() {
    let nextSixHours = [];
    for (let i = 1; i <= hoursToForecast; i++) {
        let now = new Date();
        nextSixHours.push(now.valueOf() + (i * 60 * 60 * 1000) - now.getMinutes() * 60 * 1000 - now.getSeconds() * 1000 - now.getMilliseconds())
    }
    return nextSixHours;
}

function Hour_Container({ time, noaaData, owData }) {
    return (
        <div key={time} className={hourly_box_styles.hourly_record}>
            <h4>{new Date(time).getHours()}:00</h4>
            {noaaData ?
                <p>{noaaData.temperature}°&nbsp;<img className={hourly_box_styles.hourly_icon} alt='Icon of weather conditions' src={noaaData.icon.split(',0').join('')} width={30} height={32} /></p> :
                <p>--</p>
            }
            {owData ?
                <p>{Math.round(owData.temp)}°&nbsp;<img className={hourly_box_styles.hourly_icon} alt='Icon of weather conditions' src={`https://openweathermap.org/img/wn/${owData.weather[0].icon}@2x.png`} width={30} height={32} /></p> :
                <p>--</p>
            }
        </div>
    )
}

export default function Hourly_Forecast_Box() {
    const [times, setTimes] = useState(setHourlyArray);
    const [hourlyData, setHourlyData] = useState([]);

    useEffect(() => {
        let hourly_array = [];
        times.forEach(time => hourly_array.push(
            {
                'time': time,
                'noaa': {},
                'ow': {}
            }
        ))
        
        async function getHourly() {
            try {
                let noaa_hourly_data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/weather_forecast_hourly?source=noaa`);
                let noaa_hourly_json = await noaa_hourly_data.json();
                let noaa_selected_periods = noaa_hourly_json.properties.periods.filter(period => times.includes(new Date(period.startTime).valueOf()))
                hourly_array.forEach(record => {
                    record.noaa = noaa_selected_periods.find(period => new Date(period.startTime).valueOf() == record.time) ?
                        noaa_selected_periods.find(period => new Date(period.startTime).valueOf() == record.time)
                        :
                        null
                })
            } catch (error) { `There was an error fetching NOAA hourly data ${error}` }
            try {
                let ow_hourly_data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/weather_forecast_hourly?source=open_weather`);
                let ow_hourly_json = await ow_hourly_data.json();
                let ow_selected_periods = ow_hourly_json.hourly.filter(period => times.includes(new Date(period.dt * 1000).valueOf()))
                hourly_array.forEach(record => {
                    record.ow = ow_selected_periods.find(period => new Date(period.dt * 1000).valueOf() == record.time) ?
                        ow_selected_periods.find(period => new Date(period.dt * 1000).valueOf() == record.time)
                        :
                        null
                })
            } catch (error) { `There was an error fetching Open Weather hourly data ${error}` }
            setHourlyData(hourly_array);
        }
        getHourly();
    }, [])

    let hourly_columns = [];
    if (hourlyData.length > 0) {
        for (let i = 0; i < hoursToForecast; i++) {
            hourly_columns.push(<Hour_Container time={hourlyData[i].time} noaaData={hourlyData[i].noaa} owData={hourlyData[i].ow} />)
        }
    }

    return (
        <div className={hourly_box_styles.hourly_container}>
            <h2>Six Hour Forecast</h2>
            <hr/>
            <div className={hourly_box_styles.hourly_record}>
                <h3>Time</h3><h3 style={{justifyContent: 'center'}}>NOAA</h3><h3 style={{justifyContent: 'center'}}>Open Weather</h3>
            </div>
            {hourly_columns}
        </div>
    )

}