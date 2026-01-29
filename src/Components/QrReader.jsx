import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function QrReader() {
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [mode, setMode] = useState('upload'); // 'upload' or 'camera'
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const scanIntervalRef = useRef(null);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Handle camera mode switch
  const switchToCameraMode = async () => {
    if (mode === 'camera') return;
    
    setMode('camera');
    setSelectedFile(null);
    setPreviewUrl('');
    setQrData(null);
    setError('');
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const switchToUploadMode = () => {
    if (mode === 'upload') return;
    
    setMode('upload');
    stopCamera();
    setCapturedImage(null);
  };

  // Start camera
  const startCamera = async () => {
    try {
      setError('');
      
      // Get camera stream
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Prefer rear camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      setCameraStream(stream);
      setCameraActive(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      // Start scanning after a brief delay
      setTimeout(() => {
        startScanning();
      }, 1000);
      
    } catch (err) {
      console.error('Camera error:', err);
      setError(`Camera access denied: ${err.message}`);
      setCameraActive(false);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setCameraActive(false);
    setCapturedImage(null);
  };

  // Capture image from camera
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (!blob) return;
      
      const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
      const preview = URL.createObjectURL(blob);
      
      setSelectedFile(file);
      setCapturedImage(preview);
      setPreviewUrl(preview);
      
      // Stop scanning when image is captured
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
        scanIntervalRef.current = null;
      }
    }, 'image/jpeg', 0.9);
  };

  // Start scanning for QR codes
  const startScanning = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
    
    scanIntervalRef.current = setInterval(async () => {
      if (!videoRef.current || !canvasRef.current) return;
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Only scan if video is ready
      if (video.videoWidth === 0 || video.videoHeight === 0) return;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to blob for API
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        
        const formData = new FormData();
        formData.append('file', blob, 'scan.jpg');
        
        try {
          const response = await axios.post(
            'https://api.qrserver.com/v1/read-qr-code/',
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
          );
          
          if (response.data && response.data[0]?.symbol[0]?.data) {
            const data = response.data[0].symbol[0].data;
            setQrData(data);
            
            // Stop scanning when QR code is found
            if (scanIntervalRef.current) {
              clearInterval(scanIntervalRef.current);
              scanIntervalRef.current = null;
            }
          }
        } catch (err) {
          // Silently fail for scanning - don't show errors for no QR code
          if (err.response?.status !== 400) {
            console.error('Scan error:', err);
          }
        }
      }, 'image/jpeg', 0.7);
    }, 1000); // Scan every second
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setQrData(null);
    setError('');
    setMode('upload');
    
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
    setCapturedImage(null);
    
    // Stop camera if active
    if (cameraActive) {
      stopCamera();
    }
  };

  // Handle drag and drop
  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setQrData(null);
      setError('');
      setMode('upload');
      
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
      setCapturedImage(null);
      
      // Stop camera if active
      if (cameraActive) {
        stopCamera();
      }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  // Upload and read QR code
  const readQRCode = async () => {
    if (!selectedFile) {
      setError('Please select an image file first');
      return;
    }

    setLoading(true);
    setQrData(null);
    setError('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(
        'https://api.qrserver.com/v1/read-qr-code/',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      
      if (response.data && response.data[0]?.symbol[0]?.data) {
        setQrData(response.data[0].symbol[0].data);
      } else {
        setError('No QR code data found in the image.');
      }
    } catch (err) {
      setError(`Failed to read QR code: ${err.response?.status === 400 ? 'Invalid image file' : err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Clear all selections
  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setQrData(null);
    setError('');
    setCapturedImage(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    if (mode === 'camera') {
      stopCamera();
      startCamera(); // Restart camera after clear
    }
  };

  // Clean up URLs when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (capturedImage) URL.revokeObjectURL(capturedImage);
      stopCamera();
    };
  }, [previewUrl, capturedImage]);

  // Determine if decoded data is a URL
  const isURL = qrData && (qrData.startsWith('http://') || qrData.startsWith('https://'));

  return (
    <div className="p-5 max-w-3xl mx-auto">
      <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">QR Code Reader</h2>
      
      {/* Mode Selector */}
      <div className="flex gap-2 mb-6 justify-center">
        <button
          onClick={switchToUploadMode}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${mode === 'upload' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          📁 Upload Image
        </button>
        <button
          onClick={switchToCameraMode}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${mode === 'camera' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          📷 Use Camera
        </button>
      </div>

      {/* Camera Mode */}
      {mode === 'camera' && (
        <div className="mb-6">
          <div className="bg-gray-800 flex justify-center items-center rounded-xl overflow-hidden relative">
            {cameraActive ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-67 h-67 object-cover"
                />
                {/* Scanning overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 rounded-lg relative">
                    <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-green-400"></div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-green-400"></div>
                    <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-green-400"></div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-green-400"></div>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-white">
                <div className="text-5xl mb-3">📷</div>
                <p className="text-lg">Camera is off</p>
              </div>
            )}
            
            {/* Hidden canvas for image processing */}
            <canvas ref={canvasRef} className="hidden" />
          </div>
          
          {/* Camera Controls */}
          <div className="flex gap-3 justify-center mt-4">
            {!cameraActive ? (
              <button
                onClick={startCamera}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Start Camera
              </button>
            ) : (
              <>
                <button
                  onClick={captureImage}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Capture & Scan
                </button>
                <button
                  onClick={stopCamera}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Stop Camera
                </button>
              </>
            )}
          </div>
          
          {cameraActive && (
            <p className="text-center text-sm text-gray-500 mt-2">
              Point camera at QR code. Auto-scanning is active.
            </p>
          )}
        </div>
      )}

      {/* Upload Mode - Only show when in upload mode or when image is captured from camera */}
      {(mode === 'upload' || capturedImage) && (
        <div 
          className={`
            border-2 border-dashed rounded-xl p-10 text-center my-5 cursor-pointer
            transition-all duration-200 ease-in-out
            ${previewUrl || capturedImage ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}
          `}
          onClick={() => mode === 'upload' && fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />
          
          {(previewUrl || capturedImage) ? (
            <div>
              <img 
                src={capturedImage || previewUrl} 
                alt="Selected QR code" 
                className="max-w-xs max-h-xs mx-auto mb-5 border border-gray-300 rounded-lg shadow-sm" 
              />
              <p className="text-gray-600">
                {capturedImage ? 'Captured from camera' : 'Selected:'} {selectedFile?.name} 
                {selectedFile?.size && ` (${(selectedFile.size / 1024).toFixed(2)} KB)`}
              </p>
            </div>
          ) : mode === 'upload' ? (
            <div>
              <div className="text-5xl text-gray-500 mb-3">📁</div>
              <p className="text-xl font-medium text-gray-600">
                Click to select or drag & drop
              </p>
              <p className="text-gray-400 mt-2">Supported formats: JPG, PNG, GIF, BMP</p>
            </div>
          ) : null}
        </div>
      )}

      {/* Action Buttons */}
      {(selectedFile || capturedImage) && (
        <div className="flex gap-3 justify-center mb-5">
          <button
            onClick={readQRCode}
            disabled={loading}
            className={`
              px-6 py-3 rounded-lg font-medium text-white
              transition-colors duration-200
              ${loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
              }
            `}
          >
            {loading ? (
              <span className="flex items-center">
                <span className="mr-2">⏳</span> Reading QR Code...
              </span>
            ) : 'Read QR Code'}
          </button>
          
          <button
            onClick={clearSelection}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200"
          >
            Clear
          </button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 text-red-800 rounded-lg my-5 border border-red-200">
          <strong className="font-semibold">Error:</strong> {error}
        </div>
      )}
      
      {/* Success Display */}
      {qrData && (
        <div className="p-5 bg-green-50 text-green-800 rounded-lg my-5 border border-green-200">
          <h3 className="text-xl font-semibold text-green-900 mb-3 flex items-center">
            <span className="mr-2">✓</span> QR Code Decoded Successfully!
          </h3>
          <div className="bg-white p-4 rounded-lg border border-green-300">
            <strong className="block mb-2 text-green-900">Decoded Content:</strong>
            <div className="bg-gray-50 p-3 rounded break-all font-mono text-gray-800">
              {qrData}
            </div>
          </div>
          
          {/* Additional actions for decoded data */}
          <div className="flex gap-3 mt-4">
            {isURL && (
              <a 
                href={qrData} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 transition-colors duration-200 no-underline"
              >
                Open Link
              </a>
            )}
            
            <button
              onClick={() => navigator.clipboard.writeText(qrData)}
              className="px-4 py-2 bg-teal-600 text-white rounded font-medium hover:bg-teal-700 transition-colors duration-200"
            >
              Copy to Clipboard
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg text-gray-600 text-sm">
        <h4 className="font-semibold text-gray-700 mb-2">How to use:</h4>
        
        {mode === 'upload' ? (
          <ol className="list-decimal pl-5 space-y-1">
            <li>Select <strong>Upload Image</strong> mode (default)</li>
            <li>Click the upload area or drag & drop a QR code image</li>
            <li>Click "Read QR Code" to decode the image</li>
          </ol>
        ) : (
          <ol className="list-decimal pl-5 space-y-1">
            <li>Select <strong>Use Camera</strong> mode</li>
            <li>Click "Start Camera" and allow camera access</li>
            <li>Point your camera at a QR code (auto-scanning is enabled)</li>
            <li>Or click "Capture & Scan" to manually capture and decode</li>
          </ol>
        )}
        
        <div className="mt-2">
          <li>View the decoded content below</li>
          <li>If it's a URL, you can click "Open Link" to visit it</li>
        </div>
        
        <p className="mt-3 italic text-gray-500">
          <strong>Tip:</strong> For best results, use clear, high-contrast QR code images
        </p>
      </div>
    </div>
  );
}

export default QrReader;