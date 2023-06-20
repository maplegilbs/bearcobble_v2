//Libraries
import mysql from 'mysql2';
import { useEffect, useState } from 'react';
//Styles
import production_styles from '@/styles/production_page_styles.module.scss';
//Functions
import { formatTime } from '@/utils/formatDate';


//get all production data from db
export async function getServerSideProps(){
    let productionYears = [2023, 2022];
    let productionData = [];
    const pool = mysql.createPool({
        host: process.env.MYSQL_DB_HOST,
        user: process.env.MYSQL_DB_USER,
        password: process.env.MYSQL_DB_PASSWORD,
        database: process.env.MYSQL_DB_NAME
}).promise();
for(let i=0; i < productionYears.length; i++){
    let returnedResults = await pool.query(`select barrel_id, drum_number, gallons from production${productionYears[i]} order by barrel_id`);
    returnedResults = await JSON.parse(JSON.stringify(returnedResults[0]));
    productionData.push(returnedResults);
}
 return ({props: {productionData: productionData}})

}

//sort into object with dates (jan, 01 etc) an associated produciton totals
//build an object with dates as keys and object containing yearly info ex
// Jan 01 12:00 : { 2018: [production in time period, running total], 2019: [production in time period: running total] etc}

// take array of data and find the earliest and last dates
function findStartAndFinishDates(dataArray){
    let absoluteMinMax = [];
    let yearlyMinMax = [];
    dataArray.forEach(innerArray=> {
        let minDate = formatTime(new Date(innerArray[0].barrel_id))
        let minRelative = minDate.month+minDate.day;
        let maxDate = formatTime(new Date(innerArray[innerArray.length-1].barrel_id))
        let maxRelative = maxDate.month+maxDate.day;
        yearlyMinMax.push(minRelative)
        yearlyMinMax.push(maxRelative)
        yearlyMinMax.sort();
    });
    absoluteMinMax[0]=yearlyMinMax[0];
    absoluteMinMax[1]=yearlyMinMax[yearlyMinMax.length-1];
    return absoluteMinMax;
}

function buildEmptyChronologicObject(minMax){
    let chronologicObj ={};
    //format as MM-DD HH:MM
    let startDate =  new Date(`00/${minMax[0].slice(0,2)}/${minMax[0].slice(2,4)}`);
    let endDate =  new Date(`00/${minMax[1].slice(0,2)}/${minMax[1].slice(2,4)}`);
    let curDate = startDate;
    while(curDate < endDate){
        let tempDate = formatTime(curDate);
        chronologicObj[`${tempDate.month}/${tempDate.day} ${tempDate.time24Hr}`] = {}
        curDate = new Date(curDate.setHours(curDate.getHours()+8))
    }
    return(chronologicObj)
}


function populateChronologicObject(emptyChronologicObj, sourceData){
    let timeStamps = Object.keys(emptyChronologicObj);
    for(let sourceIndex = 0; sourceIndex < sourceData.length; sourceIndex++){
        let currentYearData = sourceData[sourceIndex]
        for(let dataIndex = 0; dataIndex < currentYearData.length; dataIndex++){
            let currentProductionRecord = currentYearData[dataIndex]
            let currentProductionDate = new Date(currentProductionRecord.barrel_id)
            let formattedProductionDate = new Date(currentProductionDate.setFullYear(2000));
            let foundIndex = timeStamps.findIndex(timeStamp => {
                let compareTimeStamp = new Date(timeStamp)
                compareTimeStamp.setFullYear(2000);
                return Date.parse(formattedProductionDate) < Date.parse(compareTimeStamp)
            })
            console.log(timeStamps[foundIndex])
            emptyChronologicObj[timeStamps[foundIndex]] = {test: 0}
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
    
    return records;
}

const records = makeProductionBars();

export default function Produciton({productionData}) {
    console.log(productionData)
    const[sortedOrderedData, setSortedOrderedData] = useState(buildEmptyChronologicObject( findStartAndFinishDates(productionData)))
    populateChronologicObject(sortedOrderedData, productionData)
    console.log(sortedOrderedData)

    const [advance, setadvance] = useState(0)
    const [currentRecordIndex, setCurrentRecordIndex] = useState(0);
    const [dataDivs, setDataDivs] = useState([]);

    useEffect(() => {
        function makeDataDivs() {
            setDataDivs([])
            let tempArray = [];
            let currentRecords = records[currentRecordIndex]
            for (let year in currentRecords) {
                tempArray.push(<div key={`${currentRecords[year]}-${year}`} className={production_styles.yearly_row}>
                    <h2>{year}</h2>
                    <div style={{ width: `${currentRecords[year] * 4}px` }} className={production_styles.progress_bar}></div>
                    <p>{currentRecords[year]}</p>
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
            <button onClick={()=>setadvance(prev => prev+1)}>Advance</button>
            <div className={production_styles.production_animation_container}>
                {dataDivs}
            </div>

        </>
    )
}