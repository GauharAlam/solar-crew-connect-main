// src/pages/Signup.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
// REMOVED: import { supabase } from "@/integrations/supabase/client"; // <-- This line is removed

// Define your backend API URL
const API_URL = 'https://solar-crew-connect-main.onrender.com/api';

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [userType, setUserType] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!userType) {
        toast({
            title: "Account Type Required",
            description: "Please select an account type.",
            variant: "destructive",
        });
        setLoading(false);
        return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
          userType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Account Created!",
        description: "You can now log in.",
      });
      navigate("/login");

    } catch (error: any) {
      console.error("Signup failed:", error);
      toast({
        title: "Signup Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ... rest of the component (return statement with JSX) remains the same
  return (
    <div className="min-h-screen bg-background pt-16 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-foreground">Join SolarConnect</CardTitle>
          <CardDescription>Create your account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Full Name Input */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
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
                placeholder="Create a password"
                minLength={6} // Optional: Add password requirements
                required
              />
            </div>
            {/* User Type Select */}
            <div className="space-y-2">
              <Label htmlFor="userType">Account Type</Label>
              <Select value={userType} onValueChange={setUserType} required>
                <SelectTrigger id="userType">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="epc_company">EPC Company</SelectItem>
                  <SelectItem value="engineer">Engineer/Freelancer</SelectItem>
                  <SelectItem value="tool_provider">Tool Provider</SelectItem>

                  {/* Add other types if necessary */}
                </SelectContent>
              </Select>
            </div>
             {/* Checkboxes */}
                        <div className="space-y-2 pt-6 border-t border-gray-200">
                          <div className="flex items-start space-x-3 p-1 bg-[#4CAFB8] bg-opacity-5 rounded-lg border border-[#4CAFB8] border-opacity-20">
                            <Checkbox id="terms" name="terms" required className="mt-1 data-[state=checked]:bg-[#4CAFB8] data-[state=checked]:border-[#4CAFB8]" />
                            <Label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                              I agree to the Terms of Service and Privacy Policy *
                            </Label>
                          </div>
                          
                          <div className="flex items-start space-x-3 p-1 bg-[#4CAFB8] bg-opacity-5 rounded-lg border border-[#4CAFB8] border-opacity-20">
                            <Checkbox id="marketing" name="marketing" className="mt-1 data-[state=checked]:bg-[#4CAFB8] data-[state=checked]:border-[#4CAFB8]" />
                            <Label htmlFor="marketing" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                              I'd like to receive updates about new opportunities and platform features
                            </Label>
                          </div>
                        </div>
            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
          {/* Link to Login */}
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}