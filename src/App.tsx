import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "@/pages/Index";
import AddCat from "@/pages/AddCat";
import CatProfile from "@/pages/CatProfile";
import CustomDiet from "@/pages/CustomDiet";
import Auth from "@/pages/Auth";
import { useAuth } from "@/contexts/AuthContext";

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  
  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route 
                path="/add-cat" 
                element={
                  <PrivateRoute>
                    <AddCat />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/cats/:name" 
                element={
                  <PrivateRoute>
                    <CatProfile />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/custom-diet" 
                element={
                  <PrivateRoute>
                    <CustomDiet />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;