//Components
import Link from 'next/link';
import Image from 'next/image';
//Icons
import HomeIcon from '../../public/bearpaw.png';
import WeatherIcon from '../../public/IconColor-Weather.png'
import SensorIcon from '../../public/IconColor-Sensor.png'
import MapIcon from '../../public/IconColor-Map.png'
import ROIcon from '../../public/IconColor-RO.png'
//Styles
import nav_styles from './primary_nav.module.scss'

export default function Primary_Nav({ isMobileMenuDisplayed, setIsMobileMenuDisplayed }) {

    return (
        <nav
            className={`${nav_styles.primary_nav} ${isMobileMenuDisplayed ? nav_styles.selected : ''}`}
            onClick={() => setIsMobileMenuDisplayed((prev) => !prev)}
        >
            <Link href="/"><span>Home</span><Image className={nav_styles.home_icon} src={HomeIcon} alt='Icon of a bearclaw'></Image></Link>
            <hr className={nav_styles.nav_hr} />
            <Link href="/sensors"><span>Sensors</span><Image src={SensorIcon} alt='Icon of a sensor'></Image></Link>
            <hr className={nav_styles.nav_hr} />
            <Link href="/ros"><span>ROs</span><Image src={ROIcon} alt='Icon of an RO'></Image></Link>
            <hr className={nav_styles.nav_hr} />
            <Link href="/weather"><span>Weather</span><Image src={WeatherIcon} alt='Icon of a cloud and sun'></Image></Link>
            <hr className={nav_styles.nav_hr} />
            <Link href="/map"><span>Map</span><Image src={MapIcon} alt='Icon of a map with place locator pin'></Image></Link>
        </nav>
    )
}