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
      } else {
        // Try anyway for devices that might support torch but don't report it
        const newTorchState = !flashlightOn;
        try {
          await track.applyConstraints({
            advanced: [{ torch: newTorchState } as MediaTrackConstraintSet]
          });
          setFlashlightOn(newTorchState);
          setHasFlashlight(true); // Update capability if it worked
        } catch (fallbackError) {
          console.warn("Flashlight not supported on this device:", fallbackError);
          setHasFlashlight(false);
        }
      }
    } catch (error) {
      console.error("Failed to toggle flashlight:", error);
      setHasFlashlight(false);
    }
  }, [flashlightOn]);

  const onUserMedia = useCallback((stream: MediaStream) => {
    setHasPermission(true);
    
    // Check if flashlight is available
    const track = stream.getVideoTracks()[0];
    if (track) {
      try {
        const capabilities = track.getCapabilities() as MediaTrackCapabilities & { torch?: boolean };
        setHasFlashlight(!!capabilities.torch);
      } catch (error) {
        console.warn("Could not check flashlight capabilities:", error);
        // Assume flashlight might be available on mobile devices
        setHasFlashlight(true);
      }
    }
  }, []);

  const onUserMediaError = () => {
    setHasPermission(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-muted/20 border border-border/50 rounded-3xl min-h-[480px] sm:min-h-[560px] md:min-h-[520px]">
      
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
        <div className="w-full relative rounded-2xl overflow-hidden bg-black h-full min-h-[340px] sm:min-h-[380px] md:min-h-[420px] max-h-[80vh]">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode, width: 1280, height: 720 }}
            onUserMedia={onUserMedia}
            onUserMediaError={onUserMediaError}
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {hasPermission && (
            <div className="absolute inset-x-4 bottom-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3 z-10">
              <div className="flex items-center gap-2">
                <button
                  onClick={switchCamera}
                  className="p-2.5 sm:p-3 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
                  title="Switch Camera"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button
                  onClick={toggleFlashlight}
                  disabled={!hasFlashlight}
                  className={`p-2.5 sm:p-3 rounded-full transition-colors ${
                    !hasFlashlight 
                      ? 'bg-black/30 text-gray-400 cursor-not-allowed' 
                      : flashlightOn 
                        ? 'bg-yellow-500/80 hover:bg-yellow-500 text-black' 
                        : 'bg-black/60 hover:bg-black/80 text-white'
                  }`}
                  title={hasFlashlight ? (flashlightOn ? "Turn Off Flashlight" : "Turn On Flashlight") : "Flashlight Not Available"}
                >
                  {flashlightOn ? (
                    <Flashlight className="w-5 h-5" />
                  ) : (
                    <FlashlightOff className="w-5 h-5" />
                  )}
                </button>
              </div>
              <button 
                onClick={capture}
                className="flex items-center justify-center space-x-2 min-w-[180px] w-full sm:w-auto px-6 py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full shadow-lg transition-transform active:scale-95 border-4 border-white/20"
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
