const cloudinary = require('cloudinary').v2;

const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'coffee',
    allowedFormats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
  },
});

async function deleteFile(public_id) {
  try {
    const result = await cloudinary.uploader.destroy(public_id);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
}

module.exports = { cloudinary, storage, deleteFile };