"use client";

import { useState } from "react";
import { FiCopy, FiUpload, FiDownload, FiX } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

export default function FlowchartToCode() {
  const [file, setFile] = useState<File | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleClear = () => {
    setFile(null);
    setImagePreview(null);
    setCode(null);
    toast.info("Session cleared successfully");
  };

  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard!");
    }
  };

  const handleDownload = () => {
    if (code) {
      const blob = new Blob([code], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "flowchart_code.py";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Code downloaded successfully!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/flowchart-to-code", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        toast.info(data.error);
      } else {
        setCode(data.code);
        toast.success("Flowchart converted successfully!");
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "An error occurred during conversion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <ToastContainer />
      
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Flowchart to Python Code</h1>
        <p className="text-xl text-gray-600">
          Upload a flowchart image and get Python code implementation
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Preview Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Flowchart Preview</h2>
            <div className="flex items-center gap-2">
              <FiUpload className="w-6 h-6 text-gray-500" />
              {imagePreview && (
                <button
                  onClick={handleClear}
                  className="p-2 hover:bg-gray-100 rounded"
                  title="Clear session"
                >
                  <FiX className="w-5 h-5 text-gray-500" />
                </button>
              )}
            </div>
          </div>
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Uploaded flowchart"
                className="w-full h-auto rounded-lg"
              />
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-500">No flowchart uploaded yet</p>
            </div>
          )}
        </div>

        {/* Code Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Upload Flowchart Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading || !file}
                className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 flex items-center justify-center"
              >
                {isLoading ? (
                  <span className="animate-pulse">Converting...</span>
                ) : (
                  "Convert to Python Code"
                )}
              </button>
              <button
                type="button"
                onClick={handleClear}
                disabled={!file && !code}
                className="w-1/3 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 disabled:bg-gray-300"
              >
                Clear
              </button>
            </div>
          </form>

          {code && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Generated Python Code</h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 hover:bg-gray-100 rounded"
                    title="Copy to clipboard"
                  >
                    <FiCopy className="w-5 h-5 text-gray-500" />
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-2 hover:bg-gray-100 rounded"
                    title="Download as Python file"
                  >
                    <FiDownload className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="prose max-w-none bg-gray-50 p-4 rounded-lg">
                <SyntaxHighlighter language="python" style={atomOneDark}>
                  {code}
                </SyntaxHighlighter>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 