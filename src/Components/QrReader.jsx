import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function QrReader() {
  const [mode, setMode] = useState("upload");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const scanIntervalRef = useRef(null);
  const cameraStreamRef = useRef(null);
  const qrFoundRef = useRef(false);

  /* ---------------- CLEANUP ---------------- */
  useEffect(() => {
    return () => stopCamera();
  }, []);

  /* ---------------- CAMERA ---------------- */
  const startCamera = async () => {
    try {
      setError("");
      qrFoundRef.current = false;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      cameraStreamRef.current = stream;
      videoRef.current.srcObject = stream;

      setTimeout(startScanning, 1200);
    } catch (err) {
      setError("Camera permission denied");
    }
  };

  const stopCamera = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }

    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((t) => t.stop());
      cameraStreamRef.current = null;
    }

    if (videoRef.current) videoRef.current.srcObject = null;
  };

  /* ---------------- SCANNING ---------------- */
  const startScanning = () => {
    scanIntervalRef.current = setInterval(async () => {
      if (!videoRef.current || qrFoundRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (!video.videoWidth) return;

      const size = Math.min(video.videoWidth, video.videoHeight) * 0.6;
      const sx = (video.videoWidth - size) / 2;
      const sy = (video.videoHeight - size) / 2;

      canvas.width = size;
      canvas.height = size;

      ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);

      canvas.toBlob(async (blob) => {
        if (!blob || qrFoundRef.current) return;

        const formData = new FormData();
        formData.append("file", blob, "scan.png");

        try {
          const res = await axios.post(
            "https://api.qrserver.com/v1/read-qr-code/",
            formData
          );

          const data = res?.data?.[0]?.symbol?.[0]?.data;
          if (data) {
            qrFoundRef.current = true;
            setQrData(data);
            stopCamera();
          }
        } catch { }
      }, "image/png");
    }, 1800);
  };

  /* ---------------- UPLOAD ---------------- */
  const handleFile = (file) => {
    if (!file) return;
    stopCamera();
    qrFoundRef.current = false;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setQrData(null);
    setError("");
  };

  const readUploadedQR = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await axios.post(
        "https://api.qrserver.com/v1/read-qr-code/",
        formData
      );

      const data = res?.data?.[0]?.symbol?.[0]?.data;
      data ? setQrData(data) : setError("No QR found");
    } catch {
      setError("Failed to read QR");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  const isURL = qrData?.startsWith("http");

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">QR Code Scanner</h1>

      {/* MODE */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => setMode("upload")}
          className={`px-4 py-2 rounded ${mode === "upload" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
        >
          📁 Upload
        </button>
        <button
          onClick={() => setMode("camera")}
          className={`px-4 py-2 rounded ${mode === "camera" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
        >
          📷 Camera
        </button>
      </div>

      {/* CAMERA */}
      {mode === "camera" && (
        <div>
          <div className=" flex justify-center items-center">
            <div className="relative border-2 bg-black rounded-lg w-60 h-55 overflow-hidden">
              <video ref={videoRef} autoPlay playsInline className="w-60 h-55 object-cover" />
              <canvas ref={canvasRef} className="hidden" />
            </div>
          </div>

          <div className="flex justify-center gap-3 mt-4">
            <button
              onClick={startCamera}
              className="px-6 py-2 bg-green-600 text-white rounded"
            >
              Start Camera
            </button>
            <button
              onClick={stopCamera}
              className="px-6 py-2 bg-red-600 text-white rounded"
            >
              Stop
            </button>
          </div>
        </div>
      )}

      {/* UPLOAD */}
      {mode === "upload" && (
        <div
          onClick={() => fileInputRef.current.click()}
          className="border-2 border-dashed rounded-lg p-10 text-center cursor-pointer"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => handleFile(e.target.files[0])}
          />
          {previewUrl ? (
            <img src={previewUrl} className="mx-auto max-w-xs" />
          ) : (
            <p>Click or drop image here</p>
          )}
        </div>
      )}

      {/* ACTION */}
      {mode === "upload" && selectedFile && (
        <button
          onClick={readUploadedQR}
          disabled={loading}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? "Scanning..." : "Read QR"}
        </button>
      )}

      {/* RESULT */}
      {error && <p className="mt-4 text-red-600">{error}</p>}

      {qrData && (
        <div className="mt-6 bg-green-50 p-4 rounded">
          <p className="break-all">{qrData}</p>
          <div className="flex gap-2 mt-3">
            {isURL && (
              <a
                href={qrData}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Open Link
              </a>
            )}
            <button
              onClick={() => navigator.clipboard.writeText(qrData)}
              className="px-3 py-1 bg-teal-600 text-white rounded"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}