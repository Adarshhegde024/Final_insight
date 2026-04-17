import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, BarChart3, MessageSquare, TrendingUp, Shield, Loader2 } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { 
  useOverviewMetrics, 
  useSentimentOverTime, 
  useCriticalIssues, 
  usePositiveHighlights,
  useRecommendations
} from "@/hooks/useAnalytics";

const Reports = () => {
  const { data: mData, isLoading: load1 } = useOverviewMetrics();
  const { data: sData, isLoading: load2 } = useSentimentOverTime();
  const { data: cData, isLoading: load3 } = useCriticalIssues();
  const { data: pData, isLoading: load4 } = usePositiveHighlights();
  const { data: rData, isLoading: load5 } = useRecommendations();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const isLoading = load1 || load2 || load3 || load4 || load5;

  const handleDownload = async () => {
    if (!mData || !pdfRef.current) {
      toast.error("No data available to generate report.");
      return;
    }

    setIsGenerating(true);
    toast.success("Generating Professional PDF Report... Please wait.");

    try {
      const element = pdfRef.current;
      
      // Temporarily reveal the element for capture
      element.style.display = "block";
      
      const canvas = await html2canvas(element, { 
        scale: 2, // High resolution
        useCORS: true,
        logging: false
      });
      
      element.style.display = "none";
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      
      pdf.save(`ReviewIQ_Executive_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success("PDF Downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF. Check console.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const metrics = mData || {
    total_reviews: 0, positive_percent: 0, negative_percent: 0, spam_count: 0, duplicate_count: 0
  };

  const trendString = sData && sData.length >= 2 
    ? `Sentiment trending at ${sData[sData.length - 1]?.positive}% positivity` 
    : "Not enough historical data";

  return (
    <div className="max-w-3xl mx-auto space-y-6 relative">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reports</h1>
        <p className="text-muted-foreground text-sm mt-1">Export your AI-generated executive summary directly to PDF</p>
      </div>

      <div className="glass rounded-xl p-6 animate-fade-up">
        <h3 className="text-lg font-semibold text-foreground mb-4">Current Dataset Summary</h3>
        <div className="space-y-4">
          {[
            { icon: MessageSquare, label: "Total reviews analyzed", value: metrics.total_reviews?.toLocaleString() || "0" },
            { icon: BarChart3, label: "Overall sentiment", value: `${metrics.positive_percent}% positive, ${metrics.negative_percent}% negative` },
            { icon: TrendingUp, label: "Key trend", value: trendString },
            { icon: Shield, label: "Flagged content", value: `${metrics.spam_count} spam, ${metrics.duplicate_count} duplicates` },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
              <item.icon className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm text-muted-foreground flex-1">{item.label}</span>
              <span className="text-sm font-medium text-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <Button 
        onClick={handleDownload} 
        disabled={isGenerating}
        className="w-full h-12 text-base gradient-primary border-0 text-primary-foreground hover:opacity-90 transition-opacity"
      >
        {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />} 
        {isGenerating ? "Processing Document Engine..." : "Download Professional PDF"}
      </Button>

      {/* Hidden PDF Template Container */}
      <div 
        ref={pdfRef} 
        style={{ 
          display: "none", 
          width: "210mm", 
          minHeight: "297mm", 
          padding: "20mm", 
          backgroundColor: "#ffffff",
          color: "#000000",
          fontFamily: "sans-serif"
        }}
      >
        <div style={{ borderBottom: "2px solid #2563eb", paddingBottom: "20px", marginBottom: "30px" }}>
          <h1 style={{ fontSize: "32px", color: "#1e40af", margin: 0 }}>ReviewIQ Executive Report</h1>
          <p style={{ color: "#64748b", margin: "10px 0 0 0" }}>Generated on {new Date().toLocaleDateString()}</p>
        </div>

        <h2 style={{ fontSize: "20px", color: "#334155", borderBottom: "1px solid #e2e8f0", paddingBottom: "5px" }}>1. Executive Summary</h2>
        <div style={{ display: "flex", gap: "20px", marginBottom: "30px", marginTop: "15px" }}>
          <div style={{ flex: 1, padding: "15px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
             <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>Total Volume</p>
             <h3 style={{ margin: "5px 0 0 0", fontSize: "24px", color: "#0f172a" }}>{metrics.total_reviews?.toLocaleString()}</h3>
          </div>
          <div style={{ flex: 1, padding: "15px", backgroundColor: "#f0fdf4", borderRadius: "8px", border: "1px solid #bbf7d0" }}>
             <p style={{ margin: 0, color: "#166534", fontSize: "14px" }}>Positive Sentiment</p>
             <h3 style={{ margin: "5px 0 0 0", fontSize: "24px", color: "#15803d" }}>{metrics.positive_percent}%</h3>
          </div>
          <div style={{ flex: 1, padding: "15px", backgroundColor: "#fef2f2", borderRadius: "8px", border: "1px solid #fecaca" }}>
             <p style={{ margin: 0, color: "#991b1b", fontSize: "14px" }}>Negative Sentiment</p>
             <h3 style={{ margin: "5px 0 0 0", fontSize: "24px", color: "#b91c1c" }}>{metrics.negative_percent}%</h3>
          </div>
        </div>

        <h2 style={{ fontSize: "20px", color: "#334155", borderBottom: "1px solid #e2e8f0", paddingBottom: "5px", marginTop: "30px" }}>2. Semantic Clustering (Critical Issues)</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "15px", marginBottom: "30px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f1f5f9" }}>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #cbd5e1" }}>Severity</th>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #cbd5e1" }}>Identified Issue</th>
              <th style={{ padding: "12px", textAlign: "right", border: "1px solid #cbd5e1" }}>Mentions</th>
            </tr>
          </thead>
          <tbody>
            {(cData || []).map((ci: any, idx: number) => (
               <tr key={idx}>
                 <td style={{ padding: "12px", border: "1px solid #cbd5e1", color: ci.severity === 'critical' ? '#dc2626' : '#ea580c', fontWeight: "bold" }}>{ci.severity.toUpperCase()}</td>
                 <td style={{ padding: "12px", border: "1px solid #cbd5e1", color: "#334155" }}>{ci.issue}</td>
                 <td style={{ padding: "12px", textAlign: "right", border: "1px solid #cbd5e1", color: "#334155" }}>{ci.count}</td>
               </tr>
            ))}
          </tbody>
        </table>

        <h2 style={{ fontSize: "20px", color: "#334155", borderBottom: "1px solid #e2e8f0", paddingBottom: "5px", marginTop: "30px" }}>3. Strategic Intelligence (AI Signals)</h2>
        <div style={{ marginTop: "15px" }}>
           <h4 style={{ color: "#0369a1", margin: "10px 0 5px 0" }}>Emerging Issues (Early Warning)</h4>
           <ul style={{ color: "#475569", marginTop: 0, paddingLeft: "20px" }}>
             {(rData?.signals?.emerging || []).map((s: string, i: number) => <li key={i} style={{ marginBottom: "5px" }}>{s}</li>)}
           </ul>

           <h4 style={{ color: "#16a34a", margin: "15px 0 5px 0", marginTop: "20px" }}>Improving Features</h4>
           <ul style={{ color: "#475569", marginTop: 0, paddingLeft: "20px" }}>
             {(rData?.signals?.improving || []).map((s: string, i: number) => <li key={i} style={{ marginBottom: "5px" }}>{s}</li>)}
           </ul>
        </div>
        
        <div style={{ marginTop: "50px", textAlign: "center", color: "#94a3b8", fontSize: "12px", borderTop: "1px solid #e2e8f0", paddingTop: "20px" }}>
          Engineered natively via Insightful Reviews NLP Database
        </div>
      </div>

    </div>
  );
};

export default Reports;
