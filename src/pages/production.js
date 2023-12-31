//Libraries
import mysql from 'mysql2';
import { useEffect, useState } from 'react';
//Styles
import production_styles from '@/styles/production_page_styles.module.scss';
//Functions
import { formatTime } from '@/utils/formatDate';


//get all production data from db and pass it as a prop to main compoenent
//be sure the production data is sorted chronologically
export async function getServerSideProps() {
    let productionYears = [2023, 2022, 2021, 2020, 2019, 2018];
    let productionData = [];
    const pool = mysql.createPool({
        host: process.env.MYSQL_DB_HOST,
        user: process.env.MYSQL_DB_USER,
        password: process.env.MYSQL_DB_PASSWORD,
        database: process.env.MYSQL_DB_NAME
    }).promise();
    for (let i = 0; i < productionYears.length; i++) {
        let returnedResults = await pool.query(`select barrel_id, drum_number, gallons from production${productionYears[i]} order by barrel_id`);
        returnedResults = await JSON.parse(JSON.stringify(returnedResults[0]));
        productionData.push(returnedResults);
    }
    return ({ props: { productionData: productionData } })

}

// take array of data (also arrays) and find the chronologically first and last dates
// inner arrays of the data array must be sorted chronologically
function findStartAndFinishDates(dataArray) {
    let absoluteMinMax = [];
    let yearlyMinMax = [];
    dataArray.forEach(innerArray => {
        let minDate = formatTime(new Date(innerArray[0].barrel_id))
        let minRelative = minDate.month.toString().concat(minDate.day);
        let maxDate = formatTime(new Date(innerArray[innerArray.length - 1].barrel_id))
        let maxRelative = maxDate.month.toString().concat(maxDate.day);
        yearlyMinMax.push(minRelative)
        yearlyMinMax.push(maxRelative)
        yearlyMinMax.sort();
    });
    absoluteMinMax[0] = yearlyMinMax[0];
    absoluteMinMax[1] = yearlyMinMax[yearlyMinMax.length - 1];
    return absoluteMinMax;
}

//Build an empty object with keys containing date + times, incrementing by 8 hour intervals (or whatever amount we want to adjust by)
//The first and last date/time will be dictated by the minMax array arguement minMax[0] being our start date & time minMax[1] being our end date and time
//This object will be later populated by the production data.
function buildEmptyChronologicObject(minMax) {
    let chronologicObj = {};
    let intervalDuration = 8;
    //format as MM-DD HH:MM - formatting the year to be 00 or 2000 so we can compare all years based on month and day
    let startDate = new Date(`2000, ${minMax[0].slice(0, 2)}, ${minMax[0].slice(2, 4)}`);
    let endDate = new Date(`2000, ${minMax[1].slice(0, 2)}, ${minMax[1].slice(2, 4)}`);
    let paddedEndDate = new Date(Date.parse(endDate) + 172800000)
    let curDate = startDate;
    while (curDate < paddedEndDate) {
        let tempDate = formatTime(curDate);
        chronologicObj[`${tempDate.month}/${tempDate.day} ${tempDate.time24Hr}`] = {}
        curDate = new Date(curDate.setHours(curDate.getHours() + intervalDuration))
    }
    return (chronologicObj)
}



// take our empty object with chornologically ordered timestamps (arg1) and populate each time stamp with yearly production from our production data (arg2)
// each year should have an array as a value with the first value being the amount produced in the given time period, and the second being the running YTD total
// ex April 01 12:00 : { 2018: [production in time period, running total], 2019: [production in time period: running total] etc}
function populateChronologicObject(emptyChronologicObj, sourceData) {
    let timeStamps = Object.keys(emptyChronologicObj);  //array of our time stamps to cycle through
    for (let sourceIndex = 0; sourceIndex < sourceData.length; sourceIndex++) { //cycling through our source data year by year
        let currentYearData = sourceData[sourceIndex];
        let currentYear = currentYearData[0].barrel_id.slice(0, 4);
        let periodTotal = 0;
        let ytdTotal = 0;
        //cycle through timestamps one by one
        //for each time stamp, check if there are production records younger or the same age as it, but older than the previous timestamp
        //if so add them up, update the period total and YTD total, then move on to the next timestamp.  
        //if not skip to the next timestamp and check again
        //keep track of the most recently added production record index
        let currentProductionRecordIndex = 0;
        let currentProductionRecord = currentYearData[currentProductionRecordIndex];
        let currentProductionDate = new Date(currentProductionRecord.barrel_id).setFullYear(2000)
        let currentTimeStampIndex = 0;
        let currentTimeStamp = timeStamps[currentTimeStampIndex]
        let currentTimeStampDate = new Date(currentTimeStamp).setFullYear(2000)
        while (currentTimeStampIndex < timeStamps.length) {
            while (currentProductionDate > currentTimeStampDate && currentTimeStampIndex < timeStamps.length) {
                emptyChronologicObj[timeStamps[currentTimeStampIndex]] = { ...emptyChronologicObj[timeStamps[currentTimeStampIndex]], [currentYear]: [periodTotal, ytdTotal] }
                currentTimeStampIndex++
                currentTimeStamp = timeStamps[currentTimeStampIndex]
                currentTimeStampDate = new Date(currentTimeStamp).setFullYear(2000)
            }
            while (currentProductionDate <= currentTimeStampDate && currentProductionRecordIndex < currentYearData.length) {
                periodTotal += currentProductionRecord.gallons;
                ytdTotal += currentProductionRecord.gallons;
                currentProductionRecordIndex++
                if (currentProductionRecordIndex < currentYearData.length - 1) {
                    currentProductionRecord = currentYearData[currentProductionRecordIndex];
                    currentProductionDate = new Date(currentProductionRecord.barrel_id).setFullYear(2000)
                }
            }
            emptyChronologicObj[timeStamps[currentTimeStampIndex]] = { ...emptyChronologicObj[timeStamps[currentTimeStampIndex]], [currentYear]: [periodTotal, ytdTotal] }
            periodTotal = 0;
            currentTimeStampIndex++
        }
    }
}

