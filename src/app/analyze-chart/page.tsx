"use client";

import { useState } from "react";
import { FiCopy, FiUpload, FiDownload, FiX } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AnalyzeChart() {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
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
    setAnalysis(null);
    toast.info("Session cleared successfully");
  };

  const handleCopy = () => {
    if (analysis) {
      navigator.clipboard.writeText(analysis);
      toast.success("Analysis copied to clipboard!");
    }
  };

  const handleDownload = () => {
    if (analysis) {
      const blob = new Blob([analysis], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "chart-analysis.txt";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Analysis downloaded successfully!");
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

      const response = await fetch("/api/analyze-chart", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        // Handle the "no flowchart/table" case as an informational message
        if (data.error.includes("doesn't contain a recognizable flowchart")) {
          toast.info(data.error);
        } else {
          throw new Error(data.error);
        }
      } else {
        setAnalysis(data.analysis);
        toast.success("Analysis completed successfully!");
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "An error occurred during analysis");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Chart Image Analysis</h1>
        <p className="text-xl text-gray-600">
          Upload any chart image and get detailed data science insights
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Preview Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Chart Preview</h2>
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
                alt="Uploaded chart"
                className="w-full h-auto rounded-lg"
              />
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-500">No chart uploaded yet</p>
            </div>
          )}
        </div>

        {/* Analysis Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Upload Chart Image
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
                  <span className="animate-pulse">Analyzing...</span>
                ) : (
                  "Analyze Chart"
                )}
              </button>
              <button
                type="button"
                onClick={handleClear}
                disabled={!file && !analysis}
                className="w-1/3 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 disabled:bg-gray-300"
              >
                Clear
              </button>
            </div>
          </form>

          {analysis && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Analysis Results</h2>
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
                    title="Download as text file"
                  >
                    <FiDownload className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="prose max-w-none bg-gray-50 p-4 rounded-lg">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {analysis}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 