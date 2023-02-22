//Libraries
//Functions
import { formatTime } from '@/utils/formatDate.js';
//Hooks
import { useEffect, useState, useCallback } from 'react';
//Components
import Primary_Nav from './primary_nav';
//Styles
import header_styles from './primary_header.module.scss';



export default function Primary_Header() {
    const [isMobileMenuDisplayed, setIsMobileMenuDisplayed] = useState(false);
    const [isFetchSyncedTo15Min, setIsFetchSyncedTo15Min] = useState(false);
    const [currentWeather, setCurrentWeather] = useState(null);
    const [currentDateTime, setCurrentDateTime] = useState(formatTime(new Date()))

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

    //update the time every 15 seconds
    useEffect(() => {
        setInterval(() => {
            setCurrentDateTime(formatTime(new Date()));
        }, 15000)
    }, [])


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
                if (isWeatherDataNew) {
                    setCurrentWeather(weatherData);
                }
            }
            else {
                setCurrentWeather(weatherData)
            }
        } catch (error) {
            console.error(`There was an error getting current weather: ${error}`);
        }
    }

    useEffect(() => {
        // run get weather function which will set the currentWeather state, only if it has not already been set
        if(!currentWeather){ getWeather()}
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
                    }, 15*60 * 1000)
                    //clear the interval being used to test the current time 
                    clearInterval(timeCheckInterval)
                }
            }, 60000)
        }
    }, [])


    const isBreakpoint = useMediaQuery(720)


    return (
        <header className={header_styles.primary_header}>
            {currentWeather ?
                <div className={header_styles.weather_info}>{currentDateTime.time} <span className={header_styles.am_pm}> &nbsp;{currentDateTime.amPm} </span>&nbsp;&nbsp;
                    {/* if the current weather is older than ~30 minutes, do not display */}
                    {new Date() - new Date(currentWeather.obsTimeLocal) < 1800000 ?
                        `${currentWeather.imperial.temp}${'\u00b0'}`
                        :
                        ''
                    }
                </div>
                :
                <div className={header_styles.weather_info}></div>
            }
            <Primary_Nav isMobileMenuDisplayed={isMobileMenuDisplayed} setIsMobileMenuDisplayed={setIsMobileMenuDisplayed} />
            {isBreakpoint &&
                <p className={header_styles.mobile_menu_icon} onClick={() => setIsMobileMenuDisplayed((prev) => !prev)}>Menu</p>
            }
        </header>
    )
}