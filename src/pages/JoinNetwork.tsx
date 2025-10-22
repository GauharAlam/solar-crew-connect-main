// src/pages/JoinNetwork.tsx
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// Removed Select imports as we are using standard select for simplicity with FormData
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast"; // Assuming this is your custom hook
import {
  CheckCircle, Users, DollarSign, Star, Briefcase, Award, TrendingUp
} from "lucide-react";

// Define your backend API URL
const API_URL = 'http://localhost:5001/api'; // Make sure this is correct

const benefits = [
  {
    icon: DollarSign,
    title: "Competitive Rates",
    description: "Earn premium rates for your expertise with transparent pricing"
  },
  {
    icon: Briefcase,
    title: "Quality Projects",
    description: "Work on vetted solar projects with reputable EPC companies"
  },
  {
    icon: Star,
    title: "Build Reputation",
    description: "Showcase your work and build a strong professional profile"
  },
  {
    icon: TrendingUp,
    title: "Grow Your Business",
    description: "Scale your services and expand your client base"
  }
];

const steps = [
  "Complete your professional profile",
  "Upload certifications and portfolio",
  "Get verified by our team",
  "Start receiving project invitations"
];

export default function JoinNetwork() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast(); // Using your custom hook

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const formValues = Object.fromEntries(formData.entries());

    // --- Prepare the data object EXACTLY matching backend schema ---
    const profileData = {
      firstName: formValues.firstName as string || '',
      lastName: formValues.lastName as string || '',
      email: formValues.email as string || '',
      phone: formValues.phone as string || undefined,
      company: formValues.company as string || undefined,
      serviceType: formValues.serviceType as string || '',
      experience: formValues.experience as string || '',
      location: formValues.location as string || '',
      specialties: (formValues.specialties as string || '').split(',').map(s => s.trim()).filter(s => s),
      termsAgreed: formValues.terms === 'on',
      marketingOptIn: formValues.marketing === 'on',
    };
    // --- End data preparation ---


    console.log("Sending data to backend:", JSON.stringify(profileData, null, 2));

    // Basic frontend validation example
    if (!profileData.email || !profileData.firstName || !profileData.lastName || !profileData.termsAgreed) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Name, Email) and agree to the terms.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/engineers/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Form submission failed. Status: ${response.status}`);
      }

      toast({
        title: "Application Submitted!",
        description: "Thank you for joining. We'll review your profile.",
      });

      // ** UPDATED CODE: Added defensive check before resetting **
      if (e.currentTarget) {
        e.currentTarget.reset(); // Clear the form on success
      } else {
        console.warn("Form element not found after submission, could not reset.");
      }
      // ** END UPDATED CODE **


    } catch (error: any) {
      console.error("Join network failed:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Join Our Network of Solar Professionals
          </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Connect with top EPC companies, grow your business, and be part of the solar revolution.
            Whether you're an I&C specialist, design engineer, or equipment provider, we have opportunities for you.
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              500+ Active Professionals
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-accent" />
              $2M+ Earned This Year
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-secondary" />
              98% Success Rate
            </div>
          </div>
        </div>


        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Benefits & Process */}
            <div>
            {/* Benefits */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">Why Join SolarConnect?</h2>
              <div className="space-y-6">
                {benefits.map((benefit, index) => {
                  const IconComponent = benefit.icon;
                  return (
                    <div key={index} className="flex gap-4">
                      <div className="w-12 h-12 bg-gradient-solar rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                        <p className="text-muted-foreground">{benefit.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Process */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">How It Works</h2>
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                      {index + 1}
                    </div>
                    <p className="text-foreground">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Registration Form */}
          <Card className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Join Our Network</h2>
              <p className="text-muted-foreground">Fill out your information to get started</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" name="firstName" placeholder="John" required />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" name="lastName" placeholder="Doe" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" placeholder="john@example.com" required />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 123-4567" />
                </div>
              </div>

              {/* Professional Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Professional Information</h3>
                <div>
                  <Label htmlFor="serviceType">Service Type</Label>
                   <select name="serviceType" id="serviceType" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1" required>
                     <option value="" disabled >Select your service type</option>
                     <option value="ic-team">I&C Team/Engineer</option>
                     <option value="solar-design">Solar Design Engineer</option>
                     <option value="equipment">Equipment Provider</option>
                     <option value="consultant">Consultant</option>
                   </select>
                </div>
                <div>
                  <Label htmlFor="company">Company/Organization</Label>
                  <Input id="company" name="company" placeholder="Your company name" />
                </div>
                 <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                   <select name="experience" id="experience" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1" required>
                     <option value="" disabled >Select experience level</option>
                     <option value="0-2">0-2 years</option>
                     <option value="3-5">3-5 years</option>
                     <option value="6-10">6-10 years</option>
                     <option value="10+">10+ years</option>
                   </select>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" placeholder="City, State" required/>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Additional Information</h3>
                <div>
                  <Label htmlFor="specialties">Specialties & Certifications (comma-separated)</Label>
                  <Textarea
                    id="specialties"
                    name="specialties"
                    placeholder="List your key specialties, certifications, e.g., SCADA, PVsyst, NABCEP"
                    className="h-24"
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" name="terms" required />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the Terms of Service and Privacy Policy
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="marketing" name="marketing" />
                  <Label htmlFor="marketing" className="text-sm">
                    I'd like to receive updates about new opportunities and platform features
                  </Label>
                </div>
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                 {loading ? 'Submitting...' : 'Join SolarConnect Network'}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}