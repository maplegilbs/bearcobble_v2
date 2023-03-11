//Libraries
import dotenv from 'dotenv'
dotenv.config()

export default async function (req, res){
    if (req.method === 'GET'){
        try {
            const sensor_data = await fetch(process.env.SMARTREK_SENSORS_JSON_URL);
            const sensor_json = await sensor_data.json();
            res.send(sensor_json);
        } catch (error) {
            console.error(`There was an error in fetching current sensor data from error: ${error} `);
            res.send(null)
        }
    }
}