//Components
import Current_Weather_Box from '@/components/current_weather_Box.js'
//Styles





export default function Weather ({ current_conditions, wu_forecast, noaa_forecast, aw_forecast, noaa_hourly, ow_hourly, tmrw_io_hourly }) {


    return (
        <>
           <Current_Weather_Box />
        </>
    )
}