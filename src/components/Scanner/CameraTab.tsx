import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Camera, RotateCcw, Flashlight, FlashlightOff } from "lucide-react";

interface CameraTabProps {
  onImageCaptured: (imageSrc: string) => void;
}

export function CameraTab({ onImageCaptured }: CameraTabProps) {
  const webcamRef = useRef<Webcam>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [hasFlashlight, setHasFlashlight] = useState(false);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onImageCaptured(imageSrc);
    }
  }, [webcamRef, onImageCaptured]);

  const switchCamera = useCallback(() => {
    setFacingMode(prev => prev === "user" ? "environment" : "user");
    setFlashlightOn(false); // Reset flashlight when switching cameras
  }, []);

  const toggleFlashlight = useCallback(async () => {
    if (!webcamRef.current?.video) return;

    const stream = webcamRef.current.video.srcObject as MediaStream;
    if (!stream) return;

    const track = stream.getVideoTracks()[0];
    if (!track) return;

    try {
      const capabilities = track.getCapabilities() as MediaTrackCapabilities & { torch?: boolean };
      if (capabilities.torch) {
        const newTorchState = !flashlightOn;
        await track.applyConstraints({
          advanced: [{ torch: newTorchState } as MediaTrackConstraintSet]
        });
        setFlashlightOn(newTorchState);
      }
    } catch (error) {
      console.error("Failed to toggle flashlight:", error);
    }
  }, [flashlightOn]);

  const onUserMedia = useCallback((stream: MediaStream) => {
    setHasPermission(true);
    
    // Check if flashlight is available
    const track = stream.getVideoTracks()[0];
    if (track) {
      const capabilities = track.getCapabilities() as MediaTrackCapabilities & { torch?: boolean };
      setHasFlashlight(!!capabilities.torch);
    }
  }, []);

  const onUserMediaError = () => {
    setHasPermission(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-muted/20 border border-border/50 rounded-3xl min-h-[400px]">
      
      {hasPermission === false ? (
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Camera Access Denied</h3>
          <p className="text-muted-foreground text-sm max-w-sm">
            Please allow camera access in your browser settings to use the live scanner.
          </p>
        </div>
      ) : (
        <div className="w-full relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode }}
            onUserMedia={onUserMedia}
            onUserMediaError={onUserMediaError}
            className="w-full h-full object-cover"
          />
          
          {hasPermission && (
            <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
              <button
                onClick={switchCamera}
                className="p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                title="Switch Camera"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              {hasFlashlight && (
                <button
                  onClick={toggleFlashlight}
                  className={`p-3 rounded-full transition-colors ${
                    flashlightOn 
                      ? 'bg-yellow-500/80 hover:bg-yellow-500 text-black' 
                      : 'bg-black/50 hover:bg-black/70 text-white'
                  }`}
                  title={flashlightOn ? "Turn Off Flashlight" : "Turn On Flashlight"}
                >
                  {flashlightOn ? (
                    <Flashlight className="w-5 h-5" />
                  ) : (
                    <FlashlightOff className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>
          )}
          
          {hasPermission && (
            <div className="absolute bottom-6 inset-x-0 flex justify-center w-full z-10">
              <button 
                onClick={capture}
                className="flex items-center space-x-2 px-8 py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full shadow-lg transition-transform active:scale-95 border-4 border-white/20"
              >
                <Camera className="w-5 h-5" />
                <span>Capture & Analyze</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
