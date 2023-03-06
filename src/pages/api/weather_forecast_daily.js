const api_lookup = {
    'noaa': 'https://api.weather.gov/gridpoints/BTV/98,43/forecast',
    'weatherunderground': `https://api.weather.com/v3/wx/forecast/daily/5day?geocode=44.17,-72.96&format=json&units=e&language=en-US&apiKey=${process.env.WU_APIKEY}`,
    'accuweather': `https://dataservice.accuweather.com/forecasts/v1/daily/5day/336184?apikey=${process.env.AW_APIKEY}`
}

export default async function (req, res) {
    if(req.method === 'GET'){
        if(Object.keys(api_lookup).includes(req.query.source)){
            try {
                let forecast_data = await fetch(api_lookup[req.query.source])
                let forecast_json = await forecast_data.json();
                console.log(forecast_json);
                res.send(forecast_json)
            } catch (error) {
                console.error(`There was an error fetching the forecast data: ${error}`)
            }
        }
        res.send(null)
    }
    res.send(null)
}