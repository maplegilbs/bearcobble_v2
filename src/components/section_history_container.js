//Libraries
import { useEffect, useState } from "react";

function convertDateForSQL(inputDate){return inputDate.toISOString().slice(0, 19).replace('T', ' ')}

export default function Section_History ({section_num}){
    const [historicalData, setHistoricalData] = useState([]);
    const [dateRange, setDateRange] = useState([convertDateForSQL(new Date(Date.now()-(90*60*60*1000))), convertDateForSQL(new Date())])

    useEffect(()=>{
        try {
            console.log(dateRange)
            async function getData(){
                let fetchedData = await fetch(`api/get_sensor_history?sensor_type=vacuum&period_start=${dateRange[0]}&period_end=${dateRange[1]}`);
                let fetchedJSON = await fetchedData.json();
                setHistoricalData(fetchedJSON[0])
                console.log(fetchedJSON);
            }
            getData();
            
        } catch (error) {
            
        }
    },[])



    const tableData = [];
    for(let i=0; i<historicalData.length-1; i++){
        let currentData = historicalData[i];
        let priorData = historicalData[i+1];
        tableData.push (
            <tr>
                <td>{currentData[`dbEntryTime`]}</td><td>{Number(currentData[`vac${section_num}`]).toFixed(1)}</td><td>{(currentData[`vac${section_num}`]-priorData[`vac${section_num}`]).toFixed(1)}</td>
            </tr>
        )
    }


    return (
    <>
    <h3>Section</h3>
    <table>
        <thead>
            <tr><th>Time</th><th>in Hg</th><th>Change</th></tr>
            {tableData}
        </thead>
    </table>
    </>
    )
}