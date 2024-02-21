//Layout
import Primary_Layout from "@/components/primary_layout.js";
//Modules
import Head from "next/head";
//Styles
import '../styles/reset_styles.scss';


export default function App({Component, pageProps}) {

    return (
        <>
        <Head>
            <link rel="icon" href="/bearpaw.png"/>
            <title>Bear Cobble HQ</title>
        </Head>
        <Primary_Layout >
            <Component {...pageProps} />
        </Primary_Layout>
        </>
    )

}