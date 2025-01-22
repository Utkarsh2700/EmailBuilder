import { Router } from "express";
import multer from "multer";

// import path, { dirname } from "path";
// import { fileURLToPath } from "url";

const router = Router();

// Configuring Multer for file uploads

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./public");
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// Changes for Deployment

const storage = multer.memoryStorage();

const upload = multer({ storage });

import {
  uploadEmailConfig,
  updateEmailConfig,
  renderAndDownloadTemplate,
  uploadImage,
} from "../Controllers/email.controller.js";

router.route("/upload").post(
  upload.fields([
    {
      name: "images",
      // maxCount: 10,
    },
  ]),
  uploadEmailConfig
);
router
  .route("/uploadImage/:id")
  .post(upload.fields([{ name: "images" }]), uploadImage);

router.route("/update/:id").post(updateEmailConfig);
router
  .route("/renderAndDownloadTemplate")
  .post(upload.fields([{ name: "images" }]), renderAndDownloadTemplate);

export default router;
