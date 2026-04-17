import { AlertCircle, CheckCircle2, Lightbulb, Package, Megaphone, Settings, Loader2 } from "lucide-react";
import { useCriticalIssues, usePositiveHighlights, useRecommendations } from "@/hooks/useAnalytics";

const Insights = () => {
  const { data: criticalIssues, isLoading: loadingIssues } = useCriticalIssues();
  const { data: positiveHighlights, isLoading: loadingHighlights } = usePositiveHighlights();
  const { data: recommendations, isLoading: loadingRecs } = useRecommendations();

  if (loadingIssues || loadingHighlights || loadingRecs) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const issues = criticalIssues || [];
  const highlights = positiveHighlights || [];
  const recs = recommendations || { product: [], marketing: [], operations: [] };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Critical Insights</h1>
        <p className="text-muted-foreground text-sm mt-1">Key findings from your customer review analysis</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Critical Issues */}
        <div className="glass rounded-xl p-6 animate-fade-up">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <h3 className="text-lg font-semibold text-foreground">Top Critical Issues</h3>
          </div>
          <div className="space-y-3">
            {issues.length > 0 ? issues.map((issue: any, i: number) => (
              <div key={issue.id} className="flex items-start gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                <span className="text-xs font-bold text-destructive bg-destructive/10 rounded-full h-6 w-6 flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{issue.issue}</p>
                  <p className="text-xs text-muted-foreground mt-1">{issue.count} mentions · {issue.severity}</p>
                </div>
              </div>
            )) : (
              <p className="text-muted-foreground text-sm">No critical issues found.</p>
            )}
          </div>
        </div>

        {/* Positive Highlights */}
        <div className="glass rounded-xl p-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <h3 className="text-lg font-semibold text-foreground">Top Positive Highlights</h3>
          </div>
          <div className="space-y-3">
            {highlights.length > 0 ? highlights.map((h: any, i: number) => (
              <div key={h.id} className="flex items-start gap-3 p-3 rounded-lg bg-success/5 border border-success/10">
                <span className="text-xs font-bold text-success bg-success/10 rounded-full h-6 w-6 flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{h.highlight}</p>
                  <p className="text-xs text-muted-foreground mt-1">{h.count} mentions</p>
                </div>
              </div>
            )) : (
              <p className="text-muted-foreground text-sm">No positive highlights found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <h2 className="text-xl font-bold text-foreground pt-2">Recommendations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {[
          { title: "Product Team", icon: Package, items: recs.product || [], color: "primary" },
          { title: "Marketing Team", icon: Megaphone, items: recs.marketing || [], color: "accent" },
          { title: "Operations Team", icon: Settings, items: recs.operations || [], color: "info" },
        ].map((section, si) => (
          <div key={section.title} className="glass rounded-xl p-6 animate-fade-up" style={{ animationDelay: `${si * 0.1}s` }}>
            <div className="flex items-center gap-2 mb-4">
              <div className={`h-8 w-8 rounded-lg bg-${section.color}/10 flex items-center justify-center`}>
                <section.icon className={`h-4 w-4 text-${section.color}`} />
              </div>
              <h3 className="font-semibold text-foreground">{section.title}</h3>
            </div>
            <ul className="space-y-2">
              {section.items.length > 0 ? section.items.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Lightbulb className="h-3.5 w-3.5 text-warning mt-0.5 shrink-0" />
                  {item}
                </li>
              )) : (
                <p className="text-sm text-muted-foreground">No recommendations yet.</p>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Insights;
