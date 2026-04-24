import React, { useState, Suspense } from "react";
import Docs_Create_Qr from "./Docs-Create-Qr";

const Docs_Read_Qr = React.lazy(() => import('./Docs-Read-Qr'));

export default function ApiDocs() {
  const [activeTab, setActiveTab] = useState("create");
  const [copied, setCopied] = useState("");
  const [codeTab, setCodeTab] = useState("cURL");

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(""), 1500);
  };



  return (
    <div className="min-h-screen px-4 py-10 mt-2.5">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-[31px] tracking-tight md:text-[38px] font-bold text-gray-800">
            API Reference
          </h1>
          <p className="text-gray-500 text-lg mt-1.5">
            Build powerful QR code functionality into your applications
            with our comprehensive REST API.
          </p>
        </div>

        {/* TABS */}
        <div className="flex justify-center gap-8 border-b border-gray-200 mb-8">

          {/* CREATE TAB */}
          <button
            onClick={() => setActiveTab("create")}
            className={`flex items-center gap-2 pb-3 text-sm font-medium md:text-[16px]  transition-all ${activeTab === "create"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
              }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              className="w-5 h-5 md:h-6 md:w-6"
              fill="currentColor"
            >
              <path d="M120-520v-320h320v320H120Zm80-80h160v-160H200v160Zm-80 480v-320h320v320H120Zm80-80h160v-160H200v160Zm320-320v-320h320v320H520Zm80-80h160v-160H600v160Zm160 480v-80h80v80h-80ZM520-360v-80h80v80h-80Zm80 80v-80h80v80h-80Zm-80 80v-80h80v80h-80Zm80 80v-80h80v80h-80Zm80-80v-80h80v80h-80Zm0-160v-80h80v80h-80Zm80 80v-80h80v80h-80Z" />
            </svg>
            Create QR Code
          </button>

          {/* READ TAB */}
          <button
            onClick={() => setActiveTab("read")}
            className={`flex items-center gap-2 pb-3 text-sm md:text-[16px] font-medium transition-all ${activeTab === "read"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
              }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              className="w-5 h-5 md:h-6 md:w-6"
              fill="currentColor"
            >
              <path d="M80-680v-200h200v80H160v120H80Zm0 600v-200h80v120h120v80H80Zm600 0v-80h120v-120h80v200H680Zm120-600v-120H680v-80h200v200h-80ZM700-260h60v60h-60v-60Zm0-120h60v60h-60v-60Zm-60 60h60v60h-60v-60Zm-60 60h60v60h-60v-60Zm-60-60h60v60h-60v-60Zm120-120h60v60h-60v-60Zm-60 60h60v60h-60v-60Zm-60-60h60v60h-60v-60Zm240-320v240H520v-240h240ZM440-440v240H200v-240h240Zm0-320v240H200v-240h240Zm-60 500v-120H260v120h120Zm0-320v-120H260v120h120Zm320 0v-120H580v120h120Z" />
            </svg>
            Read QR Code
          </button>
        </div>

        <div>
          <Docs_Create_Qr codeTab={codeTab} setCodeTab={setCodeTab} setCopied={setCopied} copied={copied} activeTab={activeTab} setActiveTab={setActiveTab} copyToClipboard={copyToClipboard} />
        </div>

        {/* READ QR CARD */}
        <div>
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="flex flex-col items-center gap-4 bg-white shadow-md rounded-3xl p-6 sm:p-8">

              {/* Spinner */}
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

              {/* Text */}
              <h1 className="text-lg sm:text-xl font-semibold text-gray-700 text-center">
                Loading....
              </h1>

              {/* Sub text */}
              <p className="text-sm text-gray-500 text-center">
                Please wait while we process your QR code
              </p>
            </div>
          </div>}>
            <Docs_Read_Qr codeTab={codeTab} setCodeTab={setCodeTab} setCopied={setCopied} copied={copied} activeTab={activeTab} setActiveTab={setActiveTab} copyToClipboard={copyToClipboard} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}