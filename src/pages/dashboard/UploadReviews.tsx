import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { analyzeFileLocally, analyzeTextLocally } from "@/lib/analyzer";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const UploadReviews = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.name.endsWith(".csv") || droppedFile.name.endsWith(".json"))) {
      setFile(droppedFile);
      toast.success(`File "${droppedFile.name}" loaded successfully`);
    } else {
      toast.error("Please upload a CSV or JSON file");
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      toast.success(`File "${selectedFile.name}" loaded successfully`);
    }
  };

  const handleAnalyze = async () => {
    if (!file && !textInput.trim()) {
      toast.error("Please upload a file or paste reviews");
      return;
    }
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    
    try {
      if (file) {
        await analyzeFileLocally(file);
      } else {
        await analyzeTextLocally(textInput);
      }
      
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      toast.success(`Analysis complete! Successfully synced data to Supabase.`);
      
      // Invalidate all react-query caches so the dashboard fetches the fresh data
      await queryClient.invalidateQueries();
      
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err: any) {
      setIsAnalyzing(false);
      console.error(err);
      toast.error(err.message || "Failed to analyze. Please check file format and Supabase connection.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Upload Reviews</h1>
        <p className="text-muted-foreground text-sm mt-1">Upload a CSV/JSON file or paste reviews manually</p>
      </div>

      {/* Drag & Drop */}
      <div
        className={`glass rounded-xl p-8 border-2 border-dashed transition-all duration-300 cursor-pointer text-center ${
          dragActive ? "border-primary bg-primary/5 shadow-glow" : "border-border hover:border-primary/40"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <input id="file-input" type="file" accept=".csv,.json" className="hidden" onChange={handleFileInput} />
        <Upload className="h-10 w-10 text-primary mx-auto mb-3" />
        <p className="text-foreground font-medium">Drop your file here or click to browse</p>
        <p className="text-sm text-muted-foreground mt-1">Supports CSV and JSON formats</p>
        {file && (
          <div className="mt-4 inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-lg text-sm font-medium">
            <FileText className="h-4 w-4" /> {file.name}
          </div>
        )}
      </div>

      {/* Text Input */}
      <div className="glass rounded-xl p-6 space-y-3">
        <h3 className="font-semibold text-foreground">Or paste reviews manually</h3>
        <Textarea
          placeholder="Paste customer reviews here, one per line..."
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          className="min-h-[150px] bg-secondary/30 border-border focus:border-primary"
        />
      </div>

      {/* Analyze button */}
      <Button
        onClick={handleAnalyze}
        disabled={isAnalyzing}
        className="w-full h-12 text-base gradient-primary border-0 text-primary-foreground hover:opacity-90 transition-opacity"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deep Analyzing File Data...
          </>
        ) : analysisComplete ? (
          <>
            <CheckCircle2 className="mr-2 h-4 w-4" /> Analysis Complete — Returning to Dashboard
          </>
        ) : (
          "Analyze Data from File"
        )}
      </Button>

      {/* Progress indicator */}
      {isAnalyzing && (
        <div className="glass rounded-xl p-6 animate-fade-in">
          <div className="space-y-3">
            {["Connecting to Supabase...", "Parsing massive CSV dataset...", "Calculating heuristic sentiment...", "Uploading mapped results natively..."].map((step, i) => (
              <div key={step} className="flex items-center gap-3 text-sm animate-slide-in" style={{ animationDelay: `${i * 0.5}s` }}>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                <span className="text-muted-foreground">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadReviews;