//find record index based on input date
function findRecordIndexByDate(dataToMatchDates, comparisonDate) {
    let dataToMatchDateKeys = Object.keys(dataToMatchDates);
    let indexOfMatchedDate = dataToMatchDateKeys.findIndex(date => {
        let myDate = new Date(date)
        myDate.setFullYear('2000')
        comparisonDate.setFullYear('2000')
        return myDate > comparisonDate
    })
    return indexOfMatchedDate > 0 ? indexOfMatchedDate - 1 : Object.keys(dataToMatchDateKeys).length - 1;
}


export default function Production({ productionData }) {
    //set state variables
    const [dataDivs, setDataDivs] = useState([]);
    const [currentDate, setCurrentDate] = useState(formatTime(new Date()))
    // build the empty object of data sorted by set interval time periods and populate with production data pulled from the db and passed in as a prop 
    const [sortedOrderedData, setSortedOrderedData] = useState(buildEmptyChronologicObject(findStartAndFinishDates(productionData)))
    useEffect(() => populateChronologicObject(sortedOrderedData, productionData), [])
    const [currentRecordIndex, setCurrentRecordIndex] = useState(findRecordIndexByDate(sortedOrderedData, currentDate.inputTime));
    let currentRecordsDate = Object.keys(sortedOrderedData)[currentRecordIndex];
    let formattedRecordsDate = currentRecordsDate.split('')
    formattedRecordsDate.splice(5, 0, '/2000')
    formattedRecordsDate = formattedRecordsDate.join('')

    useEffect(() => {
        function makeDataDivs() {
            let tempArray = [];
            currentRecordsDate = Object.keys(sortedOrderedData)[currentRecordIndex];
            let currentRecords = sortedOrderedData[currentRecordsDate]
            for (let year in currentRecords) {
                tempArray.push(<div key={`${currentRecords[year]}-${year}`} className={production_styles.yearly_row}>
                    <h2>{year}</h2>
                    <div style={{ width: `calc(${currentRecords[year][1] / 18886 * 90}%)` }} className={production_styles.progress_bar}>
                        {currentRecords[year][1] === 0 ? '' : <p style={currentRecords[year][1] / 18886 > .1 ? { padding: '5px' } : { padding: '0px' }}>{currentRecords[year][1]}</p>}
                    </div>
                </div>)
            }
            setDataDivs(tempArray.reverse())
        }
        makeDataDivs()
    }, [currentRecordIndex])

    return (
        <>{formattedRecordsDate ?
            <>
                <h2 className={production_styles.primary_heading}>Yearly Production Timeline Comparison</h2>
                <p>Compare YTD production totals from back to 2018.  Adjust the slider to select the date to compare.  Broken down into 8 hour intervals.</p>
                <hr />
                <h3 className={production_styles.current_date_header}>Current Date & Time: {currentDate.date} @ {currentDate.time} {currentDate.amPm}</h3>
                <div className={production_styles.production_animation_container}>
                    <h4 className={production_styles.date_header}>YTD Produciton as of {`${formattedRecordsDate.slice(0, 5)} @ ${formatTime(new Date(formattedRecordsDate)).time} ${formatTime(new Date(formattedRecordsDate)).amPm}`}</h4>
                    <hr />
                    {dataDivs}
                </div>
                <input className={production_styles.date_slider} type="range" min="0" max={Object.keys(sortedOrderedData).length - 1} value={currentRecordIndex} onChange={(e) => setCurrentRecordIndex(Number(e.target.value))}></input>
                <div className={production_styles.time_control_button_container}>
                    <button disabled={!currentRecordIndex} onClick={(e) => setCurrentRecordIndex(prev => prev - 1)}>&#8678;</button>
                    <button disabled={currentRecordIndex === Object.keys(sortedOrderedData).length - 1} onClick={() => setCurrentRecordIndex(prev => prev + 1)}>&#8680;</button>
                </div>
            </>
            :
            <Loader />
        }
        </>
    )
}