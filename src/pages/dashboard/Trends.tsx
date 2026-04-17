import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, Legend,
} from "recharts";
import { TrendingUp, TrendingDown, AlertTriangle, Loader2 } from "lucide-react";
import { useSentimentOverTime, useFeatureSentiment, useRecommendations } from "@/hooks/useAnalytics";

const Trends = () => {
  const { data: sentimentOverTime, isLoading: loadingSentiment } = useSentimentOverTime();
  const { data: featureSentiment, isLoading: loadingFeatures } = useFeatureSentiment();
  const { data: recsData, isLoading: loadingRecs } = useRecommendations();

  if (loadingSentiment || loadingFeatures || loadingRecs) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const sentimentData = sentimentOverTime || [];
  const mostComplainedFeatures = (featureSentiment || [])
    .map((f: any) => ({ feature: f.feature, complaints: f.negative }))
    .sort((a: any, b: any) => b.complaints - a.complaints)
    .slice(0, 5);

  const rawSignals = recsData?.signals || { emerging: [], improving: [], anomalies: [] };

  const signalBlocks = [
    { 
      title: "Emerging Issues", 
      icon: AlertTriangle, 
      color: "warning", 
      items: rawSignals.emerging.length > 0 ? rawSignals.emerging : ["No specific emerging issues detected this cycle"] 
    },
    { 
      title: "Improving Features", 
      icon: TrendingUp, 
      color: "success", 
      items: rawSignals.improving.length > 0 ? rawSignals.improving : ["Consistent baseline functionality"] 
    },
    { 
      title: "Anomalies Detected", 
      icon: TrendingDown, 
      color: "destructive", 
      items: rawSignals.anomalies.length > 0 ? rawSignals.anomalies : ["No immediate pattern anomalies discovered"] 
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Trends & Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Track sentiment patterns and emerging issues natively derived by AI</p>
      </div>

      {/* Sentiment Over Time */}
      <div className="glass rounded-xl p-6 animate-fade-up">
        <h3 className="text-lg font-semibold text-foreground mb-4">Sentiment Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sentimentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 13 }} />
            <Legend />
            <Line type="monotone" dataKey="positive" stroke="hsl(var(--success))" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="negative" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="neutral" stroke="hsl(var(--muted-foreground))" strokeWidth={2} dot={false} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Most Complained Features */}
      <div className="glass rounded-xl p-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
        <h3 className="text-lg font-semibold text-foreground mb-4">Most Complained Features</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={mostComplainedFeatures} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis dataKey="feature" type="category" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} width={120} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
            <Bar dataKey="complaints" fill="hsl(var(--destructive))" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* AI Signals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {signalBlocks.map((card, i) => (
          <div key={card.title} className="glass rounded-xl p-5 animate-fade-up" style={{ animationDelay: `${(i + 2) * 0.1}s` }}>
            <div className="flex items-center gap-2 mb-3">
              <card.icon className={`h-4 w-4 text-${card.color}`} />
              <h4 className="font-semibold text-foreground text-sm">{card.title}</h4>
            </div>
            <ul className="space-y-2">
              {card.items.slice(0, 3).map((item) => (
                <li key={item} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full bg-${card.color} mt-1.5 shrink-0`} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trends;
