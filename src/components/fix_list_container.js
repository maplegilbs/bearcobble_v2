//Libraries
import { useEffect, useState } from "react"
//Functions
import { formatTime } from "@/utils/formatDate";
//Styles
import fix_list_styles from './fix_list_container.module.scss';



export default function Fix_List() {
    const [sortBy, setSortBy] = useState('section');
    const [selectedFixList, setSelectedFixList] = useState(null)
    const [selectedRowIds, setSelectedRowIds] = useState([])

    function selectRow(id) {
        if (selectedRowIds.includes(id)) {
            setSelectedRowIds(prev => {
                let updateArray = [...prev];
                updateArray.splice(updateArray.indexOf(id), 1);
                return updateArray;
            })
        }
        else {
            setSelectedRowIds(prev => [...prev, id])
        }
    }

    function buildFixListRow(record) {
        return (
            <tr data-id={record.id} className={`${selectedRowIds.includes(record.id) ? fix_list_styles.selected_row : ''}`}>
                <td style={{ textAlign: 'center' }}>
                    <input type="checkbox"
                        onChange={() => selectRow(record.id)}
                        checked={selectedRowIds.includes(record.id) ? true : false}
                    >
                    </input>
                </td>
                <td>{record.section}</td>
                <td>{record.lineNum}</td>
                <td colSpan={2}>{record.note}</td>
                <td>{formatTime(new Date(record.submitTime)).date}</td>
            </tr>
        )
    }

    async function markResolved(ids) {
        try {
            let resolved_records = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/fix_list_write`, {
                method: "POST",
                header: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'markComplete',
                    ids: ids
                })
            })
            setSelectedRowIds([])
        } catch (error) {
            console.error(`Unable to update selected records.  Error: ${error}`)
        }
    }

    useEffect(() => {
        async function getFixList() {
            try {
                let fix_list_data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/fix_list_read?sortBy=${sortBy}`)
                let fix_list_json = await fix_list_data.json();
                setSelectedFixList(fix_list_json)
            } catch (error) {
                console.error(`There was an error getting fix list information.  Error ${error}`);
            }
        }
        getFixList();
    }, [sortBy])


    console.log(selectedFixList)

    return (
        <>
            <div className={fix_list_styles.display_controls}>
                <span>Sort By: &nbsp;</span>
                <select name="sortBy" onChange={(e) => setSortBy(e.target.value)}>
                    <option value="section">Section</option>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="priority">Priority</option>
                </select>

            </div>
            <div className={fix_list_styles.table_container}>
                <table className={fix_list_styles.fix_table}>
                    <thead>
                        <tr>
                            <th>Select</th>
                            <th>Section</th>
                            <th>Line</th>
                            <th colSpan={2}>Note</th>
                            <th>Date</th>
                            {/* <th>Priority</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {selectedFixList &&
                            selectedFixList.map(record => buildFixListRow(record))
                        }
                    </tbody>
                </table>
            </div>
            <div className={fix_list_styles.display_controls}>
                <button onClick={() => markResolved(selectedRowIds)}>Mark Resolved</button>
            </div>
        </>
    )
}