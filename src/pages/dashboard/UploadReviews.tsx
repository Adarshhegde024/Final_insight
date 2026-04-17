import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, CheckCircle2, Loader2, PlusCircle, Database } from "lucide-react";
import { toast } from "sonner";
import { analyzeFileLocally, analyzeTextLocally } from "@/lib/analyzer";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useDataset } from "@/context/DatasetContext";
import { supabase } from "@/lib/supabase";

const UploadReviews = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { datasets, activeDataset, setActiveDatasetId, refreshDatasets } = useDataset();

  // Multi-Tenant Dataset State
  const [uploadMode, setUploadMode] = useState<"append" | "new">("new");
  const [newDatasetName, setNewDatasetName] = useState("");
  const [newDatasetCategory, setNewDatasetCategory] = useState("");
  const [selectedDatasetId, setSelectedDatasetId] = useState(activeDataset?.id || "");

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

    let targetDatasetId = selectedDatasetId;

    if (uploadMode === "new") {
      if (!newDatasetName.trim()) {
        toast.error("Please enter a workspace name");
        return;
      }
      setIsAnalyzing(true);
      try {
        const { data, error } = await supabase
          .from("datasets")
          .insert({ name: newDatasetName, category: newDatasetCategory })
          .select("id")
          .single();
        if (error) throw error;
        targetDatasetId = data.id;
        setActiveDatasetId(targetDatasetId);
      } catch (err: any) {
        toast.error(err.message || "Failed to create dataset workspace");
        setIsAnalyzing(false);
        return;
      }
    } else {
      if (!targetDatasetId) {
        toast.error("Please select a dataset to append to");
        return;
      }
    }

    setIsAnalyzing(true);
    setAnalysisComplete(false);
    
    try {
      if (file) {
        await analyzeFileLocally(file, targetDatasetId, uploadMode === "append");
      } else {
        await analyzeTextLocally(textInput, targetDatasetId, uploadMode === "append");
      }
      
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      toast.success(`Analysis complete! Processed into workspace.`);
      
      await refreshDatasets();
      await queryClient.invalidateQueries();
      
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err: any) {
      setIsAnalyzing(false);
      console.error(err);
      toast.error(err.message || "Failed to analyze. Please check file format and Supabase connection.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Upload Reviews</h1>
        <p className="text-muted-foreground text-sm mt-1">Upload a CSV/JSON file to begin the AI extraction pipeline</p>
      </div>

      {/* Dataset Workspace Selector */}
      <div className="glass rounded-xl p-6 space-y-5 border-l-4 border-l-primary">
        <div className="flex gap-4 border-b border-border/50 pb-4">
          <Button 
            variant={uploadMode === "new" ? "default" : "secondary"} 
            className="flex-1"
            onClick={() => setUploadMode("new")}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Workspace
          </Button>
          <Button 
            variant={uploadMode === "append" ? "default" : "secondary"}
            className="flex-1"
            onClick={() => setUploadMode("append")}
          >
            <Database className="mr-2 h-4 w-4" /> Append to Existing
          </Button>
        </div>

        {uploadMode === "new" ? (
          <div className="grid grid-cols-2 gap-4 animate-fade-in">
             <div className="space-y-2">
               <Label>Workspace/Dataset Name</Label>
               <Input placeholder="e.g. Sony MX5 Headphone Launch" value={newDatasetName} onChange={e => setNewDatasetName(e.target.value)} className="bg-background/50 border-border" />
             </div>
             <div className="space-y-2">
               <Label>Category (Optional)</Label>
               <Input placeholder="e.g. Consumer Electronics" value={newDatasetCategory} onChange={e => setNewDatasetCategory(e.target.value)} className="bg-background/50 border-border" />
             </div>
          </div>
        ) : (
          <div className="animate-fade-in space-y-2">
             <Label>Select Target Workspace</Label>
             <select 
               className="w-full h-10 px-3 rounded-md bg-background/50 border border-border text-sm focus:ring-primary focus:border-primary"
               value={selectedDatasetId}
               onChange={(e) => setSelectedDatasetId(e.target.value)}
             >
               <option value="" disabled>Select a dataset...</option>
               {datasets.map(d => <option key={d.id} value={d.id}>{d.name} {d.category ? `(${d.category})` : ""}</option>)}
             </select>
          </div>
        )}
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
        <p className="text-sm text-muted-foreground mt-1">Supports Mega-CSVs up to 250,000 rows natively</p>
        {file && (
          <div className="mt-4 inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-lg text-sm font-medium">
            <FileText className="h-4 w-4" /> {file.name}
          </div>
        )}
      </div>

      {/* Analyze button */}
      <Button
        onClick={handleAnalyze}
        disabled={isAnalyzing}
        className="w-full h-12 text-base gradient-primary border-0 text-primary-foreground hover:opacity-90 transition-opacity mt-4"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {uploadMode === "append" ? "Appending Context to Workspace..." : "Synthesizing New Workspace..."}
          </>
        ) : analysisComplete ? (
          <>
            <CheckCircle2 className="mr-2 h-4 w-4" /> Sync Complete — Returning to Dashboard
          </>
        ) : (
          uploadMode === "append" ? "Inject File Details into Workspace" : "Create Workspace & Analyze File"
        )}
      </Button>
    </div>
  );
};

export default UploadReviews;
