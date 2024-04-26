//Hooks
import { useState, useRef, useEffect } from "react";
//Util Functions
import { gpmCalc } from "@/utils/gpmCalculator";
//Styles
// import ro_styles from '../styles/ro_page_styles.module.scss'
import styles from './ro_gpm_object_detection.module.scss'

// const tempDetections =
//   [
//     {
//       x: 791,
//       y: 358.5,
//       width: 60,
//       height: 221,
//       confidence: 0.9350905418395996,
//       class: 'sight_glass',
//       class_id: 1,
//       detection_id: '99112574-7df5-4a8f-8d2e-5fc1ec415ace'
//     },
//     {
//       x: 501.5,
//       y: 356,
//       width: 41,
//       height: 218,
//       confidence: 0.9298211336135864,
//       class: 'sight_glass',
//       class_id: 1,
//       detection_id: 'b8d49bfa-74ea-4429-8a76-c4956812c83e'
//     },
//     {
//       x: 598,
//       y: 357.5,
//       width: 44,
//       height: 219,
//       confidence: 0.9271270036697388,
//       class: 'sight_glass',
//       class_id: 1,
//       detection_id: '96243653-4daf-4153-a961-7efb6cfda3fd'
//     },
//     {
//       x: 219.5,
//       y: 353.5,
//       width: 57,
//       height: 219,
//       confidence: 0.9247042536735535,
//       class: 'sight_glass',
//       class_id: 1,
//       detection_id: '47a96305-4eb7-4309-bee7-ab7929c9c49c'
//     },
//     {
//       x: 693.5,
//       y: 358,
//       width: 53,
//       height: 220,
//       confidence: 0.9194225668907166,
//       class: 'sight_glass',
//       class_id: 1,
//       detection_id: '1504c523-e0b6-4102-aafb-a0675aeef587'
//     },
//     {
//       x: 889,
//       y: 359,
//       width: 66,
//       height: 222,
//       confidence: 0.9109989404678345,
//       class: 'sight_glass',
//       class_id: 1,
//       detection_id: '7eca6d68-37bb-48ba-9991-b1ddfbc156ed'
//     },
//     {
//       x: 124,
//       y: 351.5,
//       width: 62,
//       height: 217,
//       confidence: 0.9027159214019775,
//       class: 'sight_glass',
//       class_id: 1,
//       detection_id: '765f060f-4ff0-4b3f-b88c-c1ba767376b3'
//     },
//     {
//       x: 315.5,
//       y: 353.5,
//       width: 55,
//       height: 217,
//       confidence: 0.901042103767395,
//       class: 'sight_glass',
//       class_id: 1,
//       detection_id: 'df119262-bf69-4e31-ab35-37ed35fc793f'
//     },
//     {
//       x: 408,
//       y: 354,
//       width: 48,
//       height: 218,
//       confidence: 0.8962105512619019,
//       class: 'sight_glass',
//       class_id: 1,
//       detection_id: '3345cafc-53f4-48a4-83cf-fd7b082215a7'
//     },
//     {
//       x: 794,
//       y: 407.5,
//       width: 18,
//       height: 45,
//       confidence: 0.8360855579376221,
//       class: 'float',
//       class_id: 0,
//       detection_id: 'f84c0eba-4e25-4ce0-b785-a1ad42554d12'
//     },
//     {
//       x: 893.5,
//       y: 400,
//       width: 19,
//       height: 44,
//       confidence: 0.8242084980010986,
//       class: 'float',
//       class_id: 0,
//       detection_id: '863bafd0-c63e-4e3d-8f45-7374b4330a73'
//     },
//     {
//       x: 501.5,
//       y: 404.5,
//       width: 17,
//       height: 39,
//       confidence: 0.8226799964904785,
//       class: 'float',
//       class_id: 0,
//       detection_id: '1a8f0d60-9ae2-4e09-8cbd-7ec92f8c420a'
//     },
//     {
//       x: 119,
//       y: 357.5,
//       width: 18,
//       height: 41,
//       confidence: 0.7976651787757874,
//       class: 'float',
//       class_id: 0,
//       detection_id: '2df3e42e-81ea-46fd-bd5d-4747d2b2f88f'
//     },
//     {
//       x: 407,
//       y: 396,
//       width: 18,
//       height: 40,
//       confidence: 0.796143651008606,
//       class: 'float',
//       class_id: 0,
//       detection_id: '14eca8a0-5659-4dac-9c37-9015e1465b45'
//     },
//     {
//       x: 214,
//       y: 400.5,
//       width: 18,
//       height: 41,
//       confidence: 0.7912362813949585,
//       class: 'float',
//       class_id: 0,
//       detection_id: 'b5a5f76a-534e-4a10-b5a4-97c2dac2c1cc'
//     },
//     {
//       x: 694,
//       y: 395.5,
//       width: 18,
//       height: 43,
//       confidence: 0.7870931029319763,
//       class: 'float',
//       class_id: 0,
//       detection_id: 'c22b3ac7-333e-4c71-aa55-e88e3395ba43'
//     },
//     {
//       x: 598.5,
//       y: 403.5,
//       width: 17,
//       height: 41,
//       confidence: 0.7739489674568176,
//       class: 'float',
//       class_id: 0,
//       detection_id: '7ec30b12-b026-4b36-b2db-3e6186773aed'
//     },
//     {
//       x: 311.5,
//       y: 406.5,
//       width: 17,
//       height: 41,
//       confidence: 0.7698463201522827,
//       class: 'float',
//       class_id: 0,
//       detection_id: 'd721f1ad-3cd0-40ad-8495-35caabdb165c'
//     }
//   ]

