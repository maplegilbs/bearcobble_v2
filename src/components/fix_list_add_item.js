//Libraries
import { useState } from 'react'
//Styles
import fix_list_form_styles from './fix_list_add_item.module.scss'
//Functions
import { formatTime } from '@/utils/formatDate';

const lines = [160, 86, 87, 81, 119];
function lineSelect(numLines) {
    let lineOptions = [];
    for (let lineNum = 1; lineNum <= numLines; lineNum++) {
        lineOptions.push(
            <option key={lineNum} value={lineNum}>{lineNum}</option>
        )
    }
    lineOptions.unshift(<option key='0' value={null}>N/A</option>)
    return lineOptions;
}

export default function Fix_List_Add_Form({ isVisible, setIsVisible }) {
    const [selectedSection, setSelectedSection] = useState(null);
    const [formValues, setFormValues] = useState({isResolved: 0, action: 'addNew', section: null, lineNum: null});
    

    function formValuesChangeHandler(e){
        e.preventDefault();
        setFormValues({...formValues, [e.target.name]: e.target.value})
    }


    async function submitForm(e) {
        e.preventDefault();
        let now = formatTime(new Date())
        let formData = {...formValues, submitTime:  `${now.year}-${now.month}-${now.day}T${now.time24Hr}`};
        console.log(formData)
        try {
            let submittedData = await fetch('../api/fix_list_write',{
                method: 'POST',
                header: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            })
            setIsVisible(false)
            let submittedJSON = await submittedData.json();
            console.log(submittedJSON)
        } catch (error) {
            
        }
        console.log(formData)

    }

    return (
        <>
            <div className={fix_list_form_styles.new_fix_form_container}>
                <form className={fix_list_form_styles.new_fix_form} onSubmit={submitForm}>
                    <div className={`${fix_list_form_styles.form_input}`}>
                        <label htmlFor='section_select'>Section</label>
                        <select id="section_select" name="section" onChange={(e) => {
                            e.target.value === 'null' ? setSelectedSection(null) : setSelectedSection(e.target.value)
                            formValuesChangeHandler(e)}
                            }>
                            <option value='null'>N/A</option>
                            <option value='1'>1</option>
                            <option value='2'>2</option>
                            <option value='3'>3</option>
                            <option value='4'>4</option>
                            <option value='5'>5</option>
                        </select>
                    </div>
                    <div className={`${fix_list_form_styles.form_input}`}>
                        {selectedSection &&
                            <>
                                <label htmlFor='line_select'>Line Number</label>
                                <select id='line_select' name="lineNum" onChange={e=>formValuesChangeHandler(e)}>
                                    {lineSelect(lines[selectedSection - 1])}
                                </select>
                            </>
                        }
                    </div>
                    <div className={`${fix_list_form_styles.form_input}`}>
                        <label htmlFor='note'>Notes *</label><br />
                        <textarea id="note" name="note" rows="10" cols="40" onChange={e=>formValuesChangeHandler(e)} required></textarea>
                    </div>
                    <div className={`${fix_list_form_styles.form_input}`}>
                        <label>Priority Level *</label><br />
                        <div className={fix_list_form_styles.radio_inputs}>
                            <div className={fix_list_form_styles.radio_input}>
                                <label htmlFor='high_priority'>High</label>
                                <input type="radio" id="high_priority" name="priority" value="0" required="" onChange={e=>formValuesChangeHandler(e)}/>
                            </div>
                            <div className={fix_list_form_styles.radio_input}>
                                <label htmlFor='medium_priority'>Medium</label>
                                <input type="radio" id="medium_priority" name="priority" value="1" required="" onChange={e=>formValuesChangeHandler(e)}/>
                            </div>
                            <div className={fix_list_form_styles.radio_input}>
                                <label htmlFor='low_priority'>Low</label>
                                <input type="radio" id="low_priority" name="priority" value="2" required="" onChange={e=>formValuesChangeHandler(e)}/>
                            </div>
                        </div>
                        <p>High - issue causing vacuum leak or impediment to sap collection. Ex - broken fittings, trees on
                            mainlines.</p>
                        <p>Medium - potential to be a vacuum leak and/or impediment to sap collection in the near future. Ex -
                            broken wires, lines in need of posting.</p>
                        <p>Low - issue to be addressed when time allows. Ex - dead end trees, loose wire, road issues.</p>
                    </div>
                    <div className={`${fix_list_form_styles.buttons_container} ${fix_list_form_styles.form_input}`}>
                        <button>Submit</button>
                        <button onClick={() => setIsVisible(false)}>Cancel</button>
                    </div>
                </form>
            </div>
        </>
    )

}