const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configuring my cloudinary account here.
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_KEY,
    api_secret:process.env.CLOUDINARY_SECRET,
});

// Configuring cloudinary storage
const storage=new CloudinaryStorage({
    params:{
        folder:'YelpCamp',
        allowedFormats:['png','jpg','jpeg'],
    },
    cloudinary:cloudinary,
});

module.exports={cloudinary,storage};