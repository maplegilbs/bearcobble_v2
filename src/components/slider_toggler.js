//Styles
import slider_styles from './slider_toggler.module.scss'


export default function Slider_Toggler({istoggled, setIsToggled}) {

    return (
        <div 
        className={`${slider_styles.groove} ${istoggled? slider_styles.groove_toggle_on: ''}`}
        onClick={()=>setIsToggled(prev => !prev)}>
            <div className={`${slider_styles.slider} ${istoggled? slider_styles.toggle_on: ''}`}></div>
        </div>
    )
}