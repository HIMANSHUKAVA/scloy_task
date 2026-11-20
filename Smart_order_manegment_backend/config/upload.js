import multer from "multer";
import path from "path";

const setup = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/products/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const sp = multer({ storage: setup });

export default sp;