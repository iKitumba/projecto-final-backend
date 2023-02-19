const multer = require("multer");
const path = require("node:path");
const crypto = require("node:crypto");

const IMAGE_TYPES = ["image/png", "image/jpeg", "image/pjpeg"];

const uploadPath = (mimetype) => {
  if (IMAGE_TYPES.includes(mimetype)) {
    return path.resolve(__dirname, "..", "..", "uploads", "profile");
  } else {
    return new Error("Invalid file type");
  }
};

const successOrErrorResult = (mimetype) => {
  const errorResult =
    uploadPath(mimetype) instanceof Error ? uploadPath(mimetype) : null;
  const successResult =
    uploadPath(mimetype) instanceof Error ? null : uploadPath(mimetype);

  return { errorResult, successResult };
};

module.exports = {
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const result = successOrErrorResult(file.mimetype);
      cb(result.errorResult, result.successResult);
    },
    filename: (req, file, cb) => {
      const hash = crypto.randomUUID();
      const ext = path.extname(file.originalname);
      const fileName = hash + ext;

      cb(null, fileName);
    },
  }),
  fileFilter: (req, file, cb) => {
    const result = successOrErrorResult(file.mimetype);
    cb(result.errorResult, result.successResult);
  },
  limits: {
    fileSize: 13 * 1024 * 1024,
  },
};
