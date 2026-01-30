import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function QrReader() {
  const [mode, setMode] = useState("camera"); // camera | upload
  const [qrData, setQrData] = useState(null);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const videoRef = useRef(null);
  // overlay canvas shown on top of the video (shows borders, guides)
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const scanIntervalRef = useRef(null);
  const streamRef = useRef(null);

  const qrFoundRef = useRef(false);
  const scanningRef = useRef(false);

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

      setTimeout(startScanning, 700);
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

  /* ---------------- CAMERA SCAN ---------------- */
  const startScanning = () => {
    scanIntervalRef.current = setInterval(() => {
      if (!videoRef.current || qrFoundRef.current || scanningRef.current) return;

      const video = videoRef.current;
      // ensure the video has dimensions
      if (!video.videoWidth || !video.videoHeight) return;

      // capture square area from the native video frame using an offscreen canvas
      const size = Math.min(video.videoWidth, video.videoHeight) * 0.45;
      const sx = (video.videoWidth - size) / 1;
      const sy = (video.videoHeight - size) / 1;

      const capture = document.createElement("canvas");
      capture.width = size;
      capture.height = size;
      const capCtx = capture.getContext("2d");
      capCtx.drawImage(video, sx, sy, size, size, 0, 0, size, size);

      // draw overlay (borders / guides) on the visible canvas
      const overlay = canvasRef.current;
      if (overlay) {
        // size overlay to match displayed video size
        const vw = video.clientWidth || video.videoWidth;
        const vh = video.clientHeight || video.videoHeight;
        overlay.width = vw;
        overlay.height = vh;
        const octx = overlay.getContext("2d");
        octx.clearRect(0, 0, vw, vh);

        // compute the displayed capture rect (map native coords to displayed coords)
        const scaleX = (video.clientWidth || vw) / video.videoWidth;
        const scaleY = (video.clientHeight || vh) / video.videoHeight;
        const dx = sx * scaleX;
        const dy = sy * scaleY;
        const dsize = size * Math.min(scaleX, scaleY);

        // dim the outside area
        octx.fillStyle = "rgba(0,0,0,0.35)";
        octx.fillRect(0, 0, vw, vh);
        octx.clearRect(dx, dy, dsize, dsize);

        // draw border
        octx.strokeStyle = "#34D399"; // green-400
        octx.lineWidth = Math.max(2, Math.round(Math.min(vw, vh) * 0.003));
        octx.strokeRect(dx + 0.5, dy + 0.5, dsize - 1, dsize - 1);

        // corner markers
        const cornerLen = Math.max(16, dsize * 0.08);
        octx.lineWidth = Math.max(3, Math.round(octx.lineWidth * 1.2));
        const drawCorner = (x1, y1, x2, y2) => {
          octx.beginPath();
          octx.moveTo(x1, y1);
          octx.lineTo(x2, y2);
          octx.stroke();
        };
        octx.strokeStyle = "#10B981"; // green-500
        // TL
        drawCorner(dx, dy + cornerLen, dx, dy);
        drawCorner(dx, dy, dx + cornerLen, dy);
        // TR
        drawCorner(dx + dsize, dy + cornerLen, dx + dsize, dy);
        drawCorner(dx + dsize - cornerLen, dy, dx + dsize, dy);
        // BL
        drawCorner(dx, dy + dsize - cornerLen, dx, dy + dsize);
        drawCorner(dx, dy + dsize, dx + cornerLen, dy + dsize);
        // BR
        drawCorner(dx + dsize, dy + dsize - cornerLen, dx + dsize, dy + dsize);
        drawCorner(dx + dsize - cornerLen, dy + dsize, dx + dsize, dy + dsize);
      }

      // convert capture canvas to blob and send to API
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
          console.log(data);
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
    }, 300);
  };

  /* ---------------- FILE HANDLER ---------------- */
  const handleFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;

    stopCamera();
    setMode("upload");
    setError("");
    setQrData(null);
    setPreview(URL.createObjectURL(file));
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
      console.log(data)
    } catch {
      setError("Failed to read QR");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- DRAG & DROP ---------------- */
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleDragOver = (e) => e.preventDefault();

  /* ---------------- SHARE ---------------- */
  const handleShare = async () => {
    if (!navigator.share) return alert("Sharing not supported");

    try {
      await navigator.share({
        title: "QR Scan Result",
        text: qrData,
      });
    } catch {}
  };

  /* ---------------- CLEAR ---------------- */
  const handleClear = () => {
    setQrData(null);
    setError("");
    setPreview(null);
    setLoading(false);
    qrFoundRef.current = false;
    scanningRef.current = false;

    if (fileInputRef.current) fileInputRef.current.value = "";
    if (mode === "camera") startCamera();
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
          onClick={() => {
            setMode("camera");
            setPreview(null);
            setQrData(null);
          }}
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
            setQrData(null);
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
          <div className="rounded-lg overflow-hidden bg-black relative">
            <video ref={videoRef} autoPlay playsInline className="w-full block" />
            {/* overlay canvas sits on top of video and shows borders/guides */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
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

      {/* UPLOAD + DRAG */}
      {mode === "upload" && (
        <div
          onClick={() => fileInputRef.current.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
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
            <p className="text-gray-500">
              Click or drag & drop a QR image
            </p>
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