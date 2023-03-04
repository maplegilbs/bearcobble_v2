//Components
import Section_History from './section_history_container.js'
//Styles
import vac_history_styles from './vacuum_history.module.scss'

export default function Vacuum_History(){

    return (
        <>
        <select>
            <option>4 hrs</option>
            <option>12 hrs</option>
            <option>1 day</option>
            <option>2 days</option>
            <option>1 week</option>

        </select>
        <div className={vac_history_styles.vac_history_container}>
        <Section_History section_num={1}/>
        </div>
        </>
    )

}