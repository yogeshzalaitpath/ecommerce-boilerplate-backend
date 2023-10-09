const multer = require("multer");
const cloudinary = require("../config/cloudinary.config");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { fileNameGenerator } = require("../helpers/global.helper");

const profileFolder = "profiles";


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: (req, file) => {
      if (file.fieldname === "profile_image") {
        return profileFolder;
      }
    },
    public_id: (req, file) => {  
      const fieldNames=['first_name','last_name']
      const userName = fileNameGenerator(req.user,fieldNames);
      return `${userName}-${Date.now()}`;
    },
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/png", "image/jpg", "image/jpeg"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    return cb(new multer.MulterError("INVALID_FILE_TYPE"));
  }
};

const imageUpload = (limits) => {
  return multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: limits,
    },
  });
};

module.exports = {
  profileUpload: imageUpload(5 * 1024 * 1024), //5 MB limit for profile images
};
