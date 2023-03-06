//Styles
import loader_styles from '@/components/loader.module.scss';

export default function Loader(){
    return(
        <>
        <div className={loader_styles.loader}></div>
        </>
    )
}