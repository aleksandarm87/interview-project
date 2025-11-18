"use client";

import { useState } from "react";

export default function Home() {
  const [fileName, setFileName] = useState("");
  const [content, setContent] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Image upload states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const generateFile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate-files", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileName, content }),
      });

      const data = await response.json();

      if (data.success) {
        setFileUrl(data.filePath);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setUploadedImageUrl(`/api/images/${data.imageName }`);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
     

      {/* Image uploader */}
      <div className="p-4 border rounded">
        <h2 className="text-xl font-semibold mb-3">Upload Image</h2>
        <form onSubmit={uploadImage} className="space-y-4">
          <div>
            <label htmlFor="image" className="block mb-1">
              Select Image
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {imagePreview && (
            <div className="mt-2">
              <p className="mb-1">Preview:</p>
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-40 rounded"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isUploading || !imageFile}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {isUploading ? "Uploading..." : "Upload Image"}
          </button>
        </form>
        {uploadedImageUrl && (
          <div className="mt-4 p-3 bg-green-100 rounded">
            <p>Image uploaded successfully!</p>
            <div className="mt-2">
              <img
                src={uploadedImageUrl}
                alt="Uploaded image"
                className="max-h-60 rounded"
              />
            </div>
            <a
              href={uploadedImageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline block mt-2"
            >
              View Full Image
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
