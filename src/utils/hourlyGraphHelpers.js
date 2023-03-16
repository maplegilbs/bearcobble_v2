/*--Code associated with building hourly weather graph showing multiple sources--*/
//1 get hourly info from sources
//2 build object with those info values - object will have hourly timestamps as keys and nested objects with the source and values
//3 use object to build arrays for x and y values


//Global variables & functions
let hourlyData = [];
let xAxisTimeStampArray = [];
let xAxisTimeStampArrayFormatted = [];
let noaaGraphValues = [];
let oWMGraphValues = [];
let tmrwIOGraphValues = [];

function convertDateForIOS(date) {
    let dateArray = date.split(/[- :T]/);
    let formattedDate = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4], dateArray[5]);
    return formattedDate;
}

//formatted as 'Saturday, 1/15/2022 @ 12:15 PM' or 'Saturday, 1/15/2022
function formatDate(inputDate) {
    let minute, hour, day;
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    inputDate.getMinutes() < 10 ? minute = "0" + inputDate.getMinutes() : minute = inputDate.getMinutes();
    inputDate.getHours() < 10 ? hour = "0" + inputDate.getHours() : hour = inputDate.getHours();
    day = inputDate.getDate();
    let dayOfWeek = daysOfWeek[(inputDate.getDay())]
    let formattedDate = dayOfWeek + " " + hour + ":" + minute;
    return formattedDate;
}


//get fetched data and push to the hourly data array.  if the fetch function throws an error log the error and push a null value to the hourly data array
async function getHourlyData() {
    try {
        // let forecast_data = await fetch(`http://localhost:3000/api/weather_forecast_hourly`)
        let forecast_data = await fetch(`https://bearcobble.herokuapp.com//api/weather_forecast_hourly`)
        let forecast_json = await forecast_data.json();
        if (typeof forecast_json !== 'object') { throw ('Hourly forecast fetch did not return a data array.'); }
        hourlyData = forecast_json;
    }
    catch (e) {
        console.log(e)
        hourlyData.push(null)
    }
}



async function buildHourlyObj() {
    let comparisonTimes = [];
    let noaaData = hourlyData.filter(dataEntry => dataEntry.source === 'noaa')[0] ? hourlyData.filter(dataEntry => dataEntry.source === 'noaa')[0] : null;
    let oWMData = hourlyData.filter(dataEntry => dataEntry.source === 'open_weather')[0] ? hourlyData.filter(dataEntry => dataEntry.source === 'open_weather')[0] : null;
    let tmrwIOData = hourlyData.filter(dataEntry => dataEntry.source === 'tomorrow_io')[0] ? hourlyData.filter(dataEntry => dataEntry.source === 'tomorrow_io')[0] : null;
    //build an array of timeStamps from noaa and push that to our comparison times array only if the zero index of the hourly data array (in this case our noaa data) is not null
    let noaaHrlyInfByTime = {};
    if (noaaData !== null) {
        let noaaHrlyInf = noaaData.properties.periods;
        let noaaHrlyInfKeys = Object.keys(noaaHrlyInf);
        let noaaHrlyTmStmps = [];
        noaaHrlyInfKeys.forEach(key => {
            let keyTime = convertDateForIOS(noaaHrlyInf[key].startTime)
            if (keyTime - new Date() > 0) {
                noaaHrlyTmStmps.push(keyTime)
                noaaHrlyInfByTime[keyTime] = noaaHrlyInf[key].temperature;
            }
        })
        comparisonTimes.push(noaaHrlyTmStmps)
    }
    //build an array of timeStamps from open weather maps and push that to our comparison times array only if the first index of the hourly data array (in this case our owm data) is not null
    let oWMHrlyInfByTime = {};
    if (oWMData !== null) {
        let oWMHrlyInf = oWMData.hourly;
        let oWMHrlyInfKeys = Object.keys(oWMHrlyInf);
        let oWMHrlyTmStmps = [];
        oWMHrlyInfKeys.forEach(key => {
            let keyTime = new Date(oWMHrlyInf[key].dt * 1000)
            if (keyTime - new Date() > 0) {
                oWMHrlyTmStmps.push(keyTime)
                oWMHrlyInfByTime[keyTime] = oWMHrlyInf[key].temp;
            }
        })
        comparisonTimes.push(oWMHrlyTmStmps)
    }
    //build an array of timeStamps from tomorrow.io and push that to our comparison times array only if the second index of the hourly data array (in this case our tomorrow.io data) is not null
    let tmrwIOHrlyInfByTime = {};
    if (tmrwIOData !== null) {
        // console.log(tmrwIOData)
        let tmrwIOHrlyInf = tmrwIOData.data.timelines[0].intervals;
        let tmrwIOHrlyInfKeys = Object.keys(tmrwIOHrlyInf);
        let tmrwIOHrlyTmStmps = [];
        tmrwIOHrlyInfKeys.forEach(key => {
            let keyTime = new Date(tmrwIOHrlyInf[key].startTime)
            if (keyTime - new Date() > 0) {
                tmrwIOHrlyTmStmps.push(keyTime)
                tmrwIOHrlyInfByTime[keyTime] = tmrwIOHrlyInf[key].values.temperature;
            }
        })
        comparisonTimes.push(tmrwIOHrlyTmStmps)
    }
    //take the comparison times array and pass it into the compare times funciton to build a new array of merged and sorted timestamps to use for our x-axis
    compareTimes(comparisonTimes)
    //format the x axis time stamp array for display
    xAxisTimeStampArrayFormatted = xAxisTimeStampArray.map(timeStamp => formatDate(timeStamp))
    noaaData !== null ? noaaGraphValues = buildYValuesArray(noaaHrlyInfByTime) : noaaGraphValues = [null];
    oWMData !== null ? oWMGraphValues = buildYValuesArray(oWMHrlyInfByTime) : oWMGraphValues = [null];
    tmrwIOData !== null ? tmrwIOGraphValues = buildYValuesArray(tmrwIOHrlyInfByTime) : tmrwIOGraphValues = [null];
}


