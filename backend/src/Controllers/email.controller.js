import fs from "fs";
import { Email } from "../Models/email.model.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
const getEmailLayout = (_, res) => {
  try {
    const layoutPath = path.join(__dirname, "../public/layout.html");
    fs.readFile(layoutPath, "utf-8", (err, data) => {
      if (err) return res.status(500).json({ error: "Failed to fetch layout" });
      return res.json({ html: data });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// const uploadImage = async (req, res) => {
//   const { id } = req.params;
//   try {
//     if (!req.file) return res.status(400).json({ error: "No File Uploaded" });
//     const filePath = `../../upload/${req.file.filename}`;
//     const updateImage = await Email.findByIdAndUpdate(id, {
//       images: [...images, filePath],
//     });
//     return res.status(200).json({
//       message: "Images update Successfully",
//       data: updateImage,
//       imageUrl: filePath,
//     });
//   } catch (error) {
//     res.status(500).json({ error });
//   }
// };

// const uploadEmailConfig = async (req, res) => {
//   try {
//     const { title, content, footer } = req.body;
//     const { images } = req.files;
//     if (!images) {
//       return res.status(400).json({ erorr: "Image is required " });
//     }
//     const avatar = await uploadOnCloudinary(images[0].path);
//     const avatarPath = avatar.url;

//     if (!title && !content)
//       return res.status(400).json({ error: "title and content are required" });
//     const emailConfig = await Email.create({
//       title,
//       content,
//       footer,
//       images: avatarPath,
//     });
//     return res
//       .status(201)
//       .json({ messge: "Email Config Created Successfully", data: emailConfig });
//   } catch (error) {
//     res.status(500).json({ error: "Error while creating Email Config" });
//   }
// };

const uploadEmailConfig = async (req, res) => {
  try {
    const { title, content, footer } = req.body;
    const images = req.files.images;

    if (!images || !images[0]) {
      return res.status(400).json({ error: "Image is required" });
    }

    const fileBuffer = images[0].buffer;

    // Upload the file to Cloudinary
    const uploadResponse = await new Promise((resolve, reject) => {
      const stream = require("stream");
      const readableStream = new stream.PassThrough();
      readableStream.end(fileBuffer);

      cloudinary.uploader.upload_stream(
        { folder: "uploads", resource_type: "auto" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      readableStream.pipe(uploadResponse);
    });

    const avatarPath = uploadResponse.secure_url;

    if (!title && !content)
      return res.status(400).json({ error: "Title and content are required" });

    const emailConfig = await Email.create({
      title,
      content,
      footer,
      images: avatarPath,
    });

    res.status(201).json({
      message: "Email Config Created Successfully",
      data: emailConfig,
    });
  } catch (error) {
    console.error("Error while creating Email Config:", error);
    res.status(500).json({ error: "Error while creating Email Config" });
  }
};

const updateEmailConfig = async (req, res) => {
  const { id } = req.params;
  const EmailConfig = await Email.findById(id);
  if (!EmailConfig) {
    return res
      .status(400)
      .json({ message: "No Email Config found with the given id" });
  }
  try {
    const updatedEmailConfig = await Email.findByIdAndUpdate(id, req.body);
    return res.status(200).json({
      message: "Email Configuration updated Successfully",
      data: updatedEmailConfig,
    });
  } catch (error) {
    return res.status(500).json({ error: "Error updating the email Config" });
  }
};

// const renderAndDownloadTemplate = async (req, res) => {
//   const { title, content, footer } = req.body;
//   const { images } = req.files;
//   if (!images) {
//     return res.status(400).json({ erorr: "Image is required " });
//   }
//   const avatar = await uploadOnCloudinary(images[0].path);
//   const __filename = fileURLToPath(import.meta.url);
//   const __dirname = dirname(__filename);
//   const layoutPath = path.join(__dirname, "../../public/layout.html");
//   const avatarPath = avatar.url;
//   fs.readFile(layoutPath, "utf-8", (err, template) => {
//     if (err)
//       return res
//         .status(500)
//         .json({ error: `Failed to render the template , ${err}` });

//     const renderedHtml = template
//       .replace("{{title}}", title)
//       .replace("{{content}}", content)
//       .replace("{{footer}}", footer)
//       .replace("{{image}}", avatarPath || "");

//     res.setHeader("Content-Type", "text/html");
//     res.send(renderedHtml);
//   });
// };

const renderAndDownloadTemplate = async (req, res) => {
  const { title, content, footer } = req.body;
  const images = req.files.images;

  if (!images || !images[0]) {
    return res.status(400).json({ error: "Image is required" });
  }

  const fileBuffer = images[0].buffer;

  const avatar = await new Promise((resolve, reject) => {
    const stream = require("stream");
    const readableStream = new stream.PassThrough();
    readableStream.end(fileBuffer);

    cloudinary.uploader.upload_stream(
      { folder: "uploads", resource_type: "auto" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    readableStream.pipe(uploadResponse);
  });

  const avatarPath = avatar.secure_url;

  // Proceed with rendering the template as before
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const layoutPath = path.join(__dirname, "../../public/layout.html");

  fs.readFile(layoutPath, "utf-8", (err, template) => {
    if (err)
      return res
        .status(500)
        .json({ error: `Failed to render the template: ${err}` });

    const renderedHtml = template
      .replace("{{title}}", title)
      .replace("{{content}}", content)
      .replace("{{footer}}", footer)
      .replace("{{image}}", avatarPath || "");

    res.setHeader("Content-Type", "text/html");
    res.send(renderedHtml);
  });
};

export {
  getEmailLayout,
  uploadImage,
  uploadEmailConfig,
  updateEmailConfig,
  renderAndDownloadTemplate,
};
