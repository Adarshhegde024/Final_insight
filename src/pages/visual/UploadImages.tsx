import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileImage, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { analyzeImagesLocally } from "@/lib/visual_analyzer";
import { useVisualDataset } from "@/context/VisualDatasetContext";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const UploadImages = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [datasetName, setDatasetName] = useState("");
  const { session } = useAuth();
  const { refreshVisualDatasets, setActiveVisualDataset } = useVisualDataset();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    onDrop: (acceptedFiles) => {
      setFiles(prev => [...prev, ...acceptedFiles]);
    }
  });

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please add some images to analyze.");
      return;
    }
    if (!datasetName.trim()) {
      toast.error("Please give this visual dataset a name.");
      return;
    }
    if (!session?.user?.id) {
      toast.error("You must be logged in.");
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading("Processing images natively with Llama 3.2 Vision...", { duration: 0 });

    try {
      // Create structural dataset
      const { data: newDataset, error: dbErr } = await supabase
        .from('visual_datasets')
        .insert({ name: datasetName })
        .select()
        .single();

      if (dbErr) throw dbErr;

      // Spin up visual analyzer pipeline
      await analyzeImagesLocally(files, newDataset.id);

      // Refresh contexts
      await refreshVisualDatasets();
      setActiveVisualDataset(newDataset);
      await queryClient.invalidateQueries();

      toast.success("Visual analysis complete! Defect rates calculated.", { id: toastId });
      navigate("/dashboard/visual-overview");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to process images.", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Visual Processor</h1>
        <p className="text-muted-foreground mt-1 text-sm">Upload raw product images to instantly detect physical defects via Vision AI.</p>
      </div>

      <div className="bg-card border border-border shadow-sm rounded-xl p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Collection Name</label>
          <input 
            type="text" 
            placeholder="e.g. Q3 Packaging Defects"
            value={datasetName}
            onChange={(e) => setDatasetName(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
          />
        </div>

        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
            isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-secondary/30"
          }`}
        >
          <input {...getInputProps()} />
          <UploadCloud className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-sm font-semibold text-foreground mb-1">Drag and drop images here</h3>
          <p className="text-xs text-muted-foreground">Supports .JPEG, .PNG, .WEBP</p>
        </div>

        {files.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground flex items-center justify-between">
              Queued Images
              <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs">{files.length} ready</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {files.map((file, i) => (
                <div key={i} className="bg-secondary flex items-center gap-2 p-2 rounded-md border border-border text-xs truncate">
                  <FileImage className="h-4 w-4 text-blue-500 shrink-0" />
                  <span className="truncate">{file.name}</span>
                </div>
              ))}
            </div>

            <Button 
              onClick={handleUpload} 
              disabled={isProcessing}
              className="w-full h-11 text-sm"
            >
              {isProcessing ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing {files.length} images via AI...</>
              ) : (
                "Run Vision Analysis"
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadImages;
