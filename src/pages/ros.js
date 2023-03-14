//Libraries
import { useEffect, useState } from "react";
//Components
import RO_Form from "@/components/ro_form";
import RO_Table from "@/components/ro_records_table";
import Records_Comparison_Table from "@/components/ro_records_compare_table";
//Styles
import ro_styles from '@/styles/ro_page_styles.module.scss';

export async function getServerSideProps(){
    try {
        let ro_records = await fetch('http://localhost:3000/api/ro_records_read');
        let ro_json = await ro_records.json();
        return ({props: {selected_records: ro_json}})
    } catch (error) {
        console.error(`There was an error fetching the selected records: ${error}`);
        return ({props: {selected_records: null}})
        
    }
}

export default function ROs({selected_records}){
    const [selectedRecords, setSelectedRecords ] = useState(selected_records)
    const [newestRecord, setNewestRecord] = useState();
    const[canCompare, setCanCompare] = useState(false)
    const [comparisonRecords, setComparisonRecords] = useState([]);

    useEffect(()=>{
        async function getRecords(){
            try {
                let ro_records = await fetch('http://localhost:3000/api/ro_records_read');
                let ro_json = await ro_records.json();
                setSelectedRecords(ro_json);
            } catch (error) {
                console.error(`There was an error fetching the selected records: ${error}`);
            }
        }
        getRecords();
    },[newestRecord])

    return (
        <>
        <div className={ro_styles.ro_form_container}>
        <RO_Form updateTable={setNewestRecord}/>
        </div>
        {selected_records &&
        <RO_Table selectedRecords={selectedRecords} newestRecord={newestRecord} setComparisonRecords={setComparisonRecords}/>
        }
        {selectedRecords &&
        <Records_Comparison_Table comparisonRecords={comparisonRecords}/>
        }
        </>
    )
}