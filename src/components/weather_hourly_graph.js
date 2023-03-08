function buildGraph(inputShapes) {
    //declare empty array for plot data to be pushed to for display on the graph
    let graphData = [];

    //lines for 10 degrees and 32 degrees
    let lines = [
        {
            type: 'line',
            xref: 'paper',
            x0: 0,
            x1: 1,
            yref: 'y',
            y0: 32,
            y1: 32,
            line: {
                dash: 'dash',
                color: 'rgba(75,75,275,.5)',
                width: 1
            }
        },
        {
            type: 'line',
            xref: 'paper',
            x0: 0,
            x1: 1,
            yref: 'y',
            y0: 10,
            y1: 10,
            line: {
                dash: 'dash',
                color: 'rgba(75,75,275,.5)',
                width: 1
            }
        }
    ];

    //add the rectangles to show night
    let graphShapes = lines.concat(inputShapes)

    if (noaaGraphValues !== null) {
        let noaaPlot = {
            x: xAxisTimeStampArrayFormatted,
            y: noaaGraphValues,
            name: "NOAA",
            type: 'scatter',
            line: {
                color: 'rgb(255,75,75)',
                width: 2.5
            }
        }
        graphData.push(noaaPlot)
    }

    if (oWMGraphValues !== null) {
        let owmPlot = {
            x: xAxisTimeStampArrayFormatted,
            y: oWMGraphValues,
            name: "Open Weather",
            type: 'scatter',
            line: {
                color: 'rgb(0,205,0)',
                width: 2.5
            }
        }
        graphData.push(owmPlot)
    }

    if (tmrwIOGraphValues !== null) {
        let tmrwIOPlot = {
            x: xAxisTimeStampArrayFormatted,
            y: tmrwIOGraphValues,
            name: "Tomorrow.IO",
            type: 'scatter',
            line: {
                color: 'rgb(255,215,0,)',
                width: 2.5
            }
        }
        graphData.push(tmrwIOPlot);
    }

    let layout = {
        title: 'Hourly Temperature Forecast',
        margin: {
            l: 50,
            r: 40,
            b: 30,
        },
        legend: {
            y: -.75,
            "orientation": "h"
        },
        shapes: graphShapes
    }

    let options = {
        responsive: true,
        displayModeBar: false,
        staticplot: true
    }

    Plotly.newPlot('hourlyGraph', graphData, layout, options)
}