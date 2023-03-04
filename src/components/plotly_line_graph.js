//Libraries
import dynamic from 'next/dynamic';

const Plot = dynamic(()=> {return import ("react-plotly.js")}, {ssr: false})

export default function () {
    return (
        <Plot data={[
            {
                x: [1, 2, 3],
                y: [2, 6, 3],
                type: 'scatter',
                mode: 'lines',
                marker: { color: 'red' },
                name: 'coolline'
            },
        ]}

        layout = {{
            margin: {
              l: 50,
              r: 40,
              pad: 4
            },
            title: 'Vacuum History',
            showlegend: true,
            legend: {
              y: -.25,
              "orientation": "h"
            }
          }}
        
            config={{responsive: true}}
        />
    )
}