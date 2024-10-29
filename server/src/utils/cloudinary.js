import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return null;
        // upload file on clodinary
        const respone = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })
        // File has been uploaded successfully
        console.log("file is uploaded on cloudinary",respone);

        // Once upload file completed ,remove it from local storage
        // console.log("file is deleted")
        fs.unlinkSync(localFilePath) 
        console.log("file is deleted")
        return respone;
    }
    catch(error){
        fs.unlinkSync(localFilePath) //remove the locally saved temporary file as the upload operation got failed
        console.error("Error while uploading file on cloudinary: ", error);
        return null;
    }
}

export {uploadOnCloudinary}


