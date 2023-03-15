//Libraries
import { useEffect, useState } from "react";
//Components
import Weather_Row from "./weather_forecast_row";
import Image from "next/image";
//Images
import noaaIcon from '../../public/noaaLogo.png'
import wuIcon from '../../public/wundergroundLogo.png'
import awIcon from '../../public/accuweatherLogo.png'
//Styles
import weather_forecast_styles from '@/components/weather_forecast_full.module.scss';

export default function Weather_Forecast_Full() {
    const [forecastSource, setForecastSource] = useState('noaa');
    const [forecastData, setForecastData] = useState(null);
    const [forecastRows, setForecastRows] = useState([])

    useEffect(() => {
        async function getForecast() {
            try {
                let forecast_data = await fetch(`../api/weather_forecast_daily?source=${forecastSource.toLowerCase()}`)
                let forecast_json = await forecast_data.json();
                setForecastData(forecast_json)
            } catch (error) {
                console.log(`There was an error fetching the forecast from ${forecastSource}.  Error: ${error}`)
                setForecastData(null)
            }
        }
        getForecast();
    }, [forecastSource])

    useEffect(() => {
        if (forecastSource.toLowerCase() === 'noaa' && forecastData) {
            let forecast_periods = forecastData.properties.periods;
            let forecast_jsx = forecast_periods.map(period => {
                let row_data = {
                    'period_identifier': period.name,
                    'temperature': period.temperature,
                    'isDay': period.isDaytime,
                    'icon_url': period.icon,
                    'forecast': period.detailedForecast,
                    'wind_speed': period.windSpeed,
                    'wind_dir': period.windDirection,
                }
                return <Weather_Row key={row_data.period_identifier} row_data={row_data} />
            })
            setForecastRows(forecast_jsx)
        }
        else if (forecastSource.toLocaleLowerCase() === 'weatherunderground' && forecastData) {
            let forecast_jsx = [];
            let forecast_periods = forecastData.daypart[0];
            console.log(forecast_periods)
            for (let i = 0; i < forecast_periods.daypartName.length; i++) {
                if (forecast_periods.temperature[i]) {
                    let row_data = {
                        'period_identifier': forecast_periods.daypartName[i],
                        'temperature': forecast_periods.temperature[i],
                        'isDay': forecast_periods.dayOrNight[i] == 'D' ? true : false,
                        'icon_url': `https://www.wunderground.com/static/i/c/v4/${forecast_periods.iconCode[i]}.svg`,
                        'forecast': forecast_periods.narrative[i],
                        'wind_speed': forecast_periods.windSpeed[i],
                        'wind_dir': forecast_periods.windDirectionCardinal[i],
                    }
                    forecast_jsx.push(<Weather_Row key={row_data.period_identifier} row_data={row_data} />);
                }
            }
            setForecastRows(forecast_jsx);
        }
        else {
            setForecastRows([
                <h3 key='nodata'>Forecast data from {forecastSource} currently unavailable.  Try selecting a different forecast provider.</h3>
            ])
        }
    }, [forecastData])

    const forecast_source_icons = {
        'noaa': <Image src={noaaIcon} alt='Logo of National Oceanic and Atmospheric Administration' width={35} height={35} />,
        'weatherunderground': <Image src={wuIcon} alt='Logo of Weather Underground' width={35} height={35} />,
    }


    return (
        <>
            <div className={weather_forecast_styles.source_select_container}>
                <h3>Choose forecast source</h3>
                <div className={weather_forecast_styles.source_select_inner_container}>
                    {forecast_source_icons[forecastSource]}
                    <select
                        className={weather_forecast_styles.source_select}
                        onChange={(e) => {
                            setForecastSource(e.target.value)
                        }}
                    >
                        <option value='noaa'>NOAA</option>
                        <option value='weatherunderground'>Weather Underground</option>
                        {/* <option value='accuweather'>Accuweather</option> */}
                    </select>
                </div>
            </div>
            <div className={weather_forecast_styles.forecast_container}>
                {forecastRows}
            </div>
        </>
    )
}