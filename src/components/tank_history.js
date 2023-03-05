//Libraries
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
//Components
import Section_History from './section_history_container.js'
const Line_Plot = dynamic(() => { return import("./plotly_tank_line_graph.js") }, { ssr: false })
//Functions
import { adjustForUTC } from '@/utils/adjForUTCDate.js';
import { remainingFillTime } from '@/utils/tankInfoHelpers.js';
//Styles
import tank_history_styles from './tank_history.module.scss'

function convertDateForSQL(inputDate) { return inputDate.toISOString().slice(0, 19).replace('T', ' ') }

export default function Tank_History() {
    const [historicalData, setHistoricalData] = useState([]);
    const [dateRange, setDateRange] = useState([convertDateForSQL(adjustForUTC(new Date(Date.now() - (4 * 60 * 60 * 1000)))), convertDateForSQL(adjustForUTC(new Date()))])

    useEffect(() => {
        try {
            async function getData() {
                let fetchedData = await fetch(`api/get_sensor_history?sensor_type=tank&period_start=${dateRange[0]}&period_end=${dateRange[1]}`);
                let fetchedJSON = await fetchedData.json();
                setHistoricalData(fetchedJSON[0])
            }
            getData();
        } catch (error) { console.error(`There was an error fetching historical tank data: ${error}`) }
    }, [dateRange])


    let tableData = [[], [], [], [], []];
    let timeRemaining = []
    for (let i = 0; i < historicalData.length - 1; i++) {
        for (let j = 1; j < 6; j++) {
            let currentData = historicalData[i];
            let priorData = historicalData[i + 1];
            let tankReading = Math.round(Number(currentData[`tank${j}Vol`]));
            console.log(currentData)
            let tankReadingTime = currentData[`tank${j}TimeFormatted`];
            let currentTime = currentData[`tank${j}Time`];
            let priorTime = priorData[`tank${j}Time`];
            let timeChange = (new Date(currentTime) - new Date(priorTime)) / (1000 * 60 * 60) //fraction of an hour
            let tankChange = (currentData[`tank${j}Vol`] - priorData[`tank${j}Vol`]); //
            let tankChangePerHour = Math.round(tankChange / timeChange);
            if(i===0) {timeRemaining.push(remainingFillTime(tankReading, tankChangePerHour))}
            if (tankReadingTime != priorData[`tank${j}TimeFormatted`]) {
                tableData[j - 1].push(
                    <tr>
                        <td>{tankReadingTime}</td>
                        <td>{tankReading}</td>
                        <td>{tankChangePerHour > 0 ? `+${tankChangePerHour}` : tankChangePerHour}</td>
                    </tr>
                )
            }
        }
    }


    return (
        <>
            <div className={tank_history_styles.tank_history_options}>
                <label htmlFor='history_select'>Select Range For Data Records</label>
                <select
                    className={tank_history_styles.tank_daterange_select}
                    id='history_select'
                    onChange={(e) => {
                        setDateRange([convertDateForSQL(adjustForUTC(new Date(Date.now() - (parseInt(e.target.value) * 60 * 60 * 1000)))), convertDateForSQL(adjustForUTC(new Date()))])
                    }}>
                    <option value='4'>Prior 4 hrs</option>
                    <option value='12'>Prior 12 hrs</option>
                    <option value='24'>Prior 1 day</option>
                    <option value='48'>Prior 2 days</option>
                    <option value='168'>Prior 1 week</option>
                </select>
            </div>
            <div className={tank_history_styles.plotly_container}>
                <Line_Plot graph_data={historicalData} />
            </div>
            <div className={tank_history_styles.tank_history_container}>
                <Section_History type={'Tank'} section_num={5} tableData={tableData[4]} timeRemaining={timeRemaining[4]} />
                <Section_History type={'Tank'} section_num={4} tableData={tableData[3]} timeRemaining={timeRemaining[3]}/>
                <Section_History type={'Tank'} section_num={3} tableData={tableData[2]} timeRemaining={timeRemaining[2]}/>
                <Section_History type={'Tank'} section_num={2} tableData={tableData[1]} timeRemaining={timeRemaining[1]}/>
                <Section_History type={'Tank'} section_num={1} tableData={tableData[0]} timeRemaining={timeRemaining[0]}/>
            </div>
        </>
    )

}