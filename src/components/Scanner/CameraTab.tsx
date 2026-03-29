import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Camera } from "lucide-react";

interface CameraTabProps {
  onImageCaptured: (imageSrc: string) => void;
}

export function CameraTab({ onImageCaptured }: CameraTabProps) {
  const webcamRef = useRef<Webcam>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onImageCaptured(imageSrc);
    }
  }, [webcamRef, onImageCaptured]);

  const onUserMedia = () => {
    setHasPermission(true);
  };

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
            videoConstraints={{ facingMode: "environment" }}
            onUserMedia={onUserMedia}
            onUserMediaError={onUserMediaError}
            className="w-full h-full object-cover"
          />
          
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
