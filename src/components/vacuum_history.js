//Libraries
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
//Components
import Section_History from './section_history_container.js'
const Line_Plot = dynamic(()=> {return import ("./plotly_line_graph.js")}, {ssr: false})
//Functions
import { adjustForUTC } from '@/utils/adjForUTCDate.js';
//Styles
import vac_history_styles from './vacuum_history.module.scss'

function convertDateForSQL(inputDate) { return inputDate.toISOString().slice(0, 19).replace('T', ' ') }

export default function Vacuum_History() {
    const [historicalData, setHistoricalData] = useState([]);
    const [dateRange, setDateRange] = useState([convertDateForSQL(adjustForUTC(new Date(Date.now() - (4 * 60 * 60 * 1000)))), convertDateForSQL(adjustForUTC(new Date()))])

    useEffect(() => {
        try {
            async function getData() {
                let fetchedData = await fetch(`api/get_sensor_history?sensor_type=vacuum&period_start=${dateRange[0]}&period_end=${dateRange[1]}`);
                let fetchedJSON = await fetchedData.json();
                setHistoricalData(fetchedJSON[0])
            }
            getData();
        } catch (error) { console.error(`There was an error fetching historical vacuum data: ${error}`) }
    }, [dateRange])



    const tableData = [[], [], [], [], []];
    for (let i = 0; i < historicalData.length - 1; i++) {
        for (let j = 0; j < 5; j++) {
            let currentData = historicalData[i];
            let priorData = historicalData[i + 1];
            let vacReading = Number(currentData[`vac${j + 1}`]).toFixed(1);
            let vacChange = (currentData[`vac${j + 1}`] - priorData[`vac${j + 1}`]).toFixed(1);
            tableData[j].push(
                <tr>
                    <td>{currentData[`dbEntryTime`]}</td>
                    <td>{vacReading}</td>
                    <td style={{ backgroundColor: vacChange > 0 ? 'rgba(120,255,120,.25)' : vacChange < 0 ? 'rgba(255,120,120,.25)' : '', fontWeight: vacChange != 0 ? '600' : '400' }}>{vacChange > 0 ? `+${vacChange}` : `${vacChange}`}</td>
                </tr>
            )
        }
    }


    return (
        <>
            <div className={vac_history_styles.vac_history_options}>
                <label htmlFor='history_select'>Select Range For Data Records</label>
                <select className={vac_history_styles.vac_daterange_select} id='history_select' onChange={(e) => {
                    setDateRange([convertDateForSQL(adjustForUTC(new Date(Date.now() - (parseInt(e.target.value) * 60 * 60 * 1000)))), convertDateForSQL(adjustForUTC(new Date()))])
                    console.log(dateRange)
                }}>
                    <option value='4'>Prior 4 hrs</option>
                    <option value='12'>Prior 12 hrs</option>
                    <option value='24'>Prior 1 day</option>
                    <option value='48'>Prior 2 days</option>
                    <option value='168'>Prior 1 week</option>
                </select>
            </div>
            <div className={vac_history_styles.plotly_container}>
                <Line_Plot />
            </div>
            <div className={vac_history_styles.vac_history_container}>
                <Section_History section_num={1} tableData={tableData[0]} />
                <Section_History section_num={2} tableData={tableData[1]} />
                <Section_History section_num={3} tableData={tableData[2]} />
                <Section_History section_num={4} tableData={tableData[3]} />
                <Section_History section_num={5} tableData={tableData[4]} />
            </div>
        </>
    )

}