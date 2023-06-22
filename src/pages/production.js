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
    let productionYears = [2023, 2022];
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
        let minRelative = minDate.month + minDate.day;
        let maxDate = formatTime(new Date(innerArray[innerArray.length - 1].barrel_id))
        let maxRelative = maxDate.month + maxDate.day;
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
    let startDate = new Date(`00/${minMax[0].slice(0, 2)}/${minMax[0].slice(2, 4)}`);
    let endDate = new Date(`00/${minMax[1].slice(0, 2)}/${minMax[1].slice(2, 4)}`);
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
                if(currentProductionRecordIndex<currentYearData.length-1){
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

function makeProductionBars() {
    let years = [[2023, 0], [2022, 0], [2021, 0], [2020, 0], [2019, 0], [2018, 0]];
    let records = {};

    for (let i = 0; i < 10; i++) {
        records[i] = {};
        years.forEach(year => {
            records[i][year[0]] = year[1]
            year[1] = Math.round(Math.random() * 10) + year[1]
        })
    }
    console.log('records, ', records)
    return records;
}

const records = makeProductionBars();

export default function Produciton({ productionData }) {
    // console.log(productionData)
    const [sortedOrderedData, setSortedOrderedData] = useState(buildEmptyChronologicObject(findStartAndFinishDates(productionData)))
    populateChronologicObject(sortedOrderedData, productionData)
    console.log(sortedOrderedData)

    const [advance, setadvance] = useState(0)
    const [currentRecordIndex, setCurrentRecordIndex] = useState(0);
    const [dataDivs, setDataDivs] = useState([]);

    useEffect(() => {
        function makeDataDivs() {
            setDataDivs([])
            let tempArray = [];
            // let currentRecords = records[currentRecordIndex]
            let currentRecords = sortedOrderedData[Object.keys(sortedOrderedData)[currentRecordIndex]]
            console.log(currentRecordIndex)
            for (let year in currentRecords) {
                console.log(year)
                tempArray.push(<div key={`${currentRecords[year]}-${year}`} className={production_styles.yearly_row}>
                    <h2>{year}</h2>
                    <div style={{ width: `${currentRecords[year][1]/18886*100}%` }} className={production_styles.progress_bar}></div>
                    <p>{currentRecords[year][1]}</p>
                </div>)
            }
            setDataDivs(tempArray.reverse())
            setCurrentRecordIndex(prev => {
                return prev + 1
            });

        }
        makeDataDivs()
    }, [advance])



    return (
        <>
            <button onClick={() => setadvance(prev => prev + 1)}>Advance</button>
            <p>Date{sortedOrderedData[currentRecordIndex]}</p>
            <div className={production_styles.production_animation_container}>
                {dataDivs}
            </div>

        </>
    )
}