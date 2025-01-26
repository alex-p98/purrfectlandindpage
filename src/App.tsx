import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import AddCat from "@/pages/AddCat";
import CatProfile from "@/pages/CatProfile";
import CustomDiet from "@/pages/CustomDiet";
import Auth from "@/pages/Auth";

const queryClient = new QueryClient();

// TODO: Replace with actual auth check
const isAuthenticated = false;

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route 
              path="/add-cat" 
              element={isAuthenticated ? <AddCat /> : <Navigate to="/auth" />} 
            />
            <Route 
              path="/cats/:name" 
              element={isAuthenticated ? <CatProfile /> : <Navigate to="/auth" />} 
            />
            <Route 
              path="/custom-diet" 
              element={isAuthenticated ? <CustomDiet /> : <Navigate to="/auth" />} 
            />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;