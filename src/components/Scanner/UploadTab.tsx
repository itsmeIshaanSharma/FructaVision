import { useRef, useState } from "react";
import { UploadCloud, X } from "lucide-react";
import { cn } from "../../lib/utils";

interface UploadTabProps {
  onImageSelect: (file: File) => void;
}

export function UploadTab({ onImageSelect }: UploadTabProps) {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file: File) => {
    setError(null);
    if (!file.type.match("image/(jpeg|png|webp|jpg)")) {
      setError("Please upload a valid image file (JPEG, PNG).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit.");
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  if (previewUrl && selectedFile) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-muted/30 rounded-3xl border border-dashed border-border/60">
        <div className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-sm group">
          <img src={previewUrl} alt="Preview" className="w-full h-auto object-cover aspect-video" />
          <button 
            onClick={clearSelection}
            className="absolute top-3 right-3 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100 backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="mt-4 text-sm font-medium text-foreground truncate max-w-[200px]">
          {selectedFile.name}
        </p>
        <button 
          onClick={() => onImageSelect(selectedFile)}
          className="mt-6 px-10 py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all shadow-sm active:scale-95"
        >
          Analyze Freshness
        </button>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center py-20 px-6 border-2 border-dashed rounded-3xl transition-all duration-200 text-center cursor-pointer",
        dragActive ? "border-primary bg-primary/5 scale-[1.01]" : "border-border/60 hover:border-primary/50 hover:bg-muted/30"
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input 
        ref={inputRef}
        type="file" 
        accept="image/jpeg, image/png, image/webp" 
        onChange={handleChange} 
        className="hidden" 
      />
      
      <div className="w-16 h-16 mb-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        <UploadCloud className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-semibold text-foreground mb-2">Drag & Drop fruit image</h3>
      <p className="text-muted-foreground mb-6 max-w-sm mx-auto text-sm">
        Or click to browse your files (JPEG, PNG up to 10MB)
      </p>

      {error && (
        <p className="text-destructive font-medium text-sm mt-4 bg-destructive/10 px-4 py-2 rounded-lg">
          {error}
        </p>
      )}
    </div>
  );
}