function BoundingBox({ x, y, width, height, type, sightGlassImgRef, detectionID }) {
    let resizeFactor = sightGlassImgRef.current.clientWidth / 2000
    return (
        <div key={detectionID} style={{ fontSize: ".7rem", zIndex: 100, position: "absolute", top: `${(y - height / 2) * resizeFactor}px`, left: `${(x - width / 2) * resizeFactor}px`, border: `2px solid ${type === "sight_glass" ? "red" : "blue"}`, height: `${height * resizeFactor}px`, width: `${width * resizeFactor}px` }}>
        </div>
    )
}

export default function SightGlassObjectDetection({ setFormValues }) {
    const [myImage, setMyImage] = useState({ dataType: null, imageData: null })
    const [detections, setDetections] = useState(null)
    const sightGlassImgRef = useRef(null)

    const membraneOrder = ["concentrate", 7, 5, 3, 1, 2, 4, 6, 8];
    let pairedDetections = {
        concentrate: {},
        1: {},
        2: {},
        3: {},
        4: {},
        5: {},
        6: {},
        7: {},
        8: {},
    }
    useEffect(() => {
        if (detections) {
            let gpmValues = {}
            let sortedDetections = detections.sort((a, b) => a.x - b.x)
            let sortedFloats = sortedDetections.filter(detection => detection.class === "float")
            let sortedSightGlasses = sortedDetections.filter(detection => detection.class === "sight_glass")
            sortedFloats.forEach((floatDetection, index) => {
                pairedDetections[membraneOrder[index]].float = floatDetection;
            })
            sortedSightGlasses.forEach((sightGlassDetection, index) => {
                pairedDetections[membraneOrder[index]].sight_glass = sightGlassDetection;
            })
            for (let detectionPair in pairedDetections) {
                // console.log(detectionPair, gpmCalc(pairedDetections[detectionPair].sight_glass.y, pairedDetections[detectionPair].sight_glass.height, pairedDetections[detectionPair].float.y, pairedDetections[detectionPair].float.height))
                if (detectionPair === 'concentrate') {
                    gpmValues[`conc_flow`] = gpmCalc(pairedDetections[detectionPair].sight_glass.y, pairedDetections[detectionPair].sight_glass.height, pairedDetections[detectionPair].float.y, pairedDetections[detectionPair].float.height)
                }
                else {
                    gpmValues[`membrane_${detectionPair}`] = gpmCalc(pairedDetections[detectionPair].sight_glass.y, pairedDetections[detectionPair].sight_glass.height, pairedDetections[detectionPair].float.y, pairedDetections[detectionPair].float.height)
                }
            }
            setFormValues(prev => {
                let updatedValues = {
                    ...prev,
                    ...gpmValues
                }
                return updatedValues
            })
        }
    }, [detections])
console.log(detections)

    let handleChange = async (e) => {
        let selectedFile = e.target.files[0];
        setMyImage({ dataType: 'file', imageData: selectedFile })
    }


    let handleSubmit = async (e) => {
        let formData = new FormData();
        formData.append("image", myImage.imageData)
        e.preventDefault()
        try {
            let response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/flow_calculation`, {
                method: "POST",
                body: formData
            })
            let data = await response.json();
            setMyImage({ dataType: 'base64', imageData: data.image })
            console.log(data.predictions)
            setDetections(data.predictions)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className={`${styles.image_upload_container}`}>
            <form onSubmit={e => handleSubmit(e)}>
                {myImage.imageData && <label className={`${styles.img_upload_label}`} htmlFor="imageUpload">Change Image</label>}
                <input className={`${styles.img_input}`} type="file" id="imageUpload" name="imageUpload" accept='image/jpg, image/png, image/jpeg' onChange={handleChange} />
                <div ref={sightGlassImgRef} className={`${styles.img_upload_div}`}>
                    {!myImage.imageData && <label className={`${styles.img_upload_label}`} htmlFor="imageUpload">Select Image</label>}
                    {myImage.imageData &&
                        <img src={myImage.dataType === 'file' ? URL.createObjectURL(myImage.imageData) : `data:image/jpeg;base64, ${myImage.imageData}`} />
                    }
                    {(detections && sightGlassImgRef.current) &&
                        detections.map(detection => <BoundingBox key={detection.detection_id} x={detection.x} y={detection.y} width={detection.width} height={detection.height} type={detection.class} sightGlassImgRef={sightGlassImgRef} detectionID={detection.detection_id} />)
                    }
                </div>
                <button className={`${styles.submit_button}`} type="submit" onClick={handleSubmit}>Interpolate Flows</button>
            </form>
        </div>
    );
}