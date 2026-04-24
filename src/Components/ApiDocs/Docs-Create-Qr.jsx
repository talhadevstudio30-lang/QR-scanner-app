import React from 'react';
import { Clipboard, Check } from "lucide-react";

const createEndpoint = "https://api.qrserver.com/v1/create-qr-code/";

const createCodeExamples = {
  cURL: `https://api.qrserver.com/v1/create-qr-code?size=150x150&data=HelloWorld`,

  JavaScript: `fetch("${createEndpoint}?size=150x150&data=HelloWorld")
  .then(res => res.blob())
  .then(data => console.log(data));`,
  React: `import { useState } from "react";

export default function QrReader() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("${createEndpoint}", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <div>
      <input 
        type="file" 
        onChange={(e) => setFile(e.target.files[0])} 
      />
      
      <button onClick={handleUpload}>
        Upload & Read QR
      </button>

      {result && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}`,

  Python: `import requests

res = requests.get("${createEndpoint}?size=150x150&data=HelloWorld")

with open("qr.png", "wb") as f:
    f.write(res.content)`
};


function Docs_Create_Qr({ codeTab, setCodeTab, copied, activeTab, copyToClipboard }) {
  return (
    <div>
      {/* CREATE QR CARD */}
      {activeTab === "create" && (
        <div className="bg-white rounded-[28px] shadow-sm p-6 sm:p-8">
          {/* TITLE */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs md:text-[13.5px] bg-green-100 text-green-600 px-2 py-2 font-semibold rounded-[7px] border border-green-200">
              GET
            </span>
            <h2 className="text-[24px] font-bold text-gray-800">
              Create QR Code
            </h2>
          </div>

          <p className="text-gray-500 mb-6">
            Generate high-quality QR code images instantly. Support for custom
            dimensions and multiple encoding formats.
          </p>

          {/* ENDPOINT */}
          <div className="bg-gray-100 rounded-xl border border-gray-300 p-4 flex justify-between items-center mb-8">
            <div className="text-sm text-blue-600 font-semibold break-all">
              {createEndpoint}
            </div>

            <button
              onClick={() => copyToClipboard(createEndpoint, "endpoint")}
              className="text-gray-600 hover:text-black"
            >
              {copied === "endpoint" ? <Check size={18} /> : <Clipboard size={18} />}
            </button>
          </div>

          {/* REQUEST PARAMETERS */}
          <h3 className="font-semibold text-gray-800 mb-4">
            Request Parameters
          </h3>

          <div className="overflow-x-auto mb-8 border border-gray-300 rounded-2xl">
            <table className="w-full text-sm border rounded-xl overflow-hidden">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-3 text-left">NAME</th>
                  <th className="p-3 text-left">TYPE</th>
                  <th className="p-3 text-left">REQUIRED</th>
                  <th className="p-3 text-left">DESCRIPTION</th>
                </tr>
              </thead>

              <tbody className="text-gray-700">
                <tr className="border-t border-gray-300">
                  <td className="p-3 font-mono">data</td>
                  <td className="p-3">string</td>
                  <td className="p-3 text-red-500 font-medium">REQUIRED</td>
                  <td className="p-3">The payload to encode</td>
                </tr>

                <tr className="border-t border-gray-300">
                  <td className="p-3 font-mono">size</td>
                  <td className="p-3">string</td>
                  <td className="p-3 text-gray-400">Optional</td>
                  <td className="p-3">Dimensions (e.g. 300x300)</td>
                </tr>

                <tr className="border-t border-gray-300">
                  <td className="p-3 font-mono">format</td>
                  <td className="p-3">enum</td>
                  <td className="p-3 text-gray-400">Optional</td>
                  <td className="p-3">png, svg, jpg</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* EXAMPLE REQUEST */}
          <div className="grid sm:flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-800 mb-2.5 sm:mb-0">Example Request</h3>
            <div className="grid grid-cols-2 justify-center items-center sm:flex gap-2 px-1.5 py-1.5 bg-gray-100 rounded-xl">
              {["cURL", "React", "JavaScript", "Python"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCodeTab(tab)}
                  className={`text-[12.5px] px-3 py-1.5 font-semibold rounded-[7px] text-center 
        ${codeTab === tab
                      ? "bg-white text-blue-500 border border-gray-200 shadow-sm"
                      : "text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

          </div>

          {/* CODE BLOCK */}
          <div className="bg-gray-100 rounded-[14px] p-4 flex justify-between border border-gray-300 items-start">
            <pre className="text-sm text-gray-700 overflow-x-auto">
              {createCodeExamples[codeTab]}
            </pre>

            <button
              onClick={() => copyToClipboard(createCodeExamples[codeTab], "code")}
              className="ml-3 text-gray-600 hover:text-black"
            >
              {copied === "code" ? <Check size={18} /> : <Clipboard size={18} />}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Docs_Create_Qr
