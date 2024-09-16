//Libraries
import { useEffect, useState, useRef } from "react";
//Components
import RO_Form from "@/components/ro_form";
import RO_Table from "@/components/ro_records_table";
import Records_Comparison_Table from "@/components/ro_records_compare_table";
import Comparison_Bar_Graph from "@/components/ro_records_compare_graph";
//Styles
import ro_styles from '@/styles/ro_page_styles.module.scss';

let ro_records_api_base_url = (process.env.NEXT_PUBLIC_BASE_URL + 'api/ro_records_read')

export async function getServerSideProps() {
    try {
        let ro_records = await fetch(ro_records_api_base_url);
        let ro_json = await ro_records.json();
        return ({ props: { selected_records: ro_json } })
    } catch (error) {
        console.error(`There was an error fetching the selected records: ${error}`);
        return ({ props: { selected_records: null } })
    }
}

export default function ROs({ selected_records }) {
    const [selectedRecords, setSelectedRecords] = useState(selected_records)
    const [recordFilterQuery, setRecordFilterQuery] = useState('');
    const [newestRecord, setNewestRecord] = useState();
    const [comparisonRecords, setComparisonRecords] = useState([]);
    const [isFilterDisplayed, setIsFilterDisplayed] = useState(false);
    const [actionOption, setActionOption] = useState('newRecord') // newRecord, viewRecords
    const formRef = useRef(null);
    const tableRef = useRef(null);
    const comparisonRef = useRef(null)

    useEffect(() => {
        async function getRecords() {
            try {
                let ro_records = await fetch(ro_records_api_base_url + recordFilterQuery);
                let ro_json = await ro_records.json();
                setSelectedRecords(ro_json);
            } catch (error) {
                console.error(`There was an error in fetching the selected records: ${error}`);
            }
        }
        getRecords();
    }, [newestRecord, recordFilterQuery])

    return (
        <>
            <div className={`${ro_styles.ro_button_container} ${isFilterDisplayed ? ro_styles.ro_button_container_back : ""}`}>
                <button type="button" className={`${ro_styles.ro_button} ${actionOption === 'newRecord' ? ro_styles.selected : ""}`} onClick={() => {setActionOption('newRecord'); setComparisonRecords([])}}>New Reading</button>
                <button type="button" className={`${ro_styles.ro_button} ${actionOption === 'viewRecords' ? ro_styles.selected : ""}`} onClick={() => setActionOption('viewRecords')}>View Records</button>
            </div>
            <div className={ro_styles.ro_main_container}>
                {actionOption === 'newRecord' &&
                    <div ref={formRef} className={ro_styles.ro_form_container}>
                        <RO_Form updateTable={setNewestRecord} />
                    </div>
                }
                {(selected_records && actionOption === 'viewRecords') &&
                    <div ref={tableRef} className={ro_styles.ro_table_container}>
                        <RO_Table
                            selectedRecords={selectedRecords}
                            newestRecord={newestRecord}
                            setComparisonRecords={setComparisonRecords}
                            recordFilterQuery={recordFilterQuery}
                            setRecordFilterQuery={setRecordFilterQuery}
                            isFilterDisplayed={isFilterDisplayed}
                            setIsFilterDisplayed={setIsFilterDisplayed}
                            comparisonRef={comparisonRef}
                        />
                    </div>
                }
            </div>
            <div ref={comparisonRef}>
                {selectedRecords &&
                    <Records_Comparison_Table comparison_records={comparisonRecords} />
                }
                {selectedRecords &&
                    <div className={`${comparisonRecords.length > 1 ? ro_styles.plotly_container : ''}`}>
                        <Comparison_Bar_Graph graph_data={comparisonRecords} />
                    </div>
                }
            </div>
        </>
    )
}