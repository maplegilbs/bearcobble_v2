//Components
import Current_Weather_Box from '@/components/current_weather_Box.js'
import Weather_Forecast_Full from '@/components/weather_forecast_full'
//Styles





export default function Weather ({ wu_forecast, noaa_forecast, aw_forecast, noaa_hourly, ow_hourly, tmrw_io_hourly }) {



    return (
        <>
           <Current_Weather_Box />
           <Weather_Forecast_Full />
        </>
    )
}