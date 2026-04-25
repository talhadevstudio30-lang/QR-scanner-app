import React, { useState, Suspense } from "react";
import Docs_Header from "./Docs-Header";
import Docs_Create_Shadow from "./Shadow-Loaders/Docs-Create-Shadow";
const Docs_Create_Qr = React.lazy(() => import('./Docs-Create-Qr'));
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
        <div>
          <Docs_Header setActiveTab={setActiveTab} activeTab={activeTab}/>
        </div>

        <div>
            <Suspense fallback={<Docs_Create_Shadow />}>
          <Docs_Create_Qr codeTab={codeTab} setCodeTab={setCodeTab} setCopied={setCopied} copied={copied} activeTab={activeTab} setActiveTab={setActiveTab} copyToClipboard={copyToClipboard} />
            </Suspense>
        </div>

        {/* READ QR CARD */}
        <div>
          <Suspense>
            <Docs_Read_Qr codeTab={codeTab} setCodeTab={setCodeTab} setCopied={setCopied} copied={copied} activeTab={activeTab} setActiveTab={setActiveTab} copyToClipboard={copyToClipboard} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}