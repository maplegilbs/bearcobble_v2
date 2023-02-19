//Layout
import Primary_Layout from "@/components/primary_layout.js";
//Styles
import '../styles/reset_styles.scss';


export default function App({Component, pageProps}) {

    return (
        <Primary_Layout >
            <Component {...pageProps} />
        </Primary_Layout>
    )

}