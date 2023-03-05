//Libraries
import dynamic from 'next/dynamic';
import { useRef } from 'react';

const Plot = dynamic(() => { return import("react-plotly.js") }, { ssr: false })

export default function ({ graph_data }) {
    const windowSize = useRef([window.innerWidth, window.innerHeight]);

    console.log('Graph data', graph_data)

    let plotPoints = [
        [[], []],
        [[], []],
        [[], []],
        [[], []],
        [[], []]
    ]


    for (let i = 0; i < graph_data.length - 1; i++) {
        for (let j = 0; j < 5; j++) {
            let currentData = graph_data[i];
            let priorData = graph_data[i + 1];
            let readingTime = currentData['dbEntryTime']
            let vacReading = Number(currentData[`vac${j + 1}`]).toFixed(1);
            if (vacReading && readingTime) {
                plotPoints[j][0].push(readingTime)
                plotPoints[j][1].push(vacReading)
            }
        }
    }

    console.log(plotPoints)
    return (
        <Plot data={[
            {
                x: plotPoints[0][0].reverse(),
                y: plotPoints[0][1].reverse(),
                type: 'scatter',
                mode: 'lines',
                line: { color: 'blue' },
                name: '1'
            },
            {
                x: plotPoints[1][0].reverse(),
                y: plotPoints[1][1].reverse(),
                type: 'scatter',
                mode: 'lines',
                line: { color: 'orange' },
                name: '2'
            },
            {
                x: plotPoints[2][0].reverse(),
                y: plotPoints[2][1].reverse(),
                type: 'scatter',
                mode: 'lines',
                line: { color: 'gold' },
                name: '3'
            },
            {
                x: plotPoints[3][0].reverse(),
                y: plotPoints[3][1].reverse(),
                type: 'scatter',
                mode: 'lines',
                line: { color: 'gold', dash: 'dash' },
                name: '4'
            },
            {
                x: plotPoints[4][0].reverse(),
                y: plotPoints[4][1].reverse(),
                type: 'scatter',
                mode: 'lines',
                line: { color: 'green' },
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
                    tickangle: windowSize.current[0] < 720? 75: 0
                },
                width: windowSize.current[0]*.85,
                autosize: false,
                title: 'Vacuum History',
                showlegend: true,
                legend: {
                    y: 1.25,
                    "orientation": "h"
                  }
            }}

            config={{ responsive: true, displayModeBar: false, staticplot: true, scrollzoom: false }}
        />
    )
}