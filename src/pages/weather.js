//Functions
import { formatTime } from "@/utils/formatDate";
//Styles
import weather_page_styles from "../styles/weather_page_styles.module.scss";

export async function getServerSideProps() {
    try {
        let wuCurrentData = await fetch(`https://api.weather.com/v2/pws/observations/current?stationId=${process.env.WU_STATIONID}&format=json&units=e&apiKey=${process.env.WU_APIKEY}`);
        let wuCurrentJSON = await wuCurrentData.json();
        console.log(wuCurrentJSON)
        let fetchedTime = new Date(wuCurrentJSON['observations'][0]['obsTimeLocal']);
        let time = formatTime(fetchedTime);
        delete time.inputTime;
        //let newTime = convertDateForIOS(time);
        let temp = wuCurrentJSON['observations'][0]['imperial']['temp'];
        let wind = wuCurrentJSON['observations'][0]['imperial']['windSpeed'];
        let windGust = wuCurrentJSON['observations'][0]['imperial']['windGust'];
        return ({props: {current_conditions: {temp: temp, wind: wind, windGust: windGust, time: time}}})
    } catch (error) {
        console.error(`There was an error fetching the data:  ${error}`);
        return ({props: {current_conditions: null}})
    }

}


export default function Weather({ current_conditions, wu_forecast, noaa_forecast, aw_forecast, noaa_hourly, ow_hourly, tmrw_io_hourly }) {
    console.log(current_conditions)
    return (
        <>
            <section className={weather_page_styles.current_conditions}>
                <h3>Bear Cobble Weather Station<br/>Current Conditions</h3>
                <div className={weather_page_styles.temp}>{current_conditions.temp}°</div>
                <div className={weather_page_styles.wind}><br />Wind: {current_conditions.wind} mph with gusts to {current_conditions.windGust} mph</div>
                <p className={weather_page_styles.updated}>Last Updated<br /> {current_conditions.time.dow}, {current_conditions.time.date} @ {current_conditions.time.time} {current_conditions.time.amPm}</p>
            </section>
        </>
    )
}