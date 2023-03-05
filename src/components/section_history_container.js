//Styles
import section_history_styles from './section_history_container.module.scss'



export default function Section_History({ type, section_num, tableData }) {
    

    return (
        <div className={section_history_styles.section_history_container}>
            <h3>{type} {section_num}</h3>
            <table>
                <thead>
                    <tr><th>Time</th>
                    <th>{type == 'Tank'? 'Level': 'in Hg'}</th>
                    <th>{type == 'Tank'? `${'\u0394'}/hr`: 'Change'}</th>
                    {type == 'Tank'? <th>Time Remaining</th>: ''}</tr>
                </thead>
                <tbody>
                    {tableData}
                </tbody>
            </table>
        </div>
    )
}