//Functions
import { formatTime } from "@/utils/formatDate";
//Libraries
import { useState, useEffect } from "react";
//Styles
import current_weather_styles from '@/components/current_weather_Box.module.scss'

export default function Current_Weather_Box() {
    const [isFetchSyncedTo15Min, setIsFetchSyncedTo15Min] = useState(false);
    const [currentWeather, setCurrentWeather] = useState(null);

    // 1 when page first loads, get the weather
    // 2 then begin testing if it is 0, 15, 30 of 45 min past the hour do this every minute
    // 2a once it is synced to a 15 minute interval, fetch the weather / begin a new timer that runs every 15 minutes to fetch the weather
    // 2b if the fetched weather is new, clear interval from step 2
    //if the currentWeather state variable doesn't exist (null), or is different than the fetched weather data, set the currentWeather state variable to be the fetched weather data
    async function getWeather() {
        try {
            let weatherRes = await fetch('../api/weather_current');
            let weatherData = await weatherRes.json();
            weatherData = weatherData.observations[0];
            if (currentWeather) {
                let isWeatherDataNew = !(weatherData.obsTimeLocal == currentWeather.obsTimeLocal);
                if (isWeatherDataNew) { setCurrentWeather(weatherData) }
            }
            else { setCurrentWeather(weatherData) }
        } catch (error) {
            console.error(`There was an error getting current weather: ${error}`);
        }
    }

    useEffect(() => {
        // run get weather function which will set the currentWeather state, only if it has not already been set
        if (!currentWeather) { getWeather() }
        // if the app has not yet been synced to 15 minute intervals
        if (!isFetchSyncedTo15Min) {
            // set an interval to run every minute testing if check if it is 0, 15, 30 or 45 past (when the weather api updates - give 1 minute of buffer time to allow for api to update)
            let timeCheckInterval = setInterval(() => {
                // if the current time is 0, 15, 30, or 45 past, (with 1 minute of buffer) fetch the weather then 'sync' the app to fetch the weather every 15 minutes thereafter
                // additionally, clear the interval being used to test if the current time for above conditions 
                if ((new Date().getMinutes() % 15 === 1)) {
                    // get the weather
                    getWeather()
                    // set the state of our app to have been 'synced'
                    setIsFetchSyncedTo15Min(true);
                    //set a new interval to run every 15 minutes to fetch the weather
                    setInterval(() => {
                        getWeather();
                    }, 15 * 60 * 1000)
                    //clear the interval being used to test the current time 
                    clearInterval(timeCheckInterval)
                }
            }, 60000)
        }
    }, [])


    console.log(currentWeather)
    return (
        <>
        { currentWeather &&
            <section className={current_weather_styles.current_conditions}>
                <h3>Bear Cobble Weather Station<br />Current Conditions</h3>
                <div className={current_weather_styles.temp}>{currentWeather.imperial.temp}°</div>
                <div className={current_weather_styles.wind}><br />Wind: {currentWeather.imperial.windSpeed} mph with gusts to {currentWeather.imperial.windGust} mph</div>
                <p className={current_weather_styles.updated}>Last Updated<br /> {formatTime(new Date(currentWeather.obsTimeLocal)).dow}, {formatTime(new Date(currentWeather.obsTimeLocal)).date} @ {formatTime(new Date(currentWeather.obsTimeLocal)).time} {formatTime(new Date(currentWeather.obsTimeLocal)).amPm}</p>
            </section>
        }
        </>
    )
}