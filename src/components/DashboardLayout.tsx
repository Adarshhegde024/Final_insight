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
import { LayoutDashboard, Upload, Lightbulb, TrendingUp, FileText, Flag, Zap, LogOut } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { useDataset } from "@/context/DatasetContext";
import { toast } from "sonner";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Upload Reviews", url: "/dashboard/upload", icon: Upload },
  { title: "Insights", url: "/dashboard/insights", icon: Lightbulb },
  { title: "Trends", url: "/dashboard/trends", icon: TrendingUp },
  { title: "Reports", url: "/dashboard/reports", icon: FileText },
  { title: "Flagged Reviews", url: "/dashboard/flagged", icon: Flag },
];

function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { datasets, activeDataset, setActiveDatasetId } = useDataset();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      navigate("/auth");
    } catch (error) {
      toast.error("Failed to log out");
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
      
      {/* Workspace Switcher */}
      <SidebarContent>
        <div className="px-4 py-2 border-b border-sidebar-border/50">
          {!collapsed ? (
            <div className="flex flex-col space-y-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Workspace</span>
              <select 
                className="w-full bg-secondary text-secondary-foreground text-sm rounded-md p-1.5 border-none focus:ring-1 focus:ring-primary outline-none cursor-pointer"
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
            </div>
          ) : (
             <div className="h-8 w-8 mx-auto bg-secondary rounded-md flex items-center justify-center text-xs font-bold text-secondary-foreground">
               {activeDataset?.name?.charAt(0).toUpperCase() || "-"}
             </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
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
      </SidebarContent>

      <div className="p-4 mt-auto border-t border-sidebar-border">
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
              <h2 className="text-xs sm:text-sm font-medium text-muted-foreground hidden sm:block">Customer Review Intelligence</h2>
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
