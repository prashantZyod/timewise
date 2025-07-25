import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, Check, RotateCcw, AlertTriangle } from 'lucide-react';

export default function CameraCapture({ onCapture, onCancel }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [photoData, setPhotoData] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('idle'); // idle, requesting, granted, denied
  const [error, setError] = useState(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraReady(false);
    setPhotoData(null);
    setPermissionStatus('idle');
  }, []);

  const startCamera = useCallback(async () => {
    setPermissionStatus('requesting');
    setError(null);
    setPhotoData(null);
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Camera API is not available on this device or browser.");
      setPermissionStatus('denied');
      return;
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }, 
        audio: false 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setIsCameraReady(true);
          setPermissionStatus('granted');
        };
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setPermissionStatus('denied');
      
      if (err.name === 'NotAllowedError') {
        setError("Camera access denied. Please allow camera access in your browser settings and try again.");
      } else if (err.name === 'NotFoundError') {
        setError("No camera found. Please ensure a camera is connected and available.");
      } else {
        setError("Could not access camera. It might be in use by another application.");
      }
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !isCameraReady) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    
    ctx.translate(video.videoWidth, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    
    setPhotoData(canvas.toDataURL('image/jpeg', 0.8));
  };

  const handleConfirm = () => {
    if (!photoData) return;
    onCapture(photoData);
    stopCamera();
  };

  const retakePhoto = () => {
    setPhotoData(null);
  };

  const renderContent = () => {
    if (permissionStatus === 'denied') {
      return (
        <div className="text-center p-8">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Camera Access Required</h3>
          <p className="text-slate-500 mb-4">{error}</p>
          <button 
            onClick={startCamera}
            className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (permissionStatus === 'requesting' || !isCameraReady) {
      return (
        <div className="text-center p-8">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Accessing camera...</p>
        </div>
      );
    }

    return (
      <>
        {!photoData ? (
          <>
            <div className="relative overflow-hidden rounded-md bg-slate-100 mb-4 aspect-[4/3] flex items-center justify-center">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline
                muted
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="border-2 border-dashed border-white/60 rounded-full w-36 h-36"></div>
              </div>
            </div>
            <div className="flex justify-between gap-2">
              <button 
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors flex items-center"
                onClick={takePhoto}
              >
                <Camera className="w-5 h-5 mr-2" />
                Take Photo
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="relative overflow-hidden rounded-md bg-slate-100 mb-4 aspect-[4/3]">
              <img 
                src={photoData} 
                alt="Captured selfie" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex justify-between gap-2">
              <button 
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors flex items-center"
                onClick={retakePhoto}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake
              </button>
              <button 
                className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors flex items-center"
                onClick={handleConfirm}
              >
                <Check className="w-4 h-4 mr-2" />
                Confirm
              </button>
            </div>
          </>
        )}
      </>
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-slate-200">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="font-medium text-slate-800">Take a Selfie</h3>
      </div>
      
      {error && permissionStatus !== 'denied' && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md mb-4 text-red-700 text-sm">
          {error}
        </div>
      )}
      
      <div>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        {renderContent()}
      </div>
    </div>
  );
}