//given an object containing values in {timestamp: temp} formatted pairing, build an array of temperatures to match up to the timestamp array, where if no temperature exists at a given time input null
//ex) input object {1:00: 15, 2:00: 17}, matched with XAxisTimeStamps: [12:00,1:00,2:00,3:00] produces values [null, 15, 17, null] - this would be an array for a dataset containing only temperatures values at 1:00 and 2:00
function buildYValuesArray(inputObj) {
    let valuesArray = [];
    let inputObjTimes = Object.keys(inputObj);
    for (let i = 0; i < xAxisTimeStampArray.length; i++) {
        xAxisTimeStampArray[i] == inputObjTimes[i] ? valuesArray.push(inputObj[inputObjTimes[i]]) : valuesArray.push(null);
    }
    return valuesArray;
}

//takes multiple input arrays of date objects, combines them, sorts them, eliminates duplicate values and any values not in the future, returns a single array of the result
function compareTimes(timeStampArrays) {
    let curTime = new Date();
    //make one array comprised of all the others
    let masterArray = [];
    timeStampArrays.forEach(timeStampArray => { masterArray = masterArray.concat(timeStampArray) })
    //sort the master array chronologically
    masterArray.sort((a, b) => { return a - b });
    //push the values to our final array, only of they are not duplicates (as long as the next element is not the same)
    for (let i = 0; i < masterArray.length - 1; i++) {
        if (masterArray[i].valueOf() !== masterArray[i + 1].valueOf()) {
            xAxisTimeStampArray.push(masterArray[i])
        }
    }
    //delete any times that are not in the future (if first element minus current time is less than zero it is in the past, remove it and repeat on the mutated array)
    while (xAxisTimeStampArray[0] - curTime < 0) {
        xAxisTimeStampArray.shift()
    }
    // totalXAxisValues = xAxisTimeStampArray.length;
    return xAxisTimeStampArray;
}

export async function compileGraphData() {
    hourlyData = [];
    xAxisTimeStampArray = [];
    xAxisTimeStampArrayFormatted = [];
    noaaGraphValues = [];
    oWMGraphValues = [];
    tmrwIOGraphValues = [];
    await getHourlyData();
    buildHourlyObj();
    let dataObj = {};
    dataObj.formatDate = formatDate;
    // console.log(xAxisTimeStampArray.length)
    if (xAxisTimeStampArray.length > 0) dataObj.timeAxis = xAxisTimeStampArray;
    if (xAxisTimeStampArrayFormatted.length > 0) dataObj.timeAxisFormatted = xAxisTimeStampArrayFormatted;
    if (noaaGraphValues.length > 0) dataObj.noaaHourlyTemps = noaaGraphValues;
    if (oWMGraphValues.length > 0) dataObj.oWMHourlyTemps = oWMGraphValues;
    if (tmrwIOGraphValues.length > 0) dataObj.tmrwIOHourlyTemps = tmrwIOGraphValues;
    return (dataObj)
}
