import React from 'react';
import { Clipboard, Check } from "lucide-react";

  const readEndpoint = "https://api.qrserver.com/v1/read-qr-code/";

 const readCodeExamples = {
    cURL: `${readEndpoint}" \\
  -F "file=@qrcode.png`,

    JavaScript: `const formData = new FormData();
formData.append("file", fileInput.files[0]);

fetch("${readEndpoint}", {
  method: "POST",
  body: formData
})
  .then(res => res.json())
  .then(data => console.log(data));`,

    React: `import { useState } from "react";

export default function QrReader() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("${readEndpoint}", {
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

url = "${readEndpoint}"
files = {"file": open("qrcode.png", "rb")}

response = requests.post(url, files=files)
print(response.json())`
  };

function Docs_Read_Qr({codeTab,  setCodeTab, copied, activeTab, copyToClipboard}) {
  return (
    <div>
      {activeTab === "read" && (
        <div className="bg-white rounded-[28px] shadow-sm p-6 sm:p-8">
          {/* TITLE */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs bg-blue-100 md:text-[13.5px] text-blue-600 px-2 py-2 font-semibold rounded-[7px] border border-blue-200">
              POST
            </span>
            <h2 className="text-[24px] font-bold text-gray-800">
              Read QR Code
            </h2>
          </div>

          <p className="text-gray-500 mb-6">
            Decode and extract data from QR code images. Upload an image file
            and receive the encoded content in response.
          </p>

          {/* ENDPOINT */}
          <div className="bg-gray-100 rounded-xl border border-gray-300 p-4 flex justify-between items-center mb-8">
            <div className="text-sm text-blue-600 font-semibold break-all">
              {readEndpoint}
            </div>

            <button
              onClick={() => copyToClipboard(readEndpoint, "endpoint-read")}
              className="text-gray-600 hover:text-black"
            >
              {copied === "endpoint-read" ? <Check size={18} /> : <Clipboard size={18} />}
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
                  <td className="p-3 font-mono">file</td>
                  <td className="p-3">file</td>
                  <td className="p-3 text-red-500 font-medium">REQUIRED</td>
                  <td className="p-3">QR code image file (PNG, JPG, SVG)</td>
                </tr>

                <tr className="border-t border-gray-300">
                  <td className="p-3 font-mono">output</td>
                  <td className="p-3">string</td>
                  <td className="p-3 text-gray-400">Optional</td>
                  <td className="p-3">Response format (json, text)</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* RESPONSE FORMAT */}
          <h3 className="font-semibold text-gray-800 mb-4">
            Response Format
          </h3>

          <div className="overflow-x-auto mb-6 border border-gray-300 rounded-2xl">
            <table className="w-full text-sm border rounded-xl overflow-hidden">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-3 text-left">FIELD</th>
                  <th className="p-3 text-left">TYPE</th>
                  <th className="p-3 text-left">DESCRIPTION</th>
                </tr>
              </thead>

              <tbody className="text-gray-700">
                <tr className="border-t border-gray-300">
                  <td className="p-3 font-mono">success</td>
                  <td className="p-3">boolean</td>
                  <td className="p-3">Indicates if the decode was successful</td>
                </tr>

                <tr className="border-t border-gray-300">
                  <td className="p-3 font-mono">data</td>
                  <td className="p-3">string</td>
                  <td className="p-3">The decoded content from QR code</td>
                </tr>

                <tr className="border-t border-gray-300">
                  <td className="p-3 font-mono">type</td>
                  <td className="p-3">string</td>
                  <td className="p-3">Detected content type (URL, text, etc.)</td>
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
              {readCodeExamples[codeTab]}
            </pre>

            <button
              onClick={() => copyToClipboard(readCodeExamples[codeTab], "code-read")}
              className="ml-3 text-gray-600 hover:text-black"
            >
              {copied === "code-read" ? <Check size={18} /> : <Clipboard size={18} />}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Docs_Read_Qr;