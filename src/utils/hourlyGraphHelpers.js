/*--Code associated with building hourly weather graph showing multiple sources--*/
//1 get hourly info from sources
//2 build object with those info values - object will have hourly timestamps as keys and nested objects with the source and values
//3 use object to build arrays for x and y values

//imports
// import { convertDateForIOS } from './forecastHelpers.js';
// import { formatDate } from './graphHelpers.js';

//Global variables
let hourlyData = [];
let xAxisTimeStampArray = [];
let xAxisTimeStampArrayFormatted = [];
let noaaGraphValues, oWMGraphValues, tmrwIOGraphValues;


//get fetched data and push to the hourly data array.  if the fetch function throws an error log the error and push a null value to the hourly data array
async function addFetchedDataToArray(source) {
    try {
        let fetchedData = await getData(source)
        hourlyData.push(fetchedData)
    }
    catch (e) {
        console.log(e)
        hourlyData.push(null)
    }
}

//given an object containing values in {timestamp: temp} formatted pairing, build an array of temperatures to match up to the timestamp array
//if no temperature exists at a given time input null
// ex times: [12:00,1:00,2:00,3:00] values [null, 15, 17, null] - this would be an array for a dataset containing only temperatures values at 1:00 and 2:00
//return the final array
function buildYValuesArray(inputObj) {
    let valuesArray = [];
    let inputObjTimes = Object.keys(inputObj);
    for (let i = 0; i < xAxisTimeStampArray.length; i++) {
        if (xAxisTimeStampArray[i] == inputObjTimes[i]) {
            valuesArray.push(inputObj[inputObjTimes[i]])
        }
        else {
            valuesArray.push(null)
        }
    }
    return valuesArray;
}



async function buildHourlyObj() {
    let comparisonTimes = [];
    for (let i = 0; i < sources.length; i++) {
        await addFetchedDataToArray(sources[i])
    }
    let noaaData = hourlyData[0];
    let oWMData = hourlyData[1];
    let tmrwIOData = hourlyData[2];
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
    xAxisTimeStampArray = compareTimes(comparisonTimes)
    //format the x axis time stamp array for display
    xAxisTimeStampArrayFormatted = xAxisTimeStampArray.map(timeStamp => {
        return formatDate(timeStamp)
    })
    if (noaaData !== null) {
        noaaGraphValues = buildYValuesArray(noaaHrlyInfByTime);
    }
    else { noaaGraphValues = [null] }
    if (oWMData !== null) {
        oWMGraphValues = buildYValuesArray(oWMHrlyInfByTime);
    }
    else { oWMGraphValues = [null] }
    if (tmrwIOData !== null) {
        tmrwIOGraphValues = buildYValuesArray(tmrwIOHrlyInfByTime);
    }
    else { tmrwIOGraphValues = [null] }
}



//takes multiple input arrays of date objects, combines them, sorts them, eliminates duplicate values and any values not in the future, returns a single array of the result
function compareTimes(timeStampArrays) {
    //establish the current time
    let curTime = new Date();
    //make an empty array that will have our final values to return
    let xAxisTimeStampArray = [];
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

//to build rectangles to distinguish night vs day in the hourly map.  For some reason using the classes for this does not work.  Object build manually in function rectShapes.
class graphRectShape {
    constructor(xStart, xEnd) {
        this.type = 'rect';
        this.yref = 'paper';
        this.y0 = '0';
        this.y1 = '1';
        this.line = { width: 0 };
        this.fillcolor = '#333333';
        this.opacity = '0.7';
        this.xref = 'paper';
        this.x0 = xStart;
        this.x1 = xEnd;
    }
}


//build rectangular 'shapes' to represent nighttime on the hourly graph.  times between 7pm and 7am will have a light grey background
//take in the array from the x axis (timestamps) and build individual arrays of consecutive timestamps between those hours.  so we will have something like this [[Tue 7pm, Tue 8pm ..... Wed 7am], [Wed 7pm, Wed 8pm ..... Thur 7am]] 
//then take the first and last item of each individual array and use that to build a new object to make a 'shape' object in the layout settings of plotly
function rectShapes(inputAxisArray) {
    let rectStartEndArray = [];
    let nightArray = [];
    for (let i = 0; i < inputAxisArray.length; i++) {
        let curHour = inputAxisArray[i].getHours();
        //if current timestamp is between 7pm and 7am push into an array
        if (curHour >= 19 || curHour <= 7) {
            nightArray.push(inputAxisArray[i])
        }
        //if current timestamp is not within 7pm to 7am, or is the last timestamp from the input array.  and the night array already has at least 2 values, push the whole night array to the rectangle shape array and then clear the night array
        if ((curHour === 8 || i === inputAxisArray.length - 1) && nightArray.length > 1) {
            rectStartEndArray.push(nightArray);
            nightArray = [];
        }
        else if (curHour === 8 && nightArray.length < 2) {
            nightArray = [];
        }
    }
    let rectShapesArray = rectStartEndArray.map(innerArray => {
        let xStart = formatDate(innerArray[0], false);
        let xEnd = formatDate(innerArray[innerArray.length - 1], false);
        let objToReturn = /*new graphRectShape(xStart,xEnd)*/{
            type: 'rect',
            yref: 'paper',
            y0: 0,
            y1: 1,
            line: { width: 0 },
            fillcolor: '#333333',
            opacity: .2,
            xref: 'x',
            x0: xStart,
            x1: xEnd
        }
        return objToReturn;
    })
    return rectShapesArray;
}



// async function showGraph() {
//     await buildHourlyObj();
//     let rectShapesArray = rectShapes(xAxisTimeStampArray);
//     buildGraph(rectShapesArray);
// }

// showGraph();