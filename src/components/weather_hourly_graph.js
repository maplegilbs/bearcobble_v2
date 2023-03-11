//Libraries
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from "react"
//Functions
import { compileGraphData } from "@/utils/hourlyGraphHelpers"

const Plot = dynamic(() => { return import("react-plotly.js") }, { ssr: false })


//build rectangular 'shapes' to represent nighttime on the hourly graph.  times between 7pm and 7am will have a light grey background
//take in the array from the x axis (timestamps) and build individual arrays of consecutive timestamps between those hours.  so we will have something like this [[Tue 7pm, Tue 8pm ..... Wed 7am], [Wed 7pm, Wed 8pm ..... Thur 7am]] 
//then take the first and last item of each individual array and use that to build a new object to make a 'shape' object in the layout settings of plotly
function buildShapes(inputAxisArray, dateFormatter) {
    console.log(inputAxisArray)
    let rectStartEndArray = [];
    let nightArray = [];
    for (let i = 0; i < inputAxisArray.length; i++) {
        let curHour = inputAxisArray[i].getHours();
        //if current timestamp is between 7pm and 7am push into an array
        if (curHour >= 19 || curHour <= 7) {
            nightArray.push(inputAxisArray[i])
        }
        //if current timestamp is not within 7pm to 7am, or is the last timestamp from the input array.  and the night array already has at least 2 values, push the whole night array to the rectangle shape array and then clear the night array
        if ((curHour === 8 || i === inputAxisArray.length - 1) && nightArray.length > 1) {
            rectStartEndArray.push(nightArray);
            nightArray = [];
        }
        else if (curHour === 8 && nightArray.length < 2) {
            nightArray = [];
        }
    }
    let shapesArray = rectStartEndArray.map(innerArray => {
        let xStart = dateFormatter(innerArray[0], false);
        let xEnd = dateFormatter(innerArray[innerArray.length - 1], false);
        let objToReturn = {
            type: 'rect',
            yref: 'paper',
            y0: 0,
            y1: 1,
            line: { width: 0 },
            fillcolor: '#333333',
            opacity: .2,
            xref: 'x',
            x0: xStart,
            x1: xEnd
        }
        return objToReturn;
    })
    shapesArray.push(
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
        })
    return shapesArray;
}



function buildGraph({timeAxisFormatted, noaaHourlyTemps, oWMHourlyTemps, tmrwIOHourlyTemps}) {
    console.log(arguments)
    //declare empty array for plot data to be pushed to for display on the graph
    let graphData = [];


    if (noaaHourlyTemps.length > 0) {
        let noaaPlot = {
            x: timeAxisFormatted,
            y: noaaHourlyTemps,
            name: "NOAA",
            type: 'scatter',
            line: {
                color: 'rgb(255,75,75)',
                width: 2.5
            }
        }
        graphData.push(noaaPlot)
    }

    if (oWMHourlyTemps.length > 0 ) {
        let owmPlot = {
            x: timeAxisFormatted,
            y: oWMHourlyTemps,
            name: "Open Weather",
            type: 'scatter',
            line: {
                color: 'rgb(0,205,0)',
                width: 2.5
            }
        }
        graphData.push(owmPlot)
    }

    if (tmrwIOHourlyTemps.length > 0) {
        let tmrwIOPlot = {
            x: timeAxisFormatted,
            y: tmrwIOHourlyTemps,
            name: "Tomorrow.IO",
            type: 'scatter',
            line: {
                color: 'rgb(255,215,0,)',
                width: 2.5
            }
        }
        graphData.push(tmrwIOPlot);
    }

    return graphData;
}



export default function Weather_Forecast_Hourly_Graph () {
    const windowSize = useRef([window.innerWidth, window.innerHeight]);
    const [graphData, setGraphData] = useState(null);
    const [plots, setPlots] = useState([])
    const [shapes, setShapes] = useState([])

    useEffect(() => {
        async function populateGraphData() {
            let data = await compileGraphData()
            setGraphData(data)
        }
        populateGraphData();
    }, [])

    useEffect(()=>{
        if(graphData && graphData.hasOwnProperty('timeAxis')){
            setShapes(buildShapes(graphData.timeAxis, graphData.formatDate))
            setPlots(buildGraph({...graphData}));
        }

    },[graphData])




    console.log(shapes)
    return (
        <>
        <Plot data={plots}

        layout = {{
            title: 'Hourly Temperature Forecast',
            // margin: {
            //     l: 50,
            //     r: 40,
            //     b: 30,
            // },
            margin: {
                l: 40,
                r: 40,
            },
            xaxis: {
                automargin: true,
                tickangle: windowSize.current[0] < 720 ? 75 : 'auto'
            },
            width: windowSize.current[0] * .75,
            autosize: false,
            legend: {
                y: -.75,
                "orientation": "h"
            },
            shapes: shapes
        }}
    
        config={{ responsive: true, displayModeBar: false, staticplot: true, scrollzoom: false }}
        />
        </>
    )
}




