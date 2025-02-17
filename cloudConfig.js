const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Check if environment variables are set
if (!process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY || !process.env.CLOUD_API_SECRET) {
    throw new Error('Cloudinary environment variables are not set');
}

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// Configure CloudinaryStorage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Trek_DEV', // Folder in Cloudinary where files will be stored
        allowed_formats: ['png', 'jpg', 'jpeg', 'avif'], // Allowed formats for upload
        // You can add more params here if needed, e.g., transformation, public_id, etc.
    },
});

module.exports = {
    cloudinary,
    storage
};