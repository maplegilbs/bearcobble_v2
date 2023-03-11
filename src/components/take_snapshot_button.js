//Images
import camera_icon from 'public/IconColor - camera.png'
//Components
import Image from 'next/image';
//Styles
import snapshot_button_styles from './take_snapshot_button.module.scss';

async function button_handler (type, afterSubmit) {
    try {
        let postedData = await fetch('api/sensor_data_write', {
            method: 'POST',
            body: JSON.stringify({
                sensor_type: type
            }),
            headers: {'Content-Type': 'application/json'}
        })
        let postedJSON = await postedData.json();
        afterSubmit(postedJSON)
    } catch (error) {
        console.error(`There was an error posting the data to the database, error: ${error}`);
    }

}

export default function Snapshot_Button({type, onClick}){

    return (
        <button className={snapshot_button_styles.snapshot_button} onClick={()=>button_handler(type, onClick)}>
            <Image alt='Icon of a camera' src={camera_icon} className={snapshot_button_styles.icon} />
            <span>Take Snapshot</span>
        </button>    )
}