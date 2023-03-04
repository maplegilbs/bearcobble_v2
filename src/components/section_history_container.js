//Libraries
import { useEffect, useState } from "react";
//Styles
import section_history_styles from './section_history_container.module.scss'



export default function Section_History({ section_num, tableData }) {
    

    return (
        <div className={section_history_styles.section_history_container}>
            <h3>Section {section_num}</h3>
            <table>
                <thead>
                    <tr><th>Time</th><th>in Hg</th><th>Change</th></tr>
                </thead>
                <tbody>
                    {tableData}
                </tbody>
            </table>
        </div>
    )
}