const File=require("../models/File");
const cloudinary=require("cloudinary").v2;
//localfileupload -->handler function

exports.localFileUpload =async(req,res)=>{
    try{
        //fetch file from request
        const file=req.files.file;
        console.log("FILE AAGYI JEE --> ",file);

        //server path wherever we want to store
        let path = __dirname + "/files/" + Date.now() + `.${file.name.split('.')[1]}}`;
        console.log("PATH-->" ,path);

        //add path to the move function
        file.mv(path,(err)=>{
            console.log(err);
        });

        res.json({
            success:true,
            message:'Local file uploaded successfully',
        })
    }
    catch(error){
        console.log('Not able to upload the file on server')
        console.log(error);
    }
}
function isFileTypeSupported(type,supportedTypes){
    return supportedTypes.includes(type);
}

async function uploadFileToCloudinary(file,folder,quality){
    const options={folder}
    console.log("temp File Path",file.tempFilePath);

    if(quality){
        options.quality=quality;
    }
    options.resource_type="auto";//to automatically detect file type as auto
    return await cloudinary.uploader.upload(file.tempFilePath,options);
}
//image upload handler
exports.imageUpload=async(req,res)=>{
    try{
        //data fetch
        const {name,tags,email}=req.body;
        console.log(name,tags,email);

        const file=req.files.imageFile;
        console.log(file);

        //validation
        const supportedTypes=["jpg","jpeg","png"];
        const fileType=file.name.split('.')[1].toLowerCase();
        console.log("File type",fileType)

        if(!isFileTypeSupported(fileType,supportedTypes)){
            return res.status(400).json({
                success:false,
                message:"File format not supported",
            })
        }

        //file format supported
        console.log("Uploading to codehelp")
        const response=await uploadFileToCloudinary(file,"codehelp");

        console.log(response);
        // create entry in db
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url,
        });

        
        res.json({
            success:true,
            imageUrl:response.secure_url,
            message:'Image upload successfully',
        })
    }
    catch(error){
        res.status(400).json({
            success:false,
            message:'Somthing went wrong',
        });
    }
}

//video upload ka handler

exports.videoUpload=async(req,res)=>{
    try{
        //data fetch
         //data fetch
         const {name,tags,email}=req.body;
         console.log(name,tags,email);

         const file=req.files.videoFile;
        console.log(file);

        //validation

        const supportedTypes=["mp3","mov"];
        const fileType=file.name.split('.')[1].toLowerCase();
        console.log("File type",fileType);

        //TODO:add a upper limit of 5mb for videos
        if(!isFileTypeSupported(fileType,supportedTypes)){
            return res.status(400).json({
                success:false,
                message:"File format not supported",
            })
        }

        //file format supported
        console.log("Uploading to codehelp")
        const response=await uploadFileToCloudinary(file,"codehelp");

        console.log(response);
        // create entry in db
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url,
        });

        
        res.json({
            success:true,
            imageUrl:response.secure_url,
            message:'Video upload successfully',
        })
    }
    catch(error){
        res.status(400).json({
            success:false,
            message:"Something went wrong",
        })
    }
}


//image size reducer
exports.imageSizeReducer=async(req,res)=>{
   
        try{
            //data fetch
            const {name,tags,email}=req.body;
            console.log(name,tags,email);
    
            const file=req.files.imageFile;
            console.log(file);
    
            //validation
            const supportedTypes=["jpg","jpeg","png"];
            const fileType=file.name.split('.')[1].toLowerCase();
            console.log("File type",fileType);

            //TODO:apply limitation of 5mb
            if(!isFileTypeSupported(fileType,supportedTypes)){
                return res.status(400).json({
                    success:false,
                    message:"File format not supported",
                })
            }
    
            //file format supported
            console.log("Uploading to codehelp")
            const response=await uploadFileToCloudinary(file,"codehelp",30);
            console.log(response);
            // create entry in db
            const fileData = await File.create({
                name,
                tags,
                email,
                imageUrl:response.secure_url,
            });
    
            
            res.json({
                success:true,
                imageUrl:response.secure_url,
                message:'Image upload successfully',
            })
        }
        catch(error){
            res.status(400).json({
                success:false,
                message:'Somthing went wrong',
            });
        }
}