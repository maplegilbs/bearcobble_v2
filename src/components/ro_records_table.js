//Functions
import { formatTime } from '@/utils/formatDate';
import { useEffect, useState } from 'react';
//Components
import RO_Records_Filter from "@/components/ro_records_filter";
//Styles
import ro_table_styles from './ro_records_table.module.scss';

export default function RO_Table({ selectedRecords, newestRecord, setComparisonRecords, recordFilterQuery, setRecordFilterQuery, comparisonRef, isFilterDisplayed, setIsFilterDisplayed }) {
    const [selectedRowIds, setSelectedRowIds] = useState([]);
    const [isPrimaryRender, setIsPrimaryRender] = useState(true)

    if(selectedRowIds.length === 2){
        comparisonRef.current.scrollIntoView({behavior: 'smooth'})
    }


    function selectRow(id) {
        if (isPrimaryRender) setIsPrimaryRender(false)
        if (selectedRowIds.includes(id)) {
            setSelectedRowIds(prev => {
                let updateArray = [...prev];
                updateArray.splice(updateArray.indexOf(id), 1)
                return updateArray
            })
            setComparisonRecords(prev => {
                let updateArray = [...prev]
                updateArray.splice(updateArray.indexOf(updateArray.filter(record => record.id === id)[0]), 1)
                return updateArray
            })
        }
        else {
            setComparisonRecords(prev => [...prev, selectedRecords.filter(record => record.id === id)[0]])
            setSelectedRowIds(prev => [...prev, id]);
        }
    }


    function ROTableRow({ rowdata }) {
        let recordDate = formatTime(new Date(rowdata.record_date))
        let formattedTime = `${recordDate.date}/${recordDate.year.toString().slice(-2)}`
        return (
            <tr
                className={`${newestRecord === rowdata.id && isPrimaryRender ? ro_table_styles.added_row : ''} ${selectedRowIds.includes(rowdata.id) ? ro_table_styles.selected_row : ''}`}
                style={{ opacity: selectedRowIds.length > 1 && !selectedRowIds.includes(rowdata.id) ? '.25' : '1' }}
                data-id={rowdata.id}
            >
                <td>
                    <input type="checkbox"
                        disabled={selectedRowIds.length >= 2 && !selectedRowIds.includes(rowdata.id) ? true : false}
                        onChange={() => selectRow(rowdata.id)}
                        checked={selectedRowIds.includes(rowdata.id) ? true : false}></input>
                </td>
                <td className={ro_table_styles.column_separator}>{rowdata.selected_ro.slice(2)}</td>
                <td>{formattedTime}</td>
                {/* <td>{rowdata.is_benchmark ? 'Y' : ''}</td> */}
                <td className={ro_table_styles.column_separator}>
                    {rowdata.is_benchmark ?
                        'BENCHMARK' :
                        `${rowdata.sugar_percent_in ? rowdata.sugar_percent_in : ''} ${'\u2192'} ${rowdata.sugar_percent_out ? rowdata.sugar_percent_out : ''}`
                    }
                </td>
                <td>{rowdata.temperature}</td>
                <td className={ro_table_styles.column_separator}>{Number(rowdata.conc_flow).toFixed(1)}</td>
                <td className={ro_table_styles.column_separator}>{Number(rowdata.membrane_1).toFixed(1)}</td>
                <td>{Number(rowdata.membrane_2).toFixed(1)}</td>
                <td>{Number(rowdata.membrane_3).toFixed(1)}</td>
                <td>{Number(rowdata.membrane_4).toFixed(1)}</td>
                <td>{Number(rowdata.membrane_5).toFixed(1)}</td>
                <td>{Number(rowdata.membrane_6).toFixed(1)}</td>
                <td>{Number(rowdata.membrane_7).toFixed(1)}</td>
                <td>{Number(rowdata.membrane_8).toFixed(1)}</td>
            </tr>
        )
    }

    return (
        <div className={ro_table_styles.ro_table_container}>
            <div className={ro_table_styles.heading_container}>
                <h2>RO Performance Records</h2><p>Select Two To Compare</p>
                <button onClick={() => setIsFilterDisplayed((prev) => !prev)}>Filter</button>
            </div>
            <hr />
            <table className={ro_table_styles.ro_table}>
                <thead>
                    <tr>
                        <th rowSpan={2}>Select</th>
                        <th rowSpan={2} className={ro_table_styles.column_separator}>RO</th>
                        <th rowSpan={2}>Date</th>
                        {/* <th rowSpan={2}>Benchmark</th> */}
                        <th className={ro_table_styles.column_separator}>&#176;Bx In</th>
                        <th rowSpan={2}>Temp</th>
                        <th rowSpan={2} className={ro_table_styles.column_separator}>Conc<br />Flow</th>
                        <th colSpan={8} className={ro_table_styles.column_separator}>Membranes</th>
                    </tr>
                    <tr>
                        <th className={ro_table_styles.column_separator}> &#176;Bx Out</th>
                        <th className={ro_table_styles.column_separator}>1</th>
                        <th>2</th>
                        <th>3</th>
                        <th>4</th>
                        <th>5</th>
                        <th>6</th>
                        <th>7</th>
                        <th>8</th>
                    </tr>
                </thead>
                <tbody className={ro_table_styles.table_body}>
                    {selectedRowIds.length === 2 ?
                        selectedRecords.filter(record => selectedRowIds.includes(record.id)).map(record => <ROTableRow key={record.id} rowdata={record} />)
                        :
                        selectedRecords.map(record => <ROTableRow key={record.id} rowdata={record} />)
                    }
                </tbody>
            </table>
            <RO_Records_Filter
                recordFilterQuery={recordFilterQuery}
                setRecordFilterQuery={setRecordFilterQuery}
                isFilterDisplayed={isFilterDisplayed}
                setIsFilterDisplayed={setIsFilterDisplayed}
            />
            <br />
            {selectedRowIds.length === 2 && <button onClick={() => setSelectedRowIds([])}>Clear Selections</button>}
        </div>
    )
}