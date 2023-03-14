//Functions
import { formatTime } from '@/utils/formatDate';
import { useEffect, useState } from 'react';
//Styles
import ro_table_styles from './ro_records_table.module.scss';

export default function RO_Table({ selectedRecords, newestRecord }) {
    const [selectedRows, setSelectedRows] = useState([]);
    const [isPrimaryRender, setIsPrimaryRender] = useState(true)

    console.log(selectedRows)

    function selectRow(id) {
        if(isPrimaryRender) setIsPrimaryRender(false)
        selectedRows.includes(id)? 
        setSelectedRows(prev =>{
            let updateArray = [...prev];
            updateArray.splice(updateArray.indexOf(id), 1)
            setSelectedRows(updateArray)
        }):
        setSelectedRows(prev =>  [...prev, id]);
    }

    // useEffect()

    function ROTableRow({ rowdata }) {
        let recordDate = formatTime(new Date(rowdata.record_date))
        let formattedTime = `${recordDate.date}/${recordDate.year}`
        return (
            <tr 
            className={newestRecord === rowdata.id && isPrimaryRender ? ro_table_styles.added_row : ''} 
            style={{backgroundColor: selectedRows.includes(rowdata.id)?  'red': 'initial'}}
            data-id={rowdata.id}
            >
                <td>
                    <input type="checkbox" 
                    disabled = {selectedRows.length >= 2 && !selectedRows.includes(rowdata.id)? true : false} 
                    onChange = {()=>selectRow(rowdata.id)}
                    checked = {selectedRows.includes(rowdata.id)? true: false}></input>
                </td>
                <td className={ro_table_styles.column_separator}>{rowdata.selected_ro.slice(2)}</td>
                <td>{formattedTime}</td>
                <td className={ro_table_styles.column_separator}>{rowdata.sugar_percent_in ? rowdata.sugar_percent_in : ''} {'\u2192'} {rowdata.sugar_percent_out ? rowdata.sugar_percent_out : ''}</td>
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
            <div className={ro_table_styles.heading_container}>
                <h2>RO Performance Records</h2><button>Compare Selected</button>
            </div>
            <hr />
            <table className={ro_table_styles.ro_table}>
                <thead>
                    <tr>
                        <th>Select</th>
                        <th className={ro_table_styles.column_separator}>RO</th>
                        <th>Date</th>
                        <th className={ro_table_styles.column_separator}> &nbsp; &nbsp; &#176;Bx In  &#8680;  &#176;Bx Out</th>
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
                    {selectedRecords.map(record => <ROTableRow key={record.id} rowdata={record} />)}
                </tbody>

            </table>

        </div>
    )
}