//Functions
import { formatTime } from '@/utils/formatDate';
//Styles
import comparison_table_styles from './ro_records_compare_table.module.scss';

function populateMembraneRows(records) {
    let membraneRows = []
    if (records.length > 0) {
        let i = 1;
        while (i < 9) {
            membraneRows.push(
                <tr>
                    <td>Membrane {i} (gpm)</td>
                    <td>{records[0][`membrane_${i}`]}</td>
                    <td>{records[1][`membrane_${i}`]}</td>
                    <td>{records[1][`membrane_${i}`] - records[0][`membrane_${i}`] > 0 ?
                        `+${records[1][`membrane_${i}`] - records[0][`membrane_${i}`]}` :
                        `${records[1][`membrane_${i}`] - records[0][`membrane_${i}`]}`
                    }</td>
                    <td>{
                        ((records[1][`membrane_${i}`] - records[0][`membrane_${i}`]) / records[0][`membrane_${i}`] * 100).toFixed(0) > 0 ?
                            `+${((records[1][`membrane_${i}`] - records[0][`membrane_${i}`]) / records[0][`membrane_${i}`] * 100).toFixed(0)}` :
                            `${((records[1][`membrane_${i}`] - records[0][`membrane_${i}`]) / records[0][`membrane_${i}`] * 100).toFixed(0)}`
                    }%
                    </td>

                </tr>
            )
            i++;
        }
    }
    return (membraneRows)

}


export default function Records_Comparison_Table({ comparisonRecords }) {

    if (comparisonRecords.length > 1) {
        let record1Date = formatTime(new Date(comparisonRecords[0].record_date))
        let record1DateFormatted = `${record1Date.date}/${record1Date.year} @ ${record1Date.time}`
        let record2Date = formatTime(new Date(comparisonRecords[1].record_date))
        let record2DateFormatted = `${record2Date.date}/${record2Date.year} @ ${record2Date.time}`
        return (
            <div className={comparison_table_styles.comparison_table_container}>
                <table className={comparison_table_styles.comparison_table}>
                    <thead>
                        <tr>
                            <th>Cateogry</th>
                            <th>{`#${comparisonRecords[0].selected_ro.slice(2)} ${record1DateFormatted}`}</th>
                            <th>{`#${comparisonRecords[1].selected_ro.slice(2)} ${record2DateFormatted}`}</th>
                            <th>Difference</th>
                            <th>Difference %</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Conc Flow</td>
                            <td>{comparisonRecords[0].conc_flow}</td>
                            <td>{comparisonRecords[1].conc_flow}</td>
                            <td>{comparisonRecords[1].conc_flow - comparisonRecords[0].conc_flow > 0 ?
                                `+${comparisonRecords[1].conc_flow - comparisonRecords[0].conc_flow}` :
                                `${comparisonRecords[1].conc_flow - comparisonRecords[0].conc_flow}`
                            }</td>
                            <td>{
                                ((comparisonRecords[1].conc_flow - comparisonRecords[0].conc_flow) / comparisonRecords[0].conc_flow * 100).toFixed(0) > 0 ?
                                    `+${((comparisonRecords[1].conc_flow - comparisonRecords[0].conc_flow) / comparisonRecords[0].conc_flow * 100).toFixed(0)}` :
                                    `${((comparisonRecords[1].conc_flow - comparisonRecords[0].conc_flow) / comparisonRecords[0].conc_flow * 100).toFixed(0)}`
                            }%
                            </td>
                        </tr>
                        {populateMembraneRows(comparisonRecords)}
                    </tbody>
                </table>
            </div>

        )
    }
    else return (<></>)
}