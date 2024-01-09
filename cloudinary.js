const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
// env file
require('dotenv').config();

// cloudinary config
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET, 
  });

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'LisingImages',
      allowerdFormat:['jpg,png,jpeg'], // supports promises as well
      public_id: (req, file) => 'computed-filename-using-request',
    },
  });

    module.exports={
        cloudinary,
        storage
    }