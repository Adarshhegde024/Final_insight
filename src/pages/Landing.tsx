import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChart3, Brain, TrendingUp, Shield, Zap, ArrowRight } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const features = [
  { icon: Brain, title: "AI-Powered Analysis", desc: "Extract sentiment, themes, and trends automatically from thousands of reviews." },
  { icon: BarChart3, title: "Rich Visualizations", desc: "Interactive charts and dashboards for deep, actionable insights." },
  { icon: TrendingUp, title: "Trend Detection", desc: "Spot emerging issues and opportunities before they escalate." },
  { icon: Shield, title: "Spam Detection", desc: "Automatically flag spam, duplicates, and anomalies in your data." },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">ReviewIQ</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button onClick={() => navigate("/dashboard")} size="sm">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
            <Zap className="h-3 w-3" /> AI-Powered Review Intelligence
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight mb-4">
            Turn Customer Reviews into{" "}
            <span className="text-primary">Actionable Insights</span>
          </h1>

          <p className="text-base text-muted-foreground max-w-xl mx-auto mb-8">
            Upload thousands of reviews and let AI analyze sentiment, detect trends, flag issues, and generate recommendations — in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate("/dashboard")} size="lg" className="text-sm px-6">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Dashboard preview */}
        <div className="max-w-3xl mx-auto mt-14">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {[
                { label: "Total Reviews", value: "12,847", color: "text-foreground" },
                { label: "Positive", value: "64%", color: "text-success" },
                { label: "Negative", value: "22%", color: "text-destructive" },
                { label: "Neutral", value: "14%", color: "text-muted-foreground" },
              ].map((m) => (
                <div key={m.label} className="bg-secondary/50 rounded-lg p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                  <p className={`text-xl font-semibold ${m.color}`}>{m.value}</p>
                </div>
              ))}
            </div>
            <div className="h-28 bg-secondary/30 rounded-lg flex items-center justify-center">
              <div className="flex items-end gap-1.5 h-16">
                {[40, 65, 50, 75, 60, 80, 70, 85, 55, 90, 72, 78].map((h, i) => (
                  <div key={i} className="w-3 rounded-t bg-primary/70" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-foreground mb-2">Everything you need to understand your customers</h2>
          <p className="text-sm text-muted-foreground text-center mb-10 max-w-lg mx-auto">
            Powerful AI-driven tools to transform raw reviews into strategic intelligence.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <f.icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-medium text-foreground text-sm mb-1.5">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-primary flex items-center justify-center">
              <Zap className="h-2.5 w-2.5 text-primary-foreground" />
            </div>
            ReviewIQ
          </div>
          <p>© 2026 ReviewIQ. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
