import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function QrReader() {
  const [mode, setMode] = useState("camera"); // camera | upload
  const [qrData, setQrData] = useState(null);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);

  const scanningRef = useRef(false);
  const qrFoundRef = useRef(false);

  /* ---------------- CLEANUP ---------------- */
  useEffect(() => {
    return () => stopCamera();
  }, []);

  /* ---------------- CAMERA ---------------- */
  const startCamera = async () => {
    try {
      setError("");
      setQrData(null);
      qrFoundRef.current = false;
      scanningRef.current = false;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
      });

      streamRef.current = stream;
      videoRef.current.srcObject = stream;

      setTimeout(startScanning, 600);
    } catch {
      setError("Camera permission denied");
    }
  };

  const stopCamera = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  /* ---------------- SCANNING ---------------- */
  const startScanning = () => {
    scanIntervalRef.current = setInterval(() => {
      if (!videoRef.current || scanningRef.current || qrFoundRef.current) return;

      const video = videoRef.current;
      if (!video.videoWidth || !video.videoHeight) return;

      const size = Math.min(video.videoWidth, video.videoHeight) * 0.45;
      const sx = (video.videoWidth - size) / 2;
      const sy = (video.videoHeight - size) / 2;

      // capture center square
      const capture = document.createElement("canvas");
      capture.width = size;
      capture.height = size;
      capture
        .getContext("2d")
        .drawImage(video, sx, sy, size, size, 0, 0, size, size);

      drawOverlay();

      capture.toBlob(async (blob) => {
        if (!blob) return;
        scanningRef.current = true;

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
          } else {
            scanningRef.current = false;
          }
        } catch {
          scanningRef.current = false;
        }
      }, "image/png");
    }, 120);
  };

  /* ---------------- CANVAS OVERLAY ---------------- */
  const drawOverlay = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const boxSize = Math.min(video.clientWidth, video.clientHeight) * 0.55;
    canvas.width = boxSize;
    canvas.height = boxSize;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, boxSize, boxSize);

    // border
    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, boxSize - 4, boxSize - 4);

    // corners
    const c = boxSize * 0.15;
    ctx.lineWidth = 6;

    const corner = (x1, y1, x2, y2) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };

    // TL
    corner(0, c, 0, 0);
    corner(0, 0, c, 0);
    // TR
    corner(boxSize, c, boxSize, 0);
    corner(boxSize - c, 0, boxSize, 0);
    // BL
    corner(0, boxSize - c, 0, boxSize);
    corner(0, boxSize, c, boxSize);
    // BR
    corner(boxSize, boxSize - c, boxSize, boxSize);
    corner(boxSize - c, boxSize, boxSize, boxSize);
  };

  /* ---------------- FILE ---------------- */
  const handleFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;

    stopCamera();
    setMode("upload");
    setPreview(URL.createObjectURL(file));
    setQrData(null);
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "https://api.qrserver.com/v1/read-qr-code/",
        formData
      );
      const data = res?.data?.[0]?.symbol?.[0]?.data;
      data ? setQrData(data) : setError("No QR code found");
    } catch {
      setError("Failed to read QR");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- HELPERS ---------------- */
  const handleClear = () => {
    setQrData(null);
    setError("");
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (mode === "camera") startCamera();
  };

  const handleShare = async () => {
    if (!navigator.share) return alert("Sharing not supported");
    await navigator.share({ title: "QR Result", text: qrData });
  };

  const isURL = qrData?.startsWith("http");

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        ⚡ Fast QR Scanner
      </h1>

      {/* MODE SWITCH */}
      <div className="flex justify-center gap-3 mb-5">
        <button
          onClick={() => setMode("camera")}
          className={`px-4 py-2 rounded ${
            mode === "camera" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          📷 Camera
        </button>
        <button
          onClick={() => {
            stopCamera();
            setMode("upload");
          }}
          className={`px-4 py-2 rounded ${
            mode === "upload" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          📁 Upload
        </button>
      </div>

      {/* CAMERA */}
      {mode === "camera" && (
        <>
          <div className="relative rounded-lg overflow-hidden bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full block"
            />
            <canvas
              ref={canvasRef}
              className="absolute top-1/2 left-1/2 
                         -translate-x-1/2 -translate-y-1/2 
                         pointer-events-none"
            />
          </div>

          <div className="flex justify-center gap-3 mt-4">
            <button
              onClick={startCamera}
              className="px-6 py-2 bg-green-600 text-white rounded"
            >
              Start
            </button>
            <button
              onClick={stopCamera}
              className="px-6 py-2 bg-red-600 text-white rounded"
            >
              Stop
            </button>
          </div>
        </>
      )}

      {/* UPLOAD */}
      {mode === "upload" && (
        <div
          onClick={() => fileInputRef.current.click()}
          onDrop={(e) => {
            e.preventDefault();
            handleFile(e.dataTransfer.files[0]);
          }}
          onDragOver={(e) => e.preventDefault()}
          className="mt-4 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50"
        >
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => handleFile(e.target.files[0])}
          />

          {preview ? (
            <img src={preview} className="mx-auto max-w-xs" />
          ) : (
            <p className="text-gray-500">Click or drag & drop QR image</p>
          )}
        </div>
      )}

      {loading && <p className="mt-4 text-center">Scanning…</p>}
      {error && <p className="mt-4 text-red-600 text-center">{error}</p>}

      {/* RESULT */}
      {qrData && (
        <div className="mt-6 bg-green-50 p-4 rounded-lg">
          <p className="break-all font-mono">{qrData}</p>

          <div className="flex gap-2 mt-4 flex-wrap">
            {isURL && (
              <a
                href={qrData}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Open
              </a>
            )}
            <button
              onClick={() => navigator.clipboard.writeText(qrData)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Copy
            </button>
            <button
              onClick={handleShare}
              className="px-4 py-2 bg-purple-600 text-white rounded"
            >
              Share
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-gray-600 text-white rounded"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
