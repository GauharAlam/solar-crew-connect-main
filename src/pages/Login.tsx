// src/pages/Login.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
// REMOVED: import { supabase } from "@/integrations/supabase/client"; <-- This line is removed

// Define your backend API URL
const API_URL = 'http://localhost:5001/api'; // Or your backend's URL

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      // --- Store the JWT Token ---
      if (data.token) {
        localStorage.setItem('authToken', data.token); // Store token in localStorage
        localStorage.setItem('userInfo', JSON.stringify({ // Store user info
            id: data._id,
            fullName: data.fullName,
            email: data.email,
            userType: data.userType,
        }));
      } else {
        throw new Error("Login successful, but no token received.");
      }
      // --- End Token Storage ---

      toast({
        title: "Welcome back!",
        description: "You've been logged in successfully.",
      });
      navigate("/dashboard"); // Navigate to dashboard on success

    } catch (error: any) {
      console.error("Login failed:", error);
      toast({
        title: "Login Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
      localStorage.removeItem('authToken'); // Clear token on failure
      localStorage.removeItem('userInfo'); // Clear user info on failure
    } finally {
      setLoading(false);
    }
  };

   // ... rest of the component (return statement with JSX) remains the same
   return (
    <div className="min-h-screen bg-background pt-16 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-foreground">Welcome Back</CardTitle>
          <CardDescription>Sign in to your SolarConnect account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          {/* Link to Signup */}
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}