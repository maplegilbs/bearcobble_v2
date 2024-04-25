//Libraries
//Bring in the multer pacakge for handling form data containing file/image uploads
import multer from 'multer'
const upload = multer();
//Bring in the sharp package to handle image processing
import sharp from 'sharp'

export default async function (req, res) {
    //POST request.
    //  Use multer middleware to create a single req.file property with the name of 'image' (the name of the field in the form handling the image upload) containing the information of the uploaded file
    if (req.method === 'POST') {
        upload.single('image')(req, res, async function (err) {
            if(err){
                console.error(err)
                return res.status(500).json({error: 'Error occurred in image upload', message: err.message})
            }
            try {
                //Get buffer out of the uploaded file put into the request from multer
                const imageBuffer = req.file.buffer;
                //Use sharp to resize the buffer
                let sharpImage = await new sharp(imageBuffer)
                //Get the metadata of the input image and pull out the width and height
                let sharpImageInfo = await new sharp(imageBuffer).metadata()
                let inputImageWidth = sharpImageInfo.width;
                let inputImageHeight = sharpImageInfo.height;
                //Create a resized buffer of either 2000px height or width depending on which is greater
                let resizedImageBuffer = inputImageHeight > inputImageWidth ? await sharpImage.resize(null, 2000).toBuffer() : await sharpImage.resize(2000).toBuffer()
                // Base64 encode the image buffer for use by the roboflow API call
                const base64ResizedImage = resizedImageBuffer.toString('base64');
                let response = await fetch(`https://detect.roboflow.com/ro-flow-sight-glasses/1?api_key=${process.env.ROBOFLOW_API_KEY}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: base64ResizedImage
                })
                let data = await response.json();
                res.json({ predictions: data.predictions, image: base64ResizedImage })
            } catch (error) {
                console.log(error)
                res.status(500).json({ message: "Error" })
            }
        })
    }
}

