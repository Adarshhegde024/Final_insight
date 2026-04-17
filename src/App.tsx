import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { DatasetProvider } from "@/context/DatasetContext";
import { VisualDatasetProvider } from "@/context/VisualDatasetContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import DashboardLayout from "./components/DashboardLayout";
import Overview from "./pages/dashboard/Overview";
import UploadReviews from "./pages/dashboard/UploadReviews";
import Insights from "./pages/dashboard/Insights";
import Trends from "./pages/dashboard/Trends";
import Reports from "./pages/dashboard/Reports";
import Flagged from "./pages/dashboard/Flagged";

// Visual Pages
import UploadImages from "./pages/visual/UploadImages";
import VisualOverview from "./pages/visual/VisualOverview";
import VisualFlagged from "./pages/visual/VisualFlagged";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DatasetProvider>
        <VisualDatasetProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  {/* Text Analytics */}
                  <Route index element={<Overview />} />
                  <Route path="upload" element={<UploadReviews />} />
                  <Route path="insights" element={<Insights />} />
                  <Route path="trends" element={<Trends />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="flagged" element={<Flagged />} />

                  {/* Visual Analytics */}
                  <Route path="visual-upload" element={<UploadImages />} />
                  <Route path="visual-overview" element={<VisualOverview />} />
                  <Route path="visual-flagged" element={<VisualFlagged />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </VisualDatasetProvider>
      </DatasetProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
