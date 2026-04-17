import { useFlaggedImages } from "@/hooks/useVisualAnalytics";
import { useVisualDataset } from "@/context/VisualDatasetContext";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Image as ImageIcon } from "lucide-react";

const VisualFlagged = () => {
  const { activeVisualDataset } = useVisualDataset();
  const { data: flaggedImages, isLoading } = useFlaggedImages();

  if (!activeVisualDataset) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center max-w-md mx-auto animate-fade-in">
        <div className="h-16 w-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4 border border-blue-500/20">
          <ImageIcon className="h-8 w-8 text-blue-500" />
        </div>
        <h2 className="text-xl font-bold mb-2">No Visual Workspace Selected</h2>
        <p className="text-muted-foreground text-sm mb-6">Select a workspace to view flagged defects.</p>
      </div>
    );
  }

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Generating Defect Gallery...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Defect Gallery</h1>
        <p className="text-muted-foreground text-sm">Images mathematically flagged by Vision AI for critical structural or physical damage.</p>
      </div>

      {!flaggedImages || flaggedImages.length === 0 ? (
        <div className="bg-success/10 border border-success/20 rounded-xl p-8 text-center">
          <p className="text-success font-medium">No defects found!</p>
          <p className="text-xs text-success/80 mt-1">All images passed visual inspection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flaggedImages.map((img) => (
            <Card key={img.id} className="overflow-hidden border-border shadow-sm group">
              <div className="relative h-48 w-full bg-secondary/50 flex items-center justify-center overflow-hidden">
                <img 
                  src={img.image_url} 
                  alt="Flagged Defect" 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-destructive/90 text-white text-[10px] uppercase font-bold px-2 py-1 rounded backdrop-blur-md flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Flagged
                </div>
              </div>
              <CardContent className="p-4">
                <p className="text-sm font-medium text-foreground mb-2">
                  {img.defect_description || "Potential defect detected"}
                </p>
                <div className="flex justify-between items-center text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
                  <span>Confidence</span>
                  <span className="font-semibold text-primary">{Math.round((img.confidence || 0) * 100)}%</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VisualFlagged;
