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

const uploadImage = async (req, res) => {
  const { id } = req.params;
  try {
    if (!req.file) return res.status(400).json({ error: "No File Uploaded" });
    const filePath = `../../upload/${req.file.filename}`;
    const updateImage = await Email.findByIdAndUpdate(id, {
      images: [...images, filePath],
    });
    return res.status(200).json({
      message: "Images update Successfully",
      data: updateImage,
      imageUrl: filePath,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const uploadEmailConfig = async (req, res) => {
  try {
    const { title, content, footer } = req.body;
    const { images } = req.files;
    if (!images) {
      return res.status(400).json({ erorr: "Image is required " });
    }
    const avatar = await uploadOnCloudinary(images[0].path);
    const avatarPath = avatar.url;
    console.log(images[0].path);

    if (!title && !content)
      return res.status(400).json({ error: "title and content are required" });
    const emailConfig = await Email.create({
      title,
      content,
      footer,
      images: avatarPath,
    });
    return res
      .status(201)
      .json({ messge: "Email Config Created Successfully", data: emailConfig });
  } catch (error) {
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

const renderAndDownloadTemplate = async (req, res) => {
  const { title, content, footer } = req.body;
  console.log({ title, content, footer });
  const { images } = req.files;
  if (!images) {
    return res.status(400).json({ erorr: "Image is required " });
  }
  const avatar = await uploadOnCloudinary(images[0].path);
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const layoutPath = path.join(__dirname, "../../public/layout.html");
  const avatarPath = avatar.url;
  fs.readFile(layoutPath, "utf-8", (err, template) => {
    if (err)
      return res
        .status(500)
        .json({ error: `Failed to render the template , ${err}` });

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
