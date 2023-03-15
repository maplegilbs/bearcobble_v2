//Libraries
import dynamic from 'next/dynamic';
import { useRef } from 'react';

const Plot = dynamic(() => { return import("react-plotly.js") }, { ssr: false })

export default function Vac_line_Graph({ graph_data }) {
    const windowSize = useRef([window.innerWidth, window.innerHeight]);

    let plotPoints = [
        [[], []], //section 1
        [[], []], //section 2
        [[], []], //section 3
        [[], []], //section 4
        [[], []]  //section 5
    ]


    for (let i = 0; i < graph_data.length - 1; i++) { //for every record in our retrieved data
        for (let j = 0; j < 5; j++) { //cycle through 5 times to get the data from each system (1 - 5)
            let currentData = graph_data[i];
            let readingTime = currentData['dbEntryTime']
            let vacReading = Number(currentData[`vac${j + 1}`]).toFixed(1);
            if (vacReading && readingTime) {
                plotPoints[j][0].push(readingTime)
                plotPoints[j][1].push(vacReading)
            }
        }
    }

    return (
        <Plot data={[
            {
                x: plotPoints[0][0].reverse(),
                y: plotPoints[0][1].reverse(),
                type: 'line',
                mode: 'lines',
                line: { color: 'blue', shape: 'spline' },
                name: '1'
            },
            {
                x: plotPoints[1][0].reverse(),
                y: plotPoints[1][1].reverse(),
                type: 'line',
                mode: 'lines',
                line: { color: 'orange', shape: 'spline' },
                name: '2'
            },
            {
                x: plotPoints[2][0].reverse(),
                y: plotPoints[2][1].reverse(),
                type: 'line',
                mode: 'lines',
                line: { color: 'gold', shape: 'spline' },
                name: '3'
            },
            {
                x: plotPoints[3][0].reverse(),
                y: plotPoints[3][1].reverse(),
                type: 'line',
                mode: 'lines',
                line: { color: 'gold', shape: 'spline', dash: 'dash' },
                name: '4'
            },
            {
                x: plotPoints[4][0].reverse(),
                y: plotPoints[4][1].reverse(),
                type: 'line',
                mode: 'lines',
                line: { color: 'green', shape: 'spline' },
                name: '5'
            },

        ]}

            layout={{
                margin: {
                    l: 40,
                    r: 40,
                },
                xaxis: {
                    automargin: true,
                    tickangle: windowSize.current[0] < 720 ? 75 : 'auto'
                },
                width: windowSize.current[0] * .85,
                autosize: false,
                title: {
                    text: 'Vacuum History',
                    font: { family: 'Overpass' }
                },
                showlegend: true,
                legend: {
                    xanchor: "center",
                    yanchor: "top",
                    y: -0.5,
                    x: 0.5,
                    "orientation": "h"
                }
            }}

            config={{ responsive: true, displayModeBar: false, staticplot: true, scrollzoom: false }}
        />
    )
}