import { Button } from "@/components/ui/button";
import { FileDown, BarChart3, MessageSquare, TrendingUp, Shield, Loader2 } from "lucide-react";
import { toast } from "sonner";
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

  const isLoading = load1 || load2 || load3 || load4 || load5;

  const handleDownload = () => {
    if (!mData) {
      toast.error("No data available to generate report.");
      return;
    }

    toast.success("Compiling AI data... Report download starting.");

    // Generate textual report
    let report = `====================================================\n`;
    report += `         INSIGHTFUL REVIEWS - EXECUTIVE REPORT      \n`;
    report += `====================================================\n\n`;

    report += `[ OVERVIEW METRICS ]\n`;
    report += `- Total Reviews Analyzed: ${mData.total_reviews?.toLocaleString()}\n`;
    report += `- Overall Sentiment: ${mData.positive_percent}% Positive | ${mData.neutral_percent}% Neutral | ${mData.negative_percent}% Negative\n`;
    report += `- Flagged Content: ${mData.spam_count} Spam | ${mData.duplicate_count} Duplicates\n\n`;

    report += `[ CRITICAL ISSUES (Natively Clustered) ]\n`;
    (cData || []).forEach((c: any) => {
      report += `- (${c.severity.toUpperCase()}) ${c.issue} [Frequency: ${c.count}]\n`;
    });
    report += `\n`;

    report += `[ POSITIVE HIGHLIGHTS ]\n`;
    (pData || []).forEach((p: any) => {
      report += `- ${p.highlight} [Frequency: ${p.count}]\n`;
    });
    report += `\n`;

    report += `[ AI GENERATED RECOMMENDATIONS ]\n`;
    report += `Product:\n`;
    (rData?.product || []).forEach((r: any) => report += `  - ${r}\n`);
    report += `Marketing:\n`;
    (rData?.marketing || []).forEach((r: any) => report += `  - ${r}\n`);
    report += `Operations:\n`;
    (rData?.operations || []).forEach((r: any) => report += `  - ${r}\n`);
    report += `\n`;

    report += `[ EMERGING SIGNALS ]\n`;
    (rData?.signals?.emerging || []).forEach((s: any) => report += `- ${s}\n`);
    report += `\n`;

    report += `Report generated securely via Insightful & Groq AI Engine.`;

    // Create the Blob for downloading
    const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Executive_Report_${new Date().toISOString().split('T')[0]}.txt`;
    
    // Trigger Native Download
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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

  // Calculate dynamic trend string
  const trendString = sData && sData.length >= 2 
    ? `Sentiment trending at ${sData[sData.length - 1]?.positive}% positivity` 
    : "Not enough historical data";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reports</h1>
        <p className="text-muted-foreground text-sm mt-1">Download your executive summary and analysis</p>
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

      <Button onClick={handleDownload} className="w-full h-12 text-base gradient-primary border-0 text-primary-foreground hover:opacity-90 transition-opacity">
        <FileDown className="mr-2 h-4 w-4" /> Download Executive Report
      </Button>
    </div>
  );
};

export default Reports;
