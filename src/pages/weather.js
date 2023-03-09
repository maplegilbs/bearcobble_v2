//Libraries
import dynamic from 'next/dynamic'
//Components
import Current_Weather_Box from '@/components/current_weather_Box.js'
import Weather_Forecast_Full from '@/components/weather_forecast_full'
const Weather_Forecast_Hourly_Graph = dynamic(() => { return import("@/components/weather_hourly_graph.js") }, { ssr: false })
//Styles
import weather_page_styles from '@/styles/weather_page_styles.module.scss'





export default function Weather({ wu_forecast, noaa_forecast, aw_forecast, noaa_hourly, ow_hourly, tmrw_io_hourly }) {



    return (
        <>
            <Current_Weather_Box />
            <div className={weather_page_styles.plotly_container}>
                <Weather_Forecast_Hourly_Graph />
            </div>
            <Weather_Forecast_Full />
        </>
    )
}