//Components
import RO_Form from "@/components/ro_form"
//Styles
import ro_styles from '@/styles/ro_page_styles.module.scss';

export default function ROs(){

    return (
        <>
        <div className={ro_styles.ro_form_container}>
        <RO_Form />

        </div>
        </>
    )
}