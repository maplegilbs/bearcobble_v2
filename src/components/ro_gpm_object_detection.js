//Hooks
import { useState } from "react";

function BoundingBox({ x, y, width, height, type, detection_id }) {
    return (
      <div
        style={{ fontSize: ".7rem", zIndex: 100, position: "absolute", top: `${y - height / 2}px`, left: `${x - width / 2}px`, border: `2px solid ${type === "sight_glass" ? "red" : "blue"}`, height: `${height}px`, width: `${width}px` }}>
        {type}
      </div>
    )
  }
  
  export default function SightGlassObjectDetection () {
    const [myImage, setMyImage] = useState({ dataType: null, imageData: null })
    const [detections, setDetections] = useState(null)
  
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
  
    if (detections) {
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
        console.log(detectionPair, gpmCalc(pairedDetections[detectionPair].sight_glass.y, pairedDetections[detectionPair].sight_glass.height, pairedDetections[detectionPair].float.y, pairedDetections[detectionPair].float.height))
      }
    }
  
  
    let handleChange = async (e) => {
      let selectedFile = e.target.files[0];
      setMyImage({ dataType: 'file', imageData: selectedFile })
    }
  
  
    let handleSubmit = async (e) => {
      let formData = new FormData();
      formData.append("image", myImage.imageData)
      e.preventDefault()
    //   try {
    //     let response = await fetch("http://localhost:3001/process", {
    //       method: "POST",
    //       body: formData
    //     })
    //     let data = await response.json();
    //     setMyImage({dataType: 'base64', imageData: data.image})
    //     console.log(data.predictions)
    //     setDetections(data.predictions)
    //   } catch (error) {
    //     console.log(error)
    //   }
    }
  
    return (
      <div>
        <form onSubmit={handleSubmit} style={{ height: "50px" }}>
          <input type="file" id="imageUpload" name="imageUpload" accept='image/jpg, image/png, image/jpeg' onChange={handleChange}></input>
          <button type="submit">Calculate</button>
        </form>
        <div style={{ margin: 0, padding: 0, position: "relative", width: "max-content" }}>
          {myImage.imageData &&
            <img src={myImage.dataType === 'file' ? URL.createObjectURL(myImage.imageData) : `data:image/jpeg;base64, ${myImage.imageData}`} />
          }
          {detections &&
            detections.map(detection => {
              return (
                <BoundingBox x={detection.x} y={detection.y} width={detection.width} height={detection.height} type={detection.class} detection_id={detection.detection_id} />
              )
            })
          }
        </div>
      </div>
    );
  }