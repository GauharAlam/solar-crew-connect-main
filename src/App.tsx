// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // Import Navigate
import { Header } from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute"; // Import the component
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import FindServices from "./pages/FindServices";
import JoinNetwork from "./pages/JoinNetwork";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EngineerProfile from "./pages/EngineerProfile";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react"; // Import useEffect and useState

const queryClient = new QueryClient();

const App = () => {
  // Optional: Add state to manage initial auth check if needed,
  // but localStorage check in ProtectedRoute often suffices.
  // const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));

  // useEffect(() => {
  //   const checkAuth = () => {
  //     setIsAuthenticated(!!localStorage.getItem('authToken'));
  //   };
  //   checkAuth();
  //   // Optional: Listen to storage events if login/logout might happen in other tabs
  //   window.addEventListener('storage', checkAuth);
  //   return () => window.removeEventListener('storage', checkAuth);
  // }, []);


  return(
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Header /> {/* Header is outside protected routes */}
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* Add any other public landing/info pages here */}


            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              {/* If logged in, redirect root "/" to dashboard, else login handles it */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              {/* <Route path="/" element={<Index />} /> */} {/* Or keep Index public if needed */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/find-services" element={<FindServices />} />
              <Route path="/services" element={<FindServices />} /> {/* Alias */}
              <Route path="/join" element={<JoinNetwork />} /> {/* Maybe protect this too? */}
              <Route path="/how-it-works" element={<Index />} /> {/* Or make public? */}
              <Route path="/engineer/:id" element={<EngineerProfile />} />
              {/* Add other protected routes here */}
            </Route>

            {/* Catch-all Not Found Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
export default App;