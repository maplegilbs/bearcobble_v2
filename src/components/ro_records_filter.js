//Styles
import { useState } from 'react';
import filter_form_styles from './ro_records_filter.module.scss';

export default function RO_Records_Filter({ recordFilterQuery, setRecordFilterQuery, isFilterDisplayed, setIsFilterDisplayed }) {


    return (
        <>
            <div
                className={`${filter_form_styles.filter_form_container} ${isFilterDisplayed ? filter_form_styles.filter_visible : filter_form_styles.filter_hidden}`}>
                <h2>Filter Options</h2>
                <form className={filter_form_styles.filter_form}>
                    <div className={filter_form_styles.input_container}>
                        <label htmlFor='selected_ro'>RO</label>
                        <select name="selected_ro" id="selected_ro">
                            <option value="">All</option>
                            <option value="ro1">RO  1</option>
                            <option value="ro2">RO 2</option>
                        </select>
                    </div>
                    <div className={filter_form_styles.input_container}>
                        <label htmlFor='process_type'>Process Type</label>
                        <select name="process_type" id="process_type">
                            <option value="all">All</option>
                            <option value="first_pass">First Pass</option>
                            <option value="second_pass">Second Pass</option>
                            <option value="benchmark">Benchmark</option>
                        </select>
                    </div>
                    <div className={filter_form_styles.input_container}>
                        <label htmlFor='startDate'>Start Date</label>
                        <input id="startDate" name="start_date" type="datetime-local" />
                        <label htmlFor='endDate'>End Date</label>
                        <input id="endDate" name="end_date" type="datetime-local" />
                    </div>

                    <div className={`${filter_form_styles.input_container} ${filter_form_styles.buttons_container}`}>
                        <button onClick={(e) => {
                            e.preventDefault();
                            let formData = new FormData(e.target.parentElement.parentElement)
                            let entries = formData.entries();
                            let queryData = [];
                            for (let entry of entries) {
                                queryData.push([entry[0], entry[1]])
                            }
                            let queryString = queryData.reduce((accum, cur) => {
                                if (cur[1]) {
                                    return accum.length > 1 ? accum + `&${cur[0]}=${cur[1]}` : accum + `${cur[0]}=${cur[1]}`
                                }
                                else return accum
                            }, '?')
                            console.log(queryString)
                            setRecordFilterQuery(queryString)
                            setIsFilterDisplayed(false)
                        }}>Update</button>


                        <button onClick={(e) => {
                            e.preventDefault();
                            setIsFilterDisplayed(false)
                        }}>Cancel</button>
                    </div>
                </form>
            </div>
        </>
    )
}