//Libraries
import { useEffect, useState } from 'react';
//Functions
import { formatTime } from '@/utils/formatDate';
import { dirDegToText } from '@/utils/weatherHelpers';
//Styles
import daily_forecast_styles from './weather_short_forecast.module.scss';

const daysToForecast = 3;

function noaaForecastRow(forecastData) {
    let forecastRows = [];
    for (let i = 0; i < daysToForecast * 2; i++) {
        let row_data = forecastData.properties.periods[i]
        let iconURL = row_data.icon.includes('http')? row_data.icon : `https://api.weather.gov${row_data.icon}`
        forecastRows.push(
            <div key={row_data.name} className={daily_forecast_styles.day_row}>
                <div className={`${daily_forecast_styles.inner_box} ${daily_forecast_styles.left_box}`}>
                    <img src={iconURL} />
                    <h4>{row_data.isDaytime ? 'High:' : 'Low:'} {row_data.temperature}</h4>
                </div>
                <div className={`${daily_forecast_styles.inner_box} ${daily_forecast_styles.middle_box}`}>
                    <h3>{row_data.name}</h3>
                    <p>{row_data.shortForecast}</p>
                </div>
                <div className={`${daily_forecast_styles.inner_box} ${daily_forecast_styles.right_box}`}>
                    <h4>Winds</h4><p>{row_data.windDirection} @ {row_data.windSpeed}</p>
                </div>
            </div>
        )
    }
    return (forecastRows)
}

function owForecastRow(forecastData) {
    let forecastRows = [];
    for (let i = 0; i < daysToForecast; i++) {
        let row_data = forecastData.daily[i]
        forecastRows.push(
            <div key={row_data.dt} className={daily_forecast_styles.day_row}>
                <div className={`${daily_forecast_styles.inner_box} ${daily_forecast_styles.left_box}`}>
                    <img
                        className={daily_forecast_styles.daily_icon}
                        src={`https://openweathermap.org/img/wn/${row_data.weather[0].icon}@2x.png`}
                    />
                    <h4>Hi: {Math.round(row_data.temp.max)} <br /> Low: {Math.round(row_data.temp.min)}</h4>
                </div>
                <div className={`${daily_forecast_styles.inner_box} ${daily_forecast_styles.middle_box}`}>
                    <h3>{formatTime(new Date(row_data.dt * 1000)).dow}</h3>
                    {/* <p>{row_data.weather[0].description.split('')[0].toUpperCase() + row_data.weather[0].description.slice(1)}</p> */}
                    <p>{row_data.weather[0].description}</p>
                    <p>
                        Morn: {Math.round(row_data.temp.morn)}° &nbsp;
                        Day: {Math.round(row_data.temp.day)}° &nbsp;
                        Eve: {Math.round(row_data.temp.eve)}° &nbsp;
                        Night: {Math.round(row_data.temp.night)}°  </p>
                </div>
                <div className={`${daily_forecast_styles.inner_box} ${daily_forecast_styles.right_box}`}>
                    <h4>Winds</h4><br /><p>{dirDegToText(row_data.wind_deg)} @ {Math.round(row_data.wind_speed)} mph </p>
                </div>
            </div>
        )
    }
    return (forecastRows)
}

export default function Short_Forecast() {
    const [source, setSource] = useState('noaa');
    const [forecastData, setForecastData] = useState(null)
    const [dataRows, setDataRows] = useState([]);

    useEffect(() => {
        async function getForecast() {
            try {
                let forecast_data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/weather_forecast_daily?source=${source}`)
                let forecast_json = await forecast_data.json();
                setForecastData(forecast_json)
            } catch (error) {
                console.error(`The daily forecast data from ${source} could not be fetched.  Error: ${error}`);
            }
        }
        getForecast();
    }, [source])

    useEffect(() => {
        setDataRows(source === 'noaa' && forecastData ?
            noaaForecastRow(forecastData) :
            source === 'openWeather' && forecastData ?
                owForecastRow(forecastData, source) : ['Forecast data temporarily unavailable.'])
    }, [forecastData])

    return (
        <div className={daily_forecast_styles.forecast_container}>
            <div className={daily_forecast_styles.forecast_container_header}>
                <h2>Short Range Forecast</h2><select onChange={(e) => setSource(e.target.value)}>
                    <option value='noaa'>NOAA</option>
                    <option value='openWeather'>Open Weather</option>
                </select>
            </div>
            <hr />
            <br />
            {dataRows}
        </div>
    )
}