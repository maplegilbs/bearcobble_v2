//Libraries
import { useEffect, useState } from 'react'
//Functions
import { formatTime } from '@/utils/formatDate.js'
//Styles
import ro_form_styles from './ro_form.module.scss'




export default function RO_Form({updateTable}) {
    const [formValues, setFormValues] = useState({is_benchmark: false})
    const [membraneInputs, setMembraneInputs] = useState([])
    const [wasSubmitted, setWasSubmitted] = useState(false)

    function changeHandler(e) {
        if(e.target.id==='isBenchmark'){setFormValues({ ...formValues, [e.target.name]: e.target.checked })}
        else{setFormValues({ ...formValues, [e.target.name]: e.target.value })}
        // setFormValues(Object.assign(formValues, {[e.target.name]: e.target.value })) //this doesn't work why
    }

    useEffect(() => {
        let membrane_inputs = [];
        for (let i = 1; i <= 8; i++) {
            membrane_inputs.push(
                <div key={`membrane${i}Row`} className={ro_form_styles.input_container_row}>
                    <label htmlFor={`membrane${i}`}>Membrane {i}</label>
                    <input required className={`${ro_form_styles.membrane_input}`} type="number" step={.5} min={0} max={20} name={`membrane_${i}`} onChange={(e) => changeHandler(e, formValues)} id={`membrane${i}`} placeholder="gpm" value={formValues[`membrane_${i}`] ? formValues[`membrane_${i}`] : ''}></input>
                </div>
            )
        }
        setMembraneInputs(membrane_inputs);
    }, [formValues])

    useEffect(() => {
        function timeSetter() {
            let now = formatTime(new Date());
            setFormValues({ ...formValues, record_date: `${now.year}-${now.month}-${now.day}T${now.time24Hr}` })
        }
        timeSetter();
    }, [])

    useEffect(() => {
        console.log(formValues)
    }, [formValues])


    let permeateGPM = () => {
        let gpm = Object.keys(formValues).reduce((accumulator, name) => {
            if (name.toLowerCase().includes('membrane')) {
                accumulator += Number(formValues[name])
            }
            return accumulator
        }, 0)
        return gpm;
    }

    async function submitForm (event){
        event.preventDefault()
        // let formData = new FormData(formValues)
        try {
            let submittedData = await fetch('../api/ro_records_write', {
            method: 'POST',
            header: {'Content-Type': 'application/json'},
            body: JSON.stringify(formValues)
            })
            let submittedJSON = await submittedData.json();
            console.log(submittedJSON)
            if(submittedJSON.success){
                console.log(submittedJSON.inserted_id)
                updateTable(prev => prev + 1)
                setWasSubmitted(prev => !prev)
            }
            
        } catch (error) {
            
        }
    }


    return (
        <>
        {wasSubmitted?
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
                        <input className={`${ro_form_styles.membrane_input}`} type="number" step={.1} min={0} max={20} name="sugar_percent_out" id="sugarPercentOut" onChange={changeHandler} value={formValues.sugarPercentOut}></input>
                    </div>
                    <div className={ro_form_styles.input_container}>
                        <label htmlFor="temperature">Temperature {`${'\u00b0'}`}</label>
                        <input className={`${ro_form_styles.membrane_input}`} type="number" step={1} min={0} max={120} name="temperature" id="temperature" onChange={changeHandler} value={formValues.temperature}></input>
                    </div>
                </div>
                <br />
                <h2 style={{ borderBottom: '1px solid black', textAlign: 'left', marginLeft: '10%', width: '70%', alignSelf: 'flex-start' }}>Concentrate</h2><br />
                <div className={ro_form_styles.form_row}>
                    <div className={ro_form_styles.membranes_inputs}>
                        <div className={ro_form_styles.input_container_row}>
                            <label htmlFor="concentrateFlow">Concentrate Flow</label>
                            <input required className={`${ro_form_styles.membrane_input}`} type="number" step={.5} min={0} max={20} name="conc_flow" id="concentrateFlow" placeholder="gpm" onChange={changeHandler} value={formValues.concentrateFlow}></input>
                        </div>
                    </div>
                </div>
                <div className={ro_form_styles.form_row}>
                    <h3>Concentrate GPH</h3><h3>{formValues.conc_flow ? formValues.conc_flow * 60 : '--'}</h3>
                </div>
                <br />
                <h2 style={{ borderBottom: '1px solid black', textAlign: 'left', marginLeft: '10%', width: '70%', alignSelf: 'flex-start' }}>Permeate</h2><br />
                <div className={ro_form_styles.form_row}>
                    <div className={ro_form_styles.membranes_inputs}>
                        {membraneInputs}
                    </div>
                </div>
                <div className={ro_form_styles.form_row}>
                    <h3>Permeate GPH</h3><h3>{permeateGPM() ? permeateGPM() * 60 : ' --'}</h3>
                </div>
                <hr />
                <div className={ro_form_styles.form_row}>
                    <label htmlFor='isBenchmark'>Is this a benchmark?</label>
                    <input type="checkbox" onChange={changeHandler} name="is_benchmark" id="isBenchmark" />
                </div>
                <br/>
                <input type="submit" value="Add Record To Database"/>
            </form>
}
        </>
        
    )
}