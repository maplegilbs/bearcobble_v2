//Libraries
import dotenv from 'dotenv';
dotenv.config();

export default async function (req, res) {

    console.log('weather api connected')

    if(req.method === 'GET') {
        try {
            let fetchedWeatherRes = await fetch (`https://api.weather.com/v2/pws/observations/current?stationId=KVTBRIST29&format=json&units=e&apiKey=${process.env.WUNDERGROUND_APIKEY}`);
            let fetchedWeatherJSON = await fetchedWeatherRes.json();
            console.log(fetchedWeatherJSON)
            res.send(fetchedWeatherJSON);
        } catch (error) {
            console.error(`There was an error in fetching current weather data from weather underground: error: ${error} `);
            res.send(null)
        }
    }
    
}