import { useState } from "react";
import { UploadTab } from "./UploadTab";
import { CameraTab } from "./CameraTab";

interface ScannerCardProps {
  onAnalyze: (source: File | string) => void;
  isAnalyzing: boolean;
}

export function ScannerCard({ onAnalyze, isAnalyzing }: ScannerCardProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'camera'>('upload');

  return (
    <div className="bg-card w-full rounded-3xl shadow-sm border border-border/50 overflow-hidden mt-6 md:mt-8 max-w-4xl">
      {/* Tabs */}
      <div className="flex bg-muted/30 p-2 m-2 rounded-2xl">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-3 text-xs sm:text-sm font-semibold transition-all rounded-xl ${
            activeTab === 'upload' 
              ? 'bg-card text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Upload Image
        </button>
        <button
          onClick={() => setActiveTab('camera')}
          className={`flex-1 py-3 text-xs sm:text-sm font-semibold transition-all rounded-xl ${
            activeTab === 'camera' 
              ? 'bg-card text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Live Camera
        </button>
      </div>

      {/* Content Area */}
      <div className="p-3 sm:p-4 relative">
        {isAnalyzing && (
          <div className="absolute inset-0 z-20 bg-background/50 backdrop-blur-sm flex items-center justify-center rounded-b-3xl">
            <div className="flex flex-col items-center p-6 bg-card rounded-2xl shadow-xl border border-border">
              <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
              <p className="font-semibold text-lg">Analyzing Quality...</p>
              <p className="text-muted-foreground text-sm font-medium">The AI engine is evaluating the produce.</p>
            </div>
          </div>
        )}
        
        {activeTab === 'upload' ? (
          <UploadTab onImageSelect={(file) => !isAnalyzing && onAnalyze(file)} />
        ) : (
          <CameraTab onImageCaptured={(src) => !isAnalyzing && onAnalyze(src)} />
        )}
      </div>
    </div>
  );
}
