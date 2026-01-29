import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function QrReader() {
  const [mode, setMode] = useState("camera");
  const [qrData, setQrData] = useState(null);
  const [error, setError] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
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
      qrFoundRef.current = false;
      scanningRef.current = false;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;
      videoRef.current.srcObject = stream;

      setTimeout(startScanning, 800);
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

  /* ---------------- FAST SCANNING ---------------- */
  const startScanning = () => {
    scanIntervalRef.current = setInterval(() => {
      if (
        !videoRef.current ||
        qrFoundRef.current ||
        scanningRef.current
      )
        return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (!video.videoWidth) return;

      const size = Math.min(video.videoWidth, video.videoHeight) * 0.45;
      const sx = (video.videoWidth - size) / 2;
      const sy = (video.videoHeight - size) / 2;

      canvas.width = size;
      canvas.height = size;

      ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);

      canvas.toBlob(async (blob) => {
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
    }, 600); // FAST SCAN
  };

  const isURL = qrData?.startsWith("http");

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        ⚡ Fast QR Scanner
      </h1>

      <div className="rounded-lg overflow-hidden flex justify-center items-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-60 h-55 object-cover border-2 border-amber-300"
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="flex justify-center gap-3 mt-4">
        <button
          onClick={startCamera}
          className="px-6 py-2 bg-green-600 text-white rounded-lg"
        >
          Start
        </button>
        <button
          onClick={stopCamera}
          className="px-6 py-2 bg-red-600 text-white rounded-lg"
        >
          Stop
        </button>
      </div>

      {error && (
        <p className="mt-4 text-red-600 text-center">{error}</p>
      )}

      {qrData && (
        <div className="mt-6 bg-green-50 p-4 rounded-lg">
          <p className="break-all font-mono">{qrData}</p>

          <div className="flex gap-2 mt-3">
            {isURL && (
              <a
                href={qrData}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Open Link
              </a>
            )}
            <button
              onClick={() => navigator.clipboard.writeText(qrData)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Copy
            </button>
          </div>
        </div>
      )}

      <p className="text-center text-gray-500 text-sm mt-4">
        Point the camera at a QR code — auto scan is live ⚡
      </p>
    </div>
  );
}