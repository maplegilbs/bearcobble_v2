//Components
import Loader from '@/components/loader';
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
    let productionYears = [2024, 2023, 2022, 2021, 2020, 2019, 2018];
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

function adjustDateForIOS(date) {
    let year = date.slice(0, 4);
    let monthIndex = date.slice(5, 7) - 1;
    let day = date.slice(8, 10)
    let hours = date.slice(11, 13)
    let minutes = date.slice(14, 16)
    // console.log(`${year}, ${monthIndex}, ${day}, ${hours}, ${minutes}`)
    return {
        year,
        monthIndex,
        day,
        hours,
        minutes
    }
}


//find startAndEndDates
function findStartAndFinishDates(dataArray) {
    let minArray = [];
    let maxArray = [];
    dataArray.forEach(innerArray => {
        let iosMinDate = adjustDateForIOS(innerArray[0].barrel_id)
        let min = formatTime(new Date(iosMinDate.year, iosMinDate.monthIndex, iosMinDate.day, iosMinDate.hours, iosMinDate.minutes))
        let iosMaxDate = adjustDateForIOS(innerArray[innerArray.length - 1].barrel_id)
        let max = formatTime(new Date(iosMaxDate.year, iosMaxDate.monthIndex, iosMaxDate.day, iosMaxDate.hours, iosMaxDate.minutes))
        minArray.push(min)
        maxArray.push(max)
    })
    minArray.filter(date=> date.month > 5)
    minArray.sort();
    maxArray.sort();
    let minMaxArray = [minArray[0].month.toString().concat(minArray[0].day), maxArray[maxArray.length-1].month.toString().concat(maxArray[maxArray.length-1].day)]
    return minMaxArray
}


//Build an empty object with keys containing date + times, incrementing by 8 hour intervals (or whatever amount we want to adjust by)
//The first and last date/time will be dictated by the minMax array arguement minMax[0] being our start date & time minMax[1] being our end date and time
//This object will be later populated by the production data.
function buildEmptyChronologicObject(minMax) {
    let chronologicObj = {};
    let intervalDuration = 8;
    //format as MM-DD HH:MM - formatting the year to be 00 or 2000 so we can compare all years based on month and day
    let startDate = new Date(`2000-${minMax[0].slice(0, 2)}-${minMax[0].slice(2, 4)}`);
    let endDate = new Date(`2001-${minMax[1].slice(0, 2)}-${minMax[1].slice(2, 4)}`);
    let paddedEndDate = new Date(Date.parse(endDate) + 172800000)
    let curDate = startDate;
    while (curDate < paddedEndDate) {
        let tempDate = formatTime(curDate);
        chronologicObj[`${tempDate.year}/${tempDate.month}/${tempDate.day} ${tempDate.time24Hr}`] = {}
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
        let currentYear = currentYearData[currentYearData.length - 1].barrel_id.slice(0, 4);
        let periodTotal = 0;
        let ytdTotal = 0;
        //cycle through timestamps one by one
        //for each time stamp, check if there are production records younger or the same age as it, but older than the previous timestamp
        //if so add them up, update the period total and YTD total, then move on to the next timestamp.  
        //if not skip to the next timestamp and check again
        //keep track of the most recently added production record index
        let currentProductionRecordIndex = 0;
        let currentProductionRecord = currentYearData[currentProductionRecordIndex];
        let iosProdDate = adjustDateForIOS(currentProductionRecord.barrel_id);
        let currentProductionYear = Number(currentProductionRecord.barrel_id.slice(5, 7)) > 5 ? '2000' : '2001';
        let currentProductionDate = new Date(iosProdDate.year, iosProdDate.monthIndex, iosProdDate.day, iosProdDate.hours, iosProdDate.minutes).setFullYear(currentProductionYear)
        let currentTimeStampIndex = 0;
        let currentTimeStamp = timeStamps[currentTimeStampIndex]
        let currentTimeStampDate = new Date(`2000-${currentTimeStamp.slice(5, 7)}-${currentTimeStamp.slice(8, 10)}`)
        while (currentTimeStampIndex < timeStamps.length) {
            //if the production record is greater than the current time stamp, update the time stamp index and check again
            while (currentProductionDate > currentTimeStampDate && currentTimeStampIndex < timeStamps.length) {
                emptyChronologicObj[timeStamps[currentTimeStampIndex]] = { ...emptyChronologicObj[timeStamps[currentTimeStampIndex]], [currentYear]: [periodTotal, ytdTotal] }
                currentTimeStampIndex++
                currentTimeStamp = timeStamps[currentTimeStampIndex]
                currentTimeStampDate = new Date(`${currentTimeStamp.slice(0, 4)}-${currentTimeStamp.slice(5, 7)}-${currentTimeStamp.slice(8, 10)}`)
            }
            while (currentProductionDate <= currentTimeStampDate && currentProductionRecordIndex < currentYearData.length) {
                periodTotal += currentProductionRecord.gallons;
                ytdTotal += currentProductionRecord.gallons;
                currentProductionRecordIndex++
                if (currentProductionRecordIndex < currentYearData.length - 1) {
                    currentProductionRecord = currentYearData[currentProductionRecordIndex];
                    let adjYear = Number(currentProductionRecord.barrel_id.slice(5, 7)) > 5 ? '2000' : '2001';
                    currentProductionDate = new Date(`${adjYear}-${currentProductionRecord.barrel_id.slice(5, 7)}-${currentProductionRecord.barrel_id.slice(8, 10)}T${currentProductionRecord.barrel_id.slice(11, 13)}:${currentProductionRecord.barrel_id.slice(14, 16)}`)
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
        formatTime(comparisonDate).month >= 5 ? comparisonDate.setFullYear('2000') : comparisonDate.setFullYear('2001');
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
    let formattedRecordsDate = null;
    if (sortedOrderedData && currentRecordIndex !== 'undefined') { formattedRecordsDate = currentRecordsDate.substring(5, 10) }
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
                    <h4 className={production_styles.date_header}>YTD Produciton as of {`${formattedRecordsDate.slice(0)} @ ${formatTime(new Date(currentRecordsDate)).time} ${formatTime(new Date(currentRecordsDate)).amPm}`}</h4>
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