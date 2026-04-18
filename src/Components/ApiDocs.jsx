import { useState } from "react";
import { Clipboard, Check } from "lucide-react";

export default function ApiDocs() {
  const [activeTab, setActiveTab] = useState("create");
  const [copied, setCopied] = useState("");
  const [codeTab, setCodeTab] = useState("cURL");

  const createEndpoint = "https://api.qrserver.com/v1/create-qr-code/";
  const readEndpoint = "https://api.qrserver.com/v1/read-qr-code/";

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(""), 1500);
  };

  const createCodeExamples = {
    cURL: `curl -X GET "${createEndpoint}?size=150x150&data=HelloWorld"`,

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

res = requests.get("${createEndpoint}?size=150x150&data=HelloWorld")

with open("qr.png", "wb") as f:
    f.write(res.content)`
  };

  const readCodeExamples = {
    cURL: `curl -X POST "${readEndpoint}" \\
  -F "file=@qrcode.png"`,

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
            className={`flex items-center gap-2 pb-3 text-sm font-medium transition-all ${activeTab === "create"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
              }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              className="w-5 h-5"
              fill="currentColor"
            >
              <path d="M120-520v-320h320v320H120Zm80-80h160v-160H200v160Zm-80 480v-320h320v320H120Zm80-80h160v-160H200v160Zm320-320v-320h320v320H520Zm80-80h160v-160H600v160Zm160 480v-80h80v80h-80ZM520-360v-80h80v80h-80Zm80 80v-80h80v80h-80Zm-80 80v-80h80v80h-80Zm80 80v-80h80v80h-80Zm80-80v-80h80v80h-80Zm0-160v-80h80v80h-80Zm80 80v-80h80v80h-80Z" />
            </svg>
            Create QR Code
          </button>

          {/* READ TAB */}
          <button
            onClick={() => setActiveTab("read")}
            className={`flex items-center gap-2 pb-3 text-sm font-medium transition-all ${activeTab === "read"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
              }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              className="w-5 h-5"
              fill="currentColor"
            >
              <path d="M80-680v-200h200v80H160v120H80Zm0 600v-200h80v120h120v80H80Zm600 0v-80h120v-120h80v200H680Zm120-600v-120H680v-80h200v200h-80ZM700-260h60v60h-60v-60Zm0-120h60v60h-60v-60Zm-60 60h60v60h-60v-60Zm-60 60h60v60h-60v-60Zm-60-60h60v60h-60v-60Zm120-120h60v60h-60v-60Zm-60 60h60v60h-60v-60Zm-60-60h60v60h-60v-60Zm240-320v240H520v-240h240ZM440-440v240H200v-240h240Zm0-320v240H200v-240h240Zm-60 500v-120H260v120h120Zm0-320v-120H260v120h120Zm320 0v-120H580v120h120Z" />
            </svg>
            Read QR Code
          </button>
        </div>

        {/* CREATE QR CARD */}
        {activeTab === "create" && (
          <div className="bg-white rounded-[28px] shadow-sm p-6 sm:p-8">
            {/* TITLE */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs bg-green-100 text-green-600 px-2 py-2 font-semibold rounded-[7px] border border-green-200">
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

        {/* READ QR CARD */}
        {activeTab === "read" && (
          <div className="bg-white rounded-[28px] shadow-sm p-6 sm:p-8">
            {/* TITLE */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-2 font-semibold rounded-[7px] border border-blue-200">
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
    </div>
  );
}