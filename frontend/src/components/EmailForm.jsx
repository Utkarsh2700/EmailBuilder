import React, { useState } from "react";
import { renderAndDownloadTemplate, saveEmailConfig } from "../api.js";
import PreviewModal from "./PreviewModal";

const EmailForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [footer, setFooter] = useState("");
  const [image, setImage] = useState();
  const [showPreview, setShowPreview] = useState("");
  const [previewHtml, setPreviewHtml] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handlePreview = async () => {
    const formdata = new FormData();
    formdata.append("images", image);
    formdata.append("title", title);
    formdata.append("content", content);
    formdata.append("footer", footer);
    setLoading(true);
    try {
      const { data } = await renderAndDownloadTemplate(formdata);
      setPreviewHtml(data);
      setShowPreview(true);
      setImage();
      setTitle("");
      setContent("");
      setFooter("");
    } catch (error) {
      console.error("Failed to generate preview:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("images", image);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("footer", footer);
    setLoading(true); // Start loading
    try {
      await saveEmailConfig(formData);
      alert("Email configuration saved successfully!");
    } catch (error) {
      console.error("Failed to save email config:", error);
      alert("Failed to save email configuration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="email-form">
      <h2>Build Your Email</h2>
      <div>
        <label htmlFor="">Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter email title"
        />
      </div>
      <div>
        <label htmlFor="">Content:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter email content"
        />
      </div>
      <div>
        <label htmlFor="">Footer:</label>
        <input
          value={footer}
          onChange={(e) => setFooter(e.target.value)}
          placeholder="Enter email footer"
        />
      </div>
      <div>
        <label>Upload Image:</label>
        <input type="file" onChange={(e) => handleImageUpload(e)} />
        {image && <p>Image uploaded: {image.name}</p>}
      </div>
      {/* loader */}
      {loading && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width={24}
          height={24}
          color={"#000000"}
          fill={"none"}
          className="spin-animation" // Add this class
        >
          <path
            d="M18.001 20C16.3295 21.2558 14.2516 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 12.8634 21.8906 13.7011 21.6849 14.5003C21.4617 15.3673 20.5145 15.77 19.6699 15.4728C18.9519 15.2201 18.6221 14.3997 18.802 13.66C18.9314 13.1279 19 12.572 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C13.3197 19 14.554 18.6348 15.6076 18"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )}

      <div className="buttons">
        <button onClick={handlePreview}>Preview</button>
        <button onClick={handleSave}>Save</button>
      </div>
      {showPreview && (
        <PreviewModal
          html={previewHtml}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};

export default EmailForm;
