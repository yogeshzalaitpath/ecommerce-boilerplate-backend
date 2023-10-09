const cloudinary = require("../config/cloudinary.config");

const extractPublicIdFromUrl = (url) => {
  const publicId = url.split("/").pop().split(".")[0];
  return publicId;
};

const deleteImageFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = {
  extractPublicIdFromUrl,
  deleteImageFromCloudinary,
};
