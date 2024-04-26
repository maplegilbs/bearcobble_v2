//Components
import Loader from "./loader";
//Hooks
import { useState, useRef, useEffect } from "react";
//Util Functions
import { gpmCalc } from "@/utils/gpmCalculator";
//Styles
import styles from './ro_gpm_object_detection.module.scss'

//Constants
const membraneOrder = ["concentrate", 7, 5, 3, 1, 2, 4, 6, 8];
const pairedDetections = {
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

function BoundingBox({ x, y, width, height, type, sightGlassImgRef, detectionID }) {
    let resizeFactor = sightGlassImgRef.current.clientWidth / 2000
    return <div key={detectionID} style={{ fontSize: ".7rem", zIndex: 100, position: "absolute", top: `${(y - height / 2) * resizeFactor}px`, left: `${(x - width / 2) * resizeFactor}px`, border: `2px solid ${type === "sight_glass" ? "red" : "blue"}`, height: `${height * resizeFactor}px`, width: `${width * resizeFactor}px` }}></div>
}

function LoadingScreen() {
    return (
        <div className={`${styles.loading_overaly}`}>
            <Loader loader_text={'Analyzing Image'} />
        </div>
    )
}

function FailureNotice(){
    return (
        <div className={`${styles.failure_overlay}`}>
            <h3>Image analysis failed to locate all necessary items.</h3>
            <label htmlFor="imageUpload">Retake Image</label>
            <h3>Try to take the image level and straight on with all sight glass elements visible.</h3>
        </div>
    )
}

//Given an image file and the maximum size, resize the image and set the myImage state to be the new resized image
function imageResize(imageFile, maxSize, setMyImage) {
    //Percent to multiple the current file size by to get it to fall below the max size
    let scalePercent = maxSize / imageFile.size;
    //Create new instance of a file reader
    const reader = new FileReader();
    //Once file has loaded
    reader.onload = function (event) {
        //Create new instance of Image
        const img = new Image();
        //Once the image has loaded via the setting of the img.src use the canvas element to resize
        img.onload = function () {
            //Create a new canvas, size the canvas to be the image size adjusted by our scaling percentage then draw the image to the canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            let width = Math.floor(img.width * scalePercent);
            let height = Math.floor(img.height * scalePercent);
            canvas.width = width;
            canvas.height = height;
            // Draw image on canvas
            ctx.drawImage(img, 0, 0, width, height);
            // Convert canvas to Blob
            canvas.toBlob(function (blob) {
                //Set the image data to be the blob
                setMyImage({ dataType: 'file', imageData: blob })
            }, imageFile.type);
        };
        //Set the image source to be the file loaded into the file reader
        img.src = event.target.result
    };
    reader.readAsDataURL(imageFile);
}

export default function SightGlassObjectDetection({ setFormValues }) {
    const [myImage, setMyImage] = useState({ dataType: null, imageData: null })
    const [detections, setDetections] = useState(null)
    const [loadingStatus, setLoadingStatus] = useState('success') //loading, success, failure
    const sightGlassImgRef = useRef(null)


    useEffect(() => {
        if (detections) {
            if (detections.length === 18) {
                let gpmValues = {}
                let sortedDetections = detections.sort((a, b) => a.x - b.x)
                let sortedFloats = sortedDetections.filter(detection => detection.class === "float")
                let sortedSightGlasses = sortedDetections.filter(detection => detection.class === "sight_glass")
                sortedFloats.forEach((floatDetection, index) => pairedDetections[membraneOrder[index]].float = floatDetection)
                sortedSightGlasses.forEach((sightGlassDetection, index) => pairedDetections[membraneOrder[index]].sight_glass = sightGlassDetection)
                for (let detectionPair in pairedDetections) {
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
                setLoadingStatus('success')
            }
            else {
                setLoadingStatus('failure')
            }
        }
    }, [detections])

    let handleChange = async (e) => {
        let selectedFile = e.target.files[0];
        //Max size for serverless functions used in API routes in Vercel
        let maxSize = 4.5 * 1000 * 1000;
        let curSize = selectedFile.size
        //if our selected file is larger than the maximum allowable upload for vercel resize it before sending it to the server
        if (curSize >= maxSize) {
            imageResize(selectedFile, maxSize, setMyImage)
        }
        else {
            setMyImage({ dataType: 'file', imageData: selectedFile })
        }
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
            setDetections(data.predictions)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            {loadingStatus === 'loading' && <LoadingScreen />}
            <div className={`${styles.image_upload_container}`}>
                <form onSubmit={e => { setLoadingStatus('loading'); handleSubmit(e) }}>
                    {myImage.imageData && <label className={`${styles.img_upload_label}`} htmlFor="imageUpload">Change Image</label>}
                    <input className={`${styles.img_input}`} type="file" id="imageUpload" name="imageUpload" accept='image/jpg, image/png, image/jpeg' onChange={handleChange} />
                    <div ref={sightGlassImgRef} className={`${styles.img_upload_div}`}>
                        {loadingStatus === 'failure' && <FailureNotice />}
                        {!myImage.imageData && <label className={`${styles.img_upload_label}`} htmlFor="imageUpload">Select Image</label>}
                        {myImage.imageData &&
                            <img src={myImage.dataType === 'file' ? URL.createObjectURL(myImage.imageData) : `data:image/jpeg;base64, ${myImage.imageData}`} />
                        }
                        {(detections && sightGlassImgRef.current) &&
                            detections.map(detection => <BoundingBox key={detection.detection_id} x={detection.x} y={detection.y} width={detection.width} height={detection.height} type={detection.class} sightGlassImgRef={sightGlassImgRef} detectionID={detection.detection_id} />)
                        }
                        {}
                    </div>
                    <button className={`${styles.submit_button}`} type="submit" onClick={e => { setLoadingStatus('loading'); handleSubmit(e) }}>Interpolate Flows</button>
                </form>
            </div>
        </>
    );
}