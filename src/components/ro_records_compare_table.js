//Functions
import { formatTime } from '@/utils/formatDate';
import { useEffect, useState } from 'react';
//Styles
import comparison_table_styles from './ro_records_compare_table.module.scss';

function populateMembraneRows(records) {
    let membraneRows = []
    if (records.length > 0) {
        let i = 1;
        while (i < 9) {
            membraneRows.push(
                <tr key={`membrane_${i}`}>
                    <td>Mem {i} (gpm)</td>
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

function sortArrayByDates(array) {
    if (array.length > 1) {
        let sortedArray = array.sort((a, b) => {
            return new Date(a.record_date) - new Date(b.record_date)
        });
        return sortedArray
    }
    else return array;
}

export default function Records_Comparison_Table({ comparison_records }) {
    let comparisonRecords = sortArrayByDates(comparison_records)

    if (comparisonRecords.length > 1) {
        let record1Date = formatTime(new Date(comparisonRecords[0].record_date))
        let record1DateFormatted = `${record1Date.date}/${record1Date.year} @ ${record1Date.time}`
        let record1PermTotal = Object.keys(comparisonRecords[0]).reduce((acc, key) => {
            return key.includes('membrane') ? acc + Number(comparisonRecords[0][key]) : acc + 0
        }, 0);
        let record1TotalGPH = Math.round((Number(record1PermTotal) + Number(comparisonRecords[0].conc_flow)) * 60)
        let record2Date = formatTime(new Date(comparisonRecords[1].record_date))
        let record2DateFormatted = `${record2Date.date}/${record2Date.year} @ ${record2Date.time}`
        let record2PermTotal = Object.keys(comparisonRecords[1]).reduce((acc, key) => {
            return key.includes('membrane') ? acc + Number(comparisonRecords[1][key]) : acc + 0
        }, 0)
        let record2TotalGPH = Math.round((Number(record2PermTotal) + Number(comparisonRecords[1].conc_flow)) * 60)

        return (
            <div className={comparison_table_styles.comparison_table_container}>
                <table className={comparison_table_styles.comparison_table}>
                    <thead>
                        <tr>
                            <th>Cateogry</th>
                            <th>{`#${comparisonRecords[0].selected_ro.slice(2)} ${record1DateFormatted.substring(0,6)+record1DateFormatted.substring(8)}`}</th>
                            <th>{`#${comparisonRecords[1].selected_ro.slice(2)} ${record2DateFormatted.substring(0,6)+record2DateFormatted.substring(8)}`}</th>
                            <th>{'\u2206'}</th>
                            <th>{`\u2206`} %</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>&#176;Bx In</td>
                            <td>{comparisonRecords[0].sugar_percent_in}</td>
                            <td>{comparisonRecords[1].sugar_percent_in}</td>
                            <td>{comparisonRecords[1].sugar_percent_in - comparisonRecords[0].sugar_percent_in > 0 ?
                                `+${(comparisonRecords[1].sugar_percent_in - comparisonRecords[0].sugar_percent_in).toFixed(1)}` :
                                `${(comparisonRecords[1].sugar_percent_in - comparisonRecords[0].sugar_percent_in).toFixed(1)}`
                            }</td>
                            <td>{
                                ((comparisonRecords[1].sugar_percent_in - comparisonRecords[0].sugar_percent_in) / comparisonRecords[0].sugar_percent_in * 100).toFixed(0) > 0 ?
                                    `+${((comparisonRecords[1].sugar_percent_in - comparisonRecords[0].sugar_percent_in) / comparisonRecords[0].sugar_percent_in * 100).toFixed(0)}` :
                                    `${((comparisonRecords[1].sugar_percent_in - comparisonRecords[0].sugar_percent_in) / comparisonRecords[0].sugar_percent_in * 100).toFixed(0)}`
                            }%
                            </td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #333' }}>
                            <td>&#176;Bx Out</td>
                            <td>{comparisonRecords[0].sugar_percent_out}</td>
                            <td>{comparisonRecords[1].sugar_percent_out}</td>
                            <td>{comparisonRecords[1].sugar_percent_out - comparisonRecords[0].sugar_percent_out > 0 ?
                                `+${(comparisonRecords[1].sugar_percent_out - comparisonRecords[0].sugar_percent_out).toFixed(1)}` :
                                `${(comparisonRecords[1].sugar_percent_out - comparisonRecords[0].sugar_percent_out).toFixed(1)}`
                            }</td>
                            <td>{
                                ((comparisonRecords[1].sugar_percent_out - comparisonRecords[0].sugar_percent_out) / comparisonRecords[0].sugar_percent_out * 100).toFixed(0) > 0 ?
                                    `+${((comparisonRecords[1].sugar_percent_out - comparisonRecords[0].sugar_percent_out) / comparisonRecords[0].sugar_percent_out * 100).toFixed(0)}` :
                                    `${((comparisonRecords[1].sugar_percent_out - comparisonRecords[0].sugar_percent_out) / comparisonRecords[0].sugar_percent_out * 100).toFixed(0)}`
                            }%
                            </td>
                        </tr>
                        {populateMembraneRows(comparisonRecords)}
                        <tr style={{ borderTop: '1px solid #333' }}>
                            <td>Permeate Total (gpm)</td>
                            <td>{record1PermTotal.toFixed(2)}</td>
                            <td>{record2PermTotal.toFixed(2)}</td>
                            <td>{record2PermTotal - record1PermTotal > 0 ?
                                `+${record2PermTotal - record1PermTotal}` :
                                `${record2PermTotal - record1PermTotal}`
                            }</td>
                            <td>{
                                ((record2PermTotal - record1PermTotal) / record1PermTotal * 100).toFixed(0) > 0 ?
                                    `+${((record2PermTotal - record1PermTotal) / record1PermTotal * 100).toFixed(0)}` :
                                    `${((record2PermTotal - record1PermTotal) / record1PermTotal * 100).toFixed(0)}`
                            }%
                            </td>
                        </tr>
                        <tr>
                            <td>Conc Flow (gpm)</td>
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
                        <tr style={{ borderTop: '2px solid #333', backgroundColor: 'rgba(230, 230, 45, .4)', fontWeight: '600' }}>
                            <td>Flow Totals (gph)</td>
                            <td>{record1TotalGPH}</td>
                            <td>{record2TotalGPH}</td>
                            <td>{record2TotalGPH - record1TotalGPH > 0 ?
                                `+${record2TotalGPH - record1TotalGPH}` :
                                `${record2TotalGPH - record1TotalGPH}`
                            }</td>
                            <td>{
                                ((record2TotalGPH - record1TotalGPH) / record1TotalGPH * 100).toFixed(0) > 0 ?
                                    `+${((record2TotalGPH - record1TotalGPH) / record1TotalGPH * 100).toFixed(0)}` :
                                    `${((record2TotalGPH - record1TotalGPH) / record1TotalGPH * 100).toFixed(0)}`
                            }%
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        )
    }
    else return (<></>)
}