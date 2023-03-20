// Sources for hourly weather information
let sources = ['noaa', 'open_weather', 'tomorrow_io']

const hourly_data_sources = {
    'noaa': 'https://api.weather.gov/gridpoints/BTV/98,43/forecast/hourly?units=us',
    'tomorrow_io': `https://api.tomorrow.io/v4/timelines?location=44.17,-72.96&fields=temperature&timesteps=1h&units=imperial&apikey=${process.env.TMRWIO_APIKEY}`,
    'open_weather': `https://api.openweathermap.org/data/3.0/onecall?lat=44.18&lon=-72.99&exclude=minutely,daily,current,alerts&units=imperial&appid=${process.env.OW_APIKEY}`
}

// set a function that will return a promise will return a resolved value after the input amount of time (by way of using setTimeout)
//effectively this wait function will be pending for the input amount of time - using the .then or await syntax effectively builds in a delay to the synchronous code
function wait(time) {
    return new Promise(resolve => setTimeout(resolve, time))
}


export default async function (req, res) {
    
    try {
        let all_fetched_json = []
        if (req.query.source === undefined) {
            for (let source in hourly_data_sources) {
                if (source === 'noaa') {
                    try {
                        let ftFlg = Math.round(Date.now())
                        let fetched_data = await fetch(hourly_data_sources[source], { cache: "no-store", headers: { 'Feature-Flags': ftFlg } })
                        let retries = 0;
                        while (!fetched_data.ok && retries < 3) {
                            await wait(2000)
                            fetched_data = await fetch(hourly_data_sources[source], { cache: "no-store", headers: { 'Feature-Flags': ftFlg } })
                            retries++;
                        }
                        if (!fetched_data.ok) {console.log(`Call to ${source} unsuccessful`)}
                        else {
                            let fetched_json = await fetched_data.json();
                            fetched_json.source = source;
                            all_fetched_json.push(fetched_json);
                        }
                    } catch (error) {
                        console.error(`There was an error retrieving data from ${source}.  Error: ${error}`);
                    }
                } 
                else {
                    try {
                        let fetched_data = await fetch(hourly_data_sources[source], { cache: "no-store"})
                        let retries = 0;
                        while (!fetched_data.ok && retries < 3) {
                            await wait(2000)
                            fetched_data = await fetch(hourly_data_sources[source], { cache: "no-store"})
                            retries++;
                        }
                        if (!fetched_data.ok) {console.log(`Call to ${source} unsuccessful`)}
                        else {
                            let fetched_json = await fetched_data.json();
                            fetched_json.source = source;
                            all_fetched_json.push(fetched_json);
                        }
                    } catch (error) {
                        console.error(`There was an error retrieving data from ${source}.  Error: ${error}`);
                    }
                }
            }
            res.send(all_fetched_json)
        }
        else if (req.query.source === 'noaa') {
            try {
                let ftFlg = Math.round(Date.now()) //see https://github.com/weather-gov/api/discussions/492 for reason on adding the Feature-Flags header
                let fetched_data = await fetch(hourly_data_sources[req.query.source], { cache: "no-store", headers: { 'Feature-Flags': ftFlg } })
                let fetched_json = await fetched_data.json();
                res.send(fetched_json)
            } catch (error) {
                console.error(`There was an error retrieving data from ${req.query.source}.  Error: ${error}`);
                res.send(null)
            }
        }
        else if (Object.keys(hourly_data_sources).includes(req.query.source)) {
            try {
                let fetched_data = await fetch(hourly_data_sources[req.query.source], { cache: "no-store" })
                let fetched_json = await fetched_data.json();
                res.send(fetched_json)
            } catch (error) {
                console.error(`There was an error retrieving data from ${req.query.source}.  Error: ${error}`);
                res.send(null)
            }
        }
        else {res.send(null)}

    } catch (error) {
        console.log(`There was an error retrieving hourly weather data: ${error}`)
    }

}