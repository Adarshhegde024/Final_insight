import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, AlertTriangle, Copy, Eye, Loader2 } from "lucide-react";
import { useFlaggedReviews } from "@/hooks/useAnalytics";

const typeConfig = {
  spam: { label: "Spam", icon: AlertTriangle, variant: "destructive" as const },
  duplicate: { label: "Duplicate", icon: Copy, variant: "secondary" as const },
  needs_review: { label: "Needs Review", icon: Eye, variant: "outline" as const },
};

const Flagged = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const { data: flaggedReviews, isLoading } = useFlaggedReviews();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const reviewsList = flaggedReviews || [];

  const filtered = reviewsList.filter((r: any) => {
    const matchSearch = r.text.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || r.type === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Flagged Reviews</h1>
        <p className="text-muted-foreground text-sm mt-1">Reviews flagged for spam, duplication, or manual review</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search flagged reviews..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-card border-border" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {["all", "spam", "duplicate", "needs_review"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                filter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {f === "all" ? "All" : f === "needs_review" ? "Needs Review" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((review: any, i: number) => {
          const config = typeConfig[review.type as keyof typeof typeConfig] || typeConfig.needs_review;
          return (
            <div key={review.id} className="glass rounded-xl p-4 flex items-start gap-4 animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="shrink-0 mt-0.5">
                <config.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{review.text}</p>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant={config.variant}>{config.label}</Badge>
                  <span className="text-xs text-muted-foreground">Confidence: {review.confidence}%</span>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No flagged reviews match your criteria.</div>
        )}
      </div>
    </div>
  );
};

export default Flagged;
