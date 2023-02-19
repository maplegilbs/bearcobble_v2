//Libraries
import dotenv from 'dotenv';
dotenv.config();

export default async function (req, res) {

    console.log('api connected')

    if(req.method === 'GET') {
        let fetchedWeatherRes = await fetch (`https://api.weather.com/v2/pws/observations/current?stationId=KVTBRIST29&format=json&units=e&apiKey=${process.env.WUNDERGROUND_APIKEY}`);
        let fetchedWeatherJSON = await fetchedWeatherRes.json();
        console.log(fetchedWeatherJSON)
        res.send(fetchedWeatherJSON);
    }
    
}