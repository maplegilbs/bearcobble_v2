//Components
import SightGlassObjectDetection from './ro_gpm_object_detection'
//Libraries
import { useEffect, useState } from 'react'
//Functions
import { formatTime } from '@/utils/formatDate.js'
//Styles
import ro_form_styles from './ro_form.module.scss'




export default function RO_Form({ updateTable }) {
    const [formValues, setFormValues] = useState({ is_benchmark: false })
    const [membraneInputs, setMembraneInputs] = useState([]) //hold input elements for membranes
    const [concInput, setConcInput] = useState([]); //hold input element for conc flow
    const [wasSubmitted, setWasSubmitted] = useState(false)
    const [objDetSubmitted, setObjDetSubmitted] = useState(false) //flag for if information was updated via objDetection model

    function changeHandler(e) {
        if (e.target.id === 'isBenchmark') { setFormValues({ ...formValues, [e.target.name]: e.target.checked }) }
        else { setFormValues({ ...formValues, [e.target.name]: e.target.value }) }
    }

    useEffect(() => {
        let membrane_inputs = [];
        for (let i = 1; i <= 8; i++) {
            membrane_inputs.push(
                <div key={`membrane${i}Row`} className={ro_form_styles.input_container_row}>
                    <label htmlFor={`membrane${i}`}>Membrane {i}</label>
                    <input required className={`${ro_form_styles.membrane_input} ${objDetSubmitted ? ro_form_styles.membrane_input_updated : ""}`} type="number" step={.25} min={0} max={20} name={`membrane_${i}`} onChange={(e) => changeHandler(e, formValues)} id={`membrane${i}`} placeholder="gpm" value={formValues[`membrane_${i}`] ? formValues[`membrane_${i}`] : ''}></input>
                </div>
            )
        }
        let conc_input = [];
        conc_input.push(
            <div className={ro_form_styles.input_container_row}>
                <label htmlFor="concentrateFlow">Concentrate</label>
                <input required className={`${ro_form_styles.membrane_input} ${objDetSubmitted ? ro_form_styles.membrane_input_updated : ""}`} type="number" step={.5} min={0} max={20} name="conc_flow" id="concentrateFlow" placeholder="gpm" onChange={changeHandler} value={formValues.conc_flow}></input>
            </div>
        )
        if (objDetSubmitted) {setTimeout(()=>setObjDetSubmitted(false),3000)}
        setConcInput(conc_input)
        setMembraneInputs(membrane_inputs);
    }, [formValues, objDetSubmitted])

    useEffect(() => {
        function timeSetter() {
            let now = formatTime(new Date());
            setFormValues({ ...formValues, record_date: `${now.year}-${now.month}-${now.day}T${now.time24Hr}` })
        }
        timeSetter();
    }, [])


    let permeateGPM = () => {
        let gpm = Object.keys(formValues).reduce((accumulator, name) => {
            if (name.toLowerCase().includes('membrane')) {
                accumulator += Number(formValues[name])
            }
            return accumulator
        }, 0)
        return gpm;
    }

    async function submitForm(event) {
        event.preventDefault()
        try {
            let submittedData = await fetch('../api/ro_records_write', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formValues)
            })
            let submittedJSON = await submittedData.json();
            console.log(submittedJSON)
            if (submittedJSON.success) {
                updateTable(submittedJSON.inserted_id)
                setWasSubmitted(prev => !prev)
            }
        } catch (error) {
            console.error(error)
        }
    }


    return (
        <>
            {wasSubmitted ?
                <p>Submitted</p>
                :
                <form className={ro_form_styles.ro_form} onSubmit={submitForm}>
                    <h2>RO Performance Record</h2>
                    <hr />
                    <h3>Select RO</h3>
                    <div className={ro_form_styles.form_row}>
                        <div className={ro_form_styles.input_container}>
                            <label htmlFor="roID1">#1 (Calvin)</label>
                            <input required type="radio" name="selected_ro" id="roID2" value="ro1" onClick={changeHandler} />
                        </div>
                        <div className={ro_form_styles.input_container}>
                            <label htmlFor="roID2">#2 (Hobbes)</label>
                            <input required type="radio" name="selected_ro" id="roID2" value="ro2" onClick={changeHandler} />
                        </div>
                    </div>
                    <div className={ro_form_styles.form_row}>
                        <div className={ro_form_styles.input_container}>
                            <label htmlFor='recordDateTime'>Date / Time of Reading</label>
                            <input id="recordDateTime" name="record_date" type="datetime-local" onChange={changeHandler} defaultValue={formValues.record_date} />
                        </div>
                    </div>
                    <div className={ro_form_styles.form_row}>
                        <div className={ro_form_styles.input_container}>
                            <label htmlFor="sugarPercentIn">% Sugar In</label>
                            <input className={`${ro_form_styles.membrane_input}`} type="number" step={.1} min={0} max={20} name="sugar_percent_in" id="sugarPercentIn" onChange={changeHandler} value={formValues.sugarPercentIn}></input>
                            <label htmlFor="sugarPercentOut">% Sugar Out</label>
                            <input className={`${ro_form_styles.membrane_input}`} type="number" step={.1} min={0} max={40} name="sugar_percent_out" id="sugarPercentOut" onChange={changeHandler} value={formValues.sugarPercentOut}></input>
                        </div>
                        <div className={ro_form_styles.input_container}>
                            <label htmlFor="temperature">Temperature {`${'\u00b0'}`}</label>
                            <input className={`${ro_form_styles.membrane_input}`} type="number" step={1} min={0} max={120} name="temperature" id="temperature" onChange={changeHandler} value={formValues.temperature}></input>
                        </div>
                    </div>
                    <br />
                    <div className={`${ro_form_styles.membranes_inputs_container}`}>
                        <h2>Flows</h2><br />
                        <p>Powered by computer vision.  Take a picture of the sight glass flow-meters from head-on ensuring all 9 are included in the image.  Then click the &#34;Interpolate Flows&#34; button to calculate flow rates and populate the fields below.  Adjust the form manually for any necessary corrections.</p>
                        <SightGlassObjectDetection setFormValues={setFormValues} setObjDetSubmitted={setObjDetSubmitted} />
                        <div className={ro_form_styles.form_row}>
                            <div className={ro_form_styles.membranes_inputs}>
                                {concInput}
                            </div>
                        </div>
                        <div className={ro_form_styles.form_row}>
                            <h3>Concentrate GPH</h3><h3>{formValues.conc_flow ? formValues.conc_flow * 60 : '--'}</h3>
                        </div>
                        <br />
                        <div className={ro_form_styles.form_row}>
                            <div className={ro_form_styles.membranes_inputs}>
                                {membraneInputs}
                            </div>
                        </div>
                        <div className={ro_form_styles.form_row}>
                            <h3>Permeate GPH</h3><h3>{permeateGPM() ? permeateGPM() * 60 : ' --'}</h3>
                        </div>
                    </div>
                    <hr />
                    <div className={ro_form_styles.form_row}>
                        <label htmlFor='isBenchmark'>Is this a benchmark?</label>
                        <input type="checkbox" onChange={changeHandler} name="is_benchmark" id="isBenchmark" />
                    </div>
                    <br />
                    <input type="submit" value="Add Record To Database" />
                </form>
            }
        </>

    )
}