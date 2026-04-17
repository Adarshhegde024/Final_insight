import { useVisualMetrics, useVisualDefects } from "@/hooks/useVisualAnalytics";
import { useVisualDataset } from "@/context/VisualDatasetContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Camera, AlertTriangle, ShieldCheck, PieChart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const VisualOverview = () => {
  const { activeVisualDataset } = useVisualDataset();
  const { data: metrics, isLoading: loadingMetrics } = useVisualMetrics();
  const { data: defects, isLoading: loadingDefects } = useVisualDefects();

  if (!activeVisualDataset) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center max-w-md mx-auto animate-fade-in">
        <div className="h-16 w-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4 border border-blue-500/20">
          <Camera className="h-8 w-8 text-blue-500" />
        </div>
        <h2 className="text-xl font-bold mb-2">No Visual Workspace Selected</h2>
        <p className="text-muted-foreground text-sm mb-6">Create a new image collection or select an existing one to view visual analytics.</p>
      </div>
    );
  }

  if (loadingMetrics || loadingDefects) {
    return <div className="p-8 text-center text-muted-foreground">Loading structural metrics...</div>;
  }

  const MetricCard = ({ title, value, icon: Icon, colorClass }: any) => (
    <Card className="border-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`p-2 rounded-md ${colorClass} bg-opacity-10`}>
          <Icon className={`h-4 w-4 ${colorClass}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{activeVisualDataset.name}</h1>
        <p className="text-muted-foreground text-sm">Visual Inspection Dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard title="Total Images" value={metrics?.total_images || 0} icon={Camera} colorClass="text-blue-500 bg-blue-500" />
        <MetricCard title="Failure Rate (Defects)" value={`${metrics?.defect_percent || 0}%`} icon={AlertTriangle} colorClass="text-destructive bg-destructive" />
        <MetricCard title="Passed QA" value={`${metrics?.passed_percent || 0}%`} icon={ShieldCheck} colorClass="text-success bg-success" />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="border-border shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-blue-500" />
              <div>
                <CardTitle>Physical Defect Distribution</CardTitle>
                <CardDescription>Breakdown of specific issues detected by Llama 3.2 Vision</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {defects && defects.length > 0 ? (
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={defects} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <XAxis type="number" />
                    <YAxis dataKey="defect_type" type="category" width={150} tick={{ fontSize: 12 }} />
                    <Tooltip 
                      cursor={{ fill: 'var(--secondary)' }}
                      contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {defects.map((_, index) => (
                        <Cell key={`cell-${index}`} fill="url(#colorBlue)" />
                      ))}
                    </Bar>
                    <defs>
                      <linearGradient id="colorBlue" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.8}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground text-sm">No defects detected in this dataset.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VisualOverview;
