import { MessageSquare, ThumbsUp, ThumbsDown, Minus, AlertTriangle, Copy, Loader2 } from "lucide-react";
import MetricCard from "@/components/MetricCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useOverviewMetrics, useFeatureSentiment } from "@/hooks/useAnalytics";

const Overview = () => {
  const { data: overviewMetrics, isLoading: loadingOverview } = useOverviewMetrics();
  const { data: featureSentiment, isLoading: loadingFeatures } = useFeatureSentiment();

  if (loadingOverview || loadingFeatures) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Fallbacks if tables are empty
  const metrics = overviewMetrics || {
    total_reviews: 0, positive_percent: 0, negative_percent: 0, neutral_percent: 0, spam_count: 0, duplicate_count: 0
  };
  const features = featureSentiment || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">Key metrics from your customer review analysis</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <MetricCard title="Total Reviews" value={metrics.total_reviews?.toLocaleString() || "0"} icon={MessageSquare} color="primary" />
        <MetricCard title="Positive" value={`${metrics.positive_percent || 0}%`} icon={ThumbsUp} color="success" />
        <MetricCard title="Negative" value={`${metrics.negative_percent || 0}%`} icon={ThumbsDown} color="destructive" />
        <MetricCard title="Neutral" value={`${metrics.neutral_percent || 0}%`} icon={Minus} color="muted" />
        <MetricCard title="Spam" value={metrics.spam_count || 0} icon={AlertTriangle} color="warning" />
        <MetricCard title="Duplicates" value={metrics.duplicate_count || 0} icon={Copy} color="info" />
      </div>

      {/* Feature Sentiment */}
      <div className="glass rounded-xl p-6 animate-fade-up" style={{ animationDelay: "0.2s" }}>
        <h3 className="text-lg font-semibold text-foreground mb-4">Feature Sentiment Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Feature</th>
                <th className="text-center py-3 px-4 text-success font-medium">Positive</th>
                <th className="text-center py-3 px-4 text-destructive font-medium">Negative</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">Neutral</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Distribution</th>
              </tr>
            </thead>
            <tbody>
              {features.map((row: any) => (
                <tr key={row.feature} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-4 font-medium text-foreground">{row.feature}</td>
                  <td className="text-center py-3 px-4 text-success">{row.positive}%</td>
                  <td className="text-center py-3 px-4 text-destructive">{row.negative}%</td>
                  <td className="text-center py-3 px-4 text-muted-foreground">{row.neutral}%</td>
                  <td className="py-3 px-4">
                    <div className="flex h-2 rounded-full overflow-hidden bg-muted">
                      <div className="bg-success" style={{ width: `${row.positive}%` }} />
                      <div className="bg-destructive" style={{ width: `${row.negative}%` }} />
                      <div className="bg-muted-foreground/30" style={{ width: `${row.neutral}%` }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick chart */}
      <div className="glass rounded-xl p-6 animate-fade-up" style={{ animationDelay: "0.3s" }}>
        <h3 className="text-lg font-semibold text-foreground mb-4">Complaints by Feature</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={features.map((f: any) => ({ name: f.feature, negative: f.negative }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
            <Bar dataKey="negative" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Overview;
