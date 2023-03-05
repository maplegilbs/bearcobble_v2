//Styles
import section_history_styles from './section_history_container.module.scss'



export default function Section_History({ type, section_num, tableData, timeRemaining }) {


    return (
        <div className={section_history_styles.section_history_container}>
            <h3><span>{type} {section_num}</span>
                {timeRemaining &&
                    <span style={{ fontSize: '.7rem' }}>Time Remaining <br/> 
                    <span className={section_history_styles.time_remaining} style={{color: timeRemaining[1]}}>{timeRemaining[0]}</span>
                    </span>
                }</h3>
            <table>
                <thead>
                    <tr><th>Time</th>
                        <th>{type == 'Tank' ? 'Level' : 'in Hg'}</th>
                        <th>{type == 'Tank' ? `${'\u0394'}/hr` : 'Change'}</th>
                        </tr>
                </thead>
                <tbody>
                    {tableData}
                </tbody>
            </table>
        </div>
    )
}