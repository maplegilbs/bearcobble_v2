//Libraries
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
//Components
const Plot = dynamic(()=>{return import("react-plotly.js")}, {ssr: false});
//Functions
import { formatTime } from "@/utils/formatDate";


export default function Comparison_Bar_Graph({graph_data}){
    const [windowSize, setWindowSize] = useState()

    useEffect(()=>{
    setWindowSize([window.innerWidth, window.innerHeight]);
    },[])
    
    let xAxis = ['Conc', 'Mem 1', 'Mem 2', 'Mem 3', 'Mem 4', 'Mem 5', 'Mem 6', 'Mem 7', 'Mem 8']
    
    // console.log(graph_data[0])
    if(graph_data.length > 1){
        let record1Date = formatTime(new Date(graph_data[0].record_date))
        let record1DateFormatted = `${record1Date.date}/${record1Date.year} @ ${record1Date.time}`
        let record2Date = formatTime(new Date(graph_data[1].record_date))
        let record2DateFormatted = `${record2Date.date}/${record2Date.year} @ ${record2Date.time}`
        return (
            <Plot 
            data={[
                {
                    x: xAxis,
                    y:[graph_data[0].conc_flow, graph_data[0].membrane_1, graph_data[0].membrane_2, graph_data[0].membrane_3, graph_data[0].membrane_4, graph_data[0].membrane_5, graph_data[0].membrane_6, graph_data[0].membrane_7, graph_data[0].membrane_8],
                    type: 'bar',
                    name: `#${graph_data[0].selected_ro.slice(2)} ${record1DateFormatted}`,
                    marker: {
                        color: 'rgba(10,180,40,.85)'
                    }
                },
                {
                    x: xAxis,
                    y:[graph_data[1].conc_flow, graph_data[1].membrane_1, graph_data[1].membrane_2, graph_data[1].membrane_3, graph_data[1].membrane_4, graph_data[1].membrane_5, graph_data[1].membrane_6, graph_data[1].membrane_7, graph_data[1].membrane_8],
                    type: 'bar',
                    name: `#${graph_data[1].selected_ro.slice(2)} ${record2DateFormatted}`,
                    marker: {
                        color: 'rgba(40,70,240,.85)'
                    }
                }
            ]}
            layout={{
                margin: {
                    l: 40,
                    r: 40
                },
                xaxis: {
                    automargin: true,
                    tickangle: windowSize[0] < 720 ? 75 : 'auto'
                },
                width: windowSize[0]*.85,
                autosize: false,
                title: {
                    text: 'RO Performance Comparison',
                    font: {family: 'Overpass'}
                },
                showlegend: true,
                legend: {
                    xanchor: "center",
                    yanchor: "top",
                    y: windowSize[0]< 720? -0.5: -0.15,
                    x: 0.5,
                    "orientation": "h"
                }
            }} 

            config={{responsive: true, displayModeBar: false, staticPlot: true, scrollZoom: false}}
            />
        )
    }
    else return <></>
}