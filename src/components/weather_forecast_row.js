//Styles
import weather_row_styles from '@/components/weather_forecast_row.module.scss'

export default function Weather_Row({row_data}){

    return (
        <>
        <div className={weather_row_styles.weather_row}>
            <div className={`${weather_row_styles.inner_box} ${weather_row_styles.left_box}`}>
                <img src={row_data.icon_url} />
                <h4>{row_data.isDay? 'High:': 'Low:'} {row_data.temperature}</h4>
            </div>
            <div className={`${weather_row_styles.inner_box} ${weather_row_styles.middle_box}`}>
                <h3>{row_data.period_identifier}</h3>
                <p>{row_data.forecast}</p>
            </div>
            <div className={`${weather_row_styles.inner_box} ${weather_row_styles.right_box}`}>
                <h4>Winds<br/>{row_data.wind_dir} @ {row_data.wind_speed}</h4>
            </div>
        </div>
        </>
    )
}