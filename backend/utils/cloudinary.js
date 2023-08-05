const cloudinary = require('cloudinary').v2;
const catchAsync = require('./catchAsync');

const configureCloudinary = catchAsync(async (req, res, next) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  next();
});

const uploadFileToCloudinary = async (file, fieldName) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file.path, (error, result) => {
      if (error) {
        throw new AppError("This image couldn't be uploaded", 400);
        reject(error);
      } else {
        resolve({
          fieldName: fieldName,
          url: result.secure_url,
        });
      }
    });
  });
};

const deleteImageCloudinary = async (imageUrl) => {
  try {
    // Extract the public ID of the image from its URL
    const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0];

    // Delete the image from Cloudinary
    cloudinary.uploader
      .destroy(publicId, { resource_type: 'image' })
      .catch((err) => {
        console.error('Error deleting image:', err);
        throw new AppError("This image couldn't be deleted", 400);
      });
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  configureCloudinary,
  uploadFileToCloudinary,
  deleteImageCloudinary,
};
