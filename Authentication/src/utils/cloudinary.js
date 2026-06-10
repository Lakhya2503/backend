import { v2 as cloudinary } from "cloudinary"
import dotenv from "dotenv";
import fs from "fs"

dotenv.config({
    path: "./.env" // Load environment variables from .env file
}); // Load environment variables from .env file


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return null
        }
        //upload file on cloudinary 
        
       const resonse =  await cloudinary.uploader.upload(localFilePath, {
           resource_type: "auto"
        })
        //file has been uploaded successfully
        // console.log("file is uploaded on cloudinary", resonse);
        fs.unlinkSync(localFilePath)
        return resonse;
    } catch (error) {
        fs.unlinkSync(localFilePath) //remove the locally saved temporary file as the upload operation got faild
    }
}

export { uploadOnCloudinary }
