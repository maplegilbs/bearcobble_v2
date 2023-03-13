//Functions
import { formatTime } from '@/utils/formatDate';
import { useRef, useState } from 'react';
//Styles
import ro_table_styles from './ro_records_table.module.scss';

export default function RO_Table({ selectedRecords }) {
    const [selectedRows, setSelectedRows] = useState([]);

    function selectRow(e){
        let selectedRow = e.target.parentElement.parentElement;
        selectedRow.style.backgroundColor = selectedRow.style.backgroundColor?  '' : '#d5eafb';
    }
    console.log(selectedRecords)

    function ROTableRow({ rowdata }) {
        let recordDate = formatTime(new Date(rowdata.record_date))
        let formattedTime = `${recordDate.date}/${recordDate.year}`
        return (
            <tr data-id={rowdata.id}>
                <td>
                    <input type="checkbox" onClick={selectRow}></input>
                </td>
                <td className={ro_table_styles.column_separator}>{rowdata.selected_ro.slice(2)}</td>
                <td>{formattedTime}</td>
                <td className={ro_table_styles.column_separator}>{rowdata.sugar_percent_in}</td>
                <td>{rowdata.sugar_percent_out}</td>
                <td>{rowdata.temperature}</td>
                <td className={ro_table_styles.column_separator}>{rowdata.conc_flow}</td>
                <td className={ro_table_styles.column_separator}>{rowdata.membrane_1}</td>
                <td>{rowdata.membrane_2}</td>
                <td>{rowdata.membrane_3}</td>
                <td>{rowdata.membrane_4}</td>
                <td>{rowdata.membrane_5}</td>
                <td>{rowdata.membrane_6}</td>
                <td>{rowdata.membrane_7}</td>
                <td>{rowdata.membrane_8}</td>
            </tr>
        )
    }

    return (
        <div className={ro_table_styles.ro_table_container}>
            <h2>RO Performance Records</h2>
                <hr />
            <table className={ro_table_styles.ro_table}>
                <thead>
                    <tr>
                        <th>Select</th>
                        <th className={ro_table_styles.column_separator}>RO</th>
                        <th>Date</th>
                        <th className={ro_table_styles.column_separator}>% Sugar In</th>
                        <th>% Sugar Out</th>
                        <th>Temp</th>
                        <th className={ro_table_styles.column_separator}>Conc Flow</th>
                        <th className={ro_table_styles.column_separator}>Mem 1</th>
                        <th>Mem 2</th>
                        <th>Mem 3</th>
                        <th>Mem 4</th>
                        <th>Mem 5</th>
                        <th>Mem 6</th>
                        <th>Mem 7</th>
                        <th>Mem 8</th>
                    </tr>

                </thead>
                <tbody>
                    {selectedRecords.map(record => <ROTableRow rowdata={record} />)}
                </tbody>

            </table>

        </div>
    )
}