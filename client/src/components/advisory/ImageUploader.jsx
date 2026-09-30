import React, { useState, useRef } from "react";
import { UploadCloud, X, Image as ImageIcon, AlertCircle } from "lucide-react";
import { Button } from "../ui/Button.jsx";

export function ImageUploader({ file, onFileChange, error }) {
  const [preview, setPreview] = useState(null);
  const [localError, setLocalError] = useState(null);
  const inputRef = useRef(null);

  const handleFileSelect = (selectedFile) => {
    setLocalError(null);

    if (!selectedFile) {
      setPreview(null);
      onFileChange(null);
      return;
    }

    // Check MIME type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(selectedFile.type.toLowerCase())) {
      setLocalError("Only JPEG, PNG, and WebP images are supported.");
      return;
    }

    // Check size: max 5 MB
    const maxBytes = 5 * 1024 * 1024;
    if (selectedFile.size > maxBytes) {
      setLocalError("Image file size must be less than 5 MB.");
      return;
    }

    onFileChange(selectedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleRemove = () => {
    setPreview(null);
    setLocalError(null);
    onFileChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-stone-700 mb-1">
        Affected Plant / Leaf Photo (Optional)
      </label>
      <p className="text-xs text-stone-500 mb-2">
        Upload a clear close-up of the damage or lesion (JPEG, PNG, or WebP up to 5 MB).
      </p>

      {!preview ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-stone-300 hover:border-brand-600 bg-stone-50/60 hover:bg-stone-50 rounded-xl p-6 text-center cursor-pointer transition-colors"
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0])}
          />
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-3 text-stone-500">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-stone-800">
            Click to upload or drag and drop leaf photo
          </p>
          <p className="text-xs text-stone-400 mt-1">JPEG, PNG, or WebP up to 5 MB</p>
        </div>
      ) : (
        <div className="relative inline-block bg-white p-2.5 rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-3">
            <img
              src={preview}
              alt="Leaf condition preview"
              className="w-24 h-24 object-cover rounded-lg border border-stone-100"
            />
            <div className="text-xs space-y-1">
              <p className="font-semibold text-stone-800 flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-brand-700" />
                {file?.name || "Uploaded Image"}
              </p>
              <p className="text-stone-500">
                {(file?.size ? file.size / (1024 * 1024) : 0).toFixed(2)} MB
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-1 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={handleRemove}
                icon={X}
              >
                Remove photo
              </Button>
            </div>
          </div>
        </div>
      )}

      {(localError || error) && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 mt-1.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{localError || error}</span>
        </div>
      )}
    </div>
  );
}
