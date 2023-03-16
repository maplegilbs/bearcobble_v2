//Styles
import loader_styles from '@/components/loader.module.scss';

export default function Loader({loader_text}) {
    return (
        <>
            <div className={loader_styles.loader}>
                <div className={loader_styles.loading_text}>{loader_text}</div>
                <div className={loader_styles.loading_spinner}></div>
            </div>
        </>
    )
}