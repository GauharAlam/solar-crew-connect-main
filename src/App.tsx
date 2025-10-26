// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute"; // Keep this import
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import FindServices from "./pages/FindServices"; // Make sure this is imported
import JoinNetwork from "./pages/JoinNetwork";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EngineerProfile from "./pages/EngineerProfile";
import NotFound from "./pages/NotFound";
import React, { useEffect } from "react";
import EditProfile from "./pages/EditProfile";
import Setting from "./pages/Setting";
import { HowItWorks } from "./components/HowItWorks";
import ViewProfile from "./pages/ViewProfile";

const queryClient = new QueryClient();

// Optional: Helper component to log route changes for debugging
const RouteLogger = () => {
  const location = useLocation();
  useEffect(() => {
    console.log(`Mapsd to: ${location.pathname}`); // Updated log message
  }, [location]);
  return null;
};

const App = () => {
  console.log(
    "App component rendering. Checking token:",
    localStorage.getItem("authToken")
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Header />
          <RouteLogger /> {/* Optional: Keep for debugging */}
          <Routes>
            {/* --- Public Routes --- */}
            <Route path="/" element={<Index />} /> {/* Index page is public */}
            {/* Alias for Index */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/how-it-works" element= {<HowItWorks />} />
            <Route path="/engineers" element= {<EngineerProfile />} />
            {/* --- Moved Routes to Public --- */}
            <Route path="/find-services" element={<FindServices />} />
            <Route path="/services" element={<FindServices />} /> {/* Alias */}
            {/* Add any other explicitly public routes here */}
            {/* --- Protected Routes --- */}
            {/* Routes inside here require login */}
            <Route element={<ProtectedRoute />}>
              {/* edit profile for route */}
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/user/:id/view-profile" element={<ViewProfile />} />
              <Route path="/settings" element={<Setting />} />
              <Route path="/dashboard" element={<Dashboard />} />
              {/* '/find-services' and '/services' were moved out */}
              <Route path="/join" element={<JoinNetwork />} />{" "}
              {/* '/join' remains protected */}
              <Route path="/engineer/:id" element={<EngineerProfile />} />
              {/* Add any other protected routes here */}
            </Route>
            {/* --- Catch-all Not Found Route --- */}
            {/* Make sure this is the LAST route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};
export default App;
