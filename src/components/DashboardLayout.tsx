import { Outlet, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import { LayoutDashboard, Upload, Lightbulb, TrendingUp, FileText, Flag, Zap, LogOut, Camera, Image as ImageIcon, Trash2 } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { useDataset } from "@/context/DatasetContext";
import { useVisualDataset } from "@/context/VisualDatasetContext";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const textNavItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Upload Reviews", url: "/dashboard/upload", icon: Upload },
  { title: "Insights", url: "/dashboard/insights", icon: Lightbulb },
  { title: "Trends", url: "/dashboard/trends", icon: TrendingUp },
  { title: "Reports", url: "/dashboard/reports", icon: FileText },
  { title: "Flagged Reviews", url: "/dashboard/flagged", icon: Flag },
];

const visualNavItems = [
  { title: "Upload Images", url: "/dashboard/visual-upload", icon: Upload },
  { title: "Visual Dashboard", url: "/dashboard/visual-overview", icon: Camera },
  { title: "Defect Gallery", url: "/dashboard/visual-flagged", icon: ImageIcon },
];

function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const { datasets, activeDataset, setActiveDatasetId, refreshDatasets } = useDataset();
  const { visualDatasets, activeVisualDataset, setActiveVisualDataset, refreshVisualDatasets } = useVisualDataset();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      navigate("/auth");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  const handleDeleteTextDataset = async () => {
    if (!activeDataset) return;
    if (!confirm(`Are you sure you want to permanently delete the text dataset "${activeDataset.name}"?`)) return;
    
    const toastId = toast.loading("Deleting dataset...");
    try {
      await supabase.from("datasets").delete().eq("id", activeDataset.id);
      await refreshDatasets();
      toast.success("Dataset deleted successfully", { id: toastId });
    } catch(err) {
      toast.error("Failed to delete dataset", { id: toastId });
    }
  };

  const handleDeleteVisualDataset = async () => {
    if (!activeVisualDataset) return;
    if (!confirm(`Are you sure you want to permanently delete the visual dataset "${activeVisualDataset.name}"?`)) return;
    
    const toastId = toast.loading("Deleting image collection...");
    try {
      await supabase.from("visual_datasets").delete().eq("id", activeVisualDataset.id);
      await refreshVisualDatasets();
      toast.success("Image gathering deleted successfully", { id: toastId });
    } catch(err) {
      toast.error("Failed to delete collection", { id: toastId });
    }
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <div className="p-4 flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
        <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
          <Zap className="h-4 w-4 text-primary-foreground" />
        </div>
        {!collapsed && <span className="font-bold text-foreground">ReviewIQ</span>}
      </div>
      
      <SidebarContent>
        {/* TEXT INTELLIGENCE HUB */}
        <div className="px-4 py-3 border-b border-sidebar-border bg-secondary/10">
          {!collapsed ? (
            <div className="flex flex-col space-y-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Text Intelligence</span>
              <div className="flex items-center gap-2">
                <select 
                  className="w-full bg-background border border-border text-foreground text-sm rounded-md p-1.5 focus:ring-1 focus:ring-primary outline-none cursor-pointer"
                  value={activeDataset?.id || ""}
                  onChange={(e) => setActiveDatasetId(e.target.value)}
                >
                  {datasets.length === 0 ? (
                    <option value="" disabled>No Datasets</option>
                  ) : (
                    datasets.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))
                  )}
                </select>
                {activeDataset && (
                  <button onClick={handleDeleteTextDataset} title="Delete Dataset" className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="h-8 w-8 mx-auto bg-primary/20 rounded-md flex items-center justify-center text-xs font-bold text-primary">T</div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {textNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className="hover:bg-sidebar-accent/50 transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* VISUAL INTELLIGENCE HUB */}
        <div className="px-4 py-3 border-y border-sidebar-border bg-secondary/10 mt-2">
          {!collapsed ? (
            <div className="flex flex-col space-y-2">
              <span className="text-xs font-bold text-info uppercase tracking-wider text-blue-500">Visual Intelligence</span>
              <div className="flex items-center gap-2">
                <select 
                  className="w-full bg-background border border-border text-foreground text-sm rounded-md p-1.5 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
                  value={activeVisualDataset?.id || ""}
                  onChange={(e) => setActiveVisualDataset(visualDatasets.find(d => d.id === e.target.value) || null)}
                >
                  {visualDatasets.length === 0 ? (
                    <option value="" disabled>No Image Sets</option>
                  ) : (
                    visualDatasets.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))
                  )}
                </select>
                {activeVisualDataset && (
                  <button onClick={handleDeleteVisualDataset} title="Delete Image Set" className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="h-8 w-8 mx-auto bg-blue-500/20 rounded-md flex items-center justify-center text-xs font-bold text-blue-500">V</div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {visualNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="hover:bg-sidebar-accent/50 transition-colors"
                      activeClassName="bg-blue-500/10 text-blue-500 font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>

      <div className="p-4 mt-auto border-t border-sidebar-border bg-card">
        {!collapsed && user && (
          <div className="text-xs text-muted-foreground truncate mb-4 px-2">
            Logged in as:<br/>
            <span className="font-medium text-foreground">{user.email}</span>
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors">
              <LogOut className="mr-2 h-4 w-4" />
              {!collapsed && <span>Sign Out</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </Sidebar>
  );
}

const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border px-3 sm:px-4 bg-card">
            <div className="flex items-center">
              <SidebarTrigger className="mr-2 sm:mr-4" />
              <h2 className="text-xs sm:text-sm font-medium text-muted-foreground hidden sm:block">Enterprise Intelligence Core</h2>
            </div>
            <ThemeToggle />
          </header>
          <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
