//Components
import Primary_Header from './primary_header.js'
import Primary_Footer from './primary_footer.js'
//Styles
import LayoutStyles from './primary_layout.module.scss'

export default function Primary_Layout({ children }) {

    return (
        <div className={LayoutStyles.layout_container}>
            <Primary_Header />
            <main>{children}</main>
            <Primary_Footer />
        </div>
    )
}