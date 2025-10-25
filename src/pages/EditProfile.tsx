import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle, Users, Briefcase, Award, Upload, X
} from "lucide-react";
    
const EditProfile = function () {
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
  const { toast } = useToast();
  
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setPreviewUrl('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const formValues = Object.fromEntries(formData.entries());
    
    const specialtiesValue = formValues.specialties;
    const specialtiesArray = typeof specialtiesValue === 'string' 
      ? specialtiesValue.split(',').map(s => s.trim()).filter(s => s)
      : [];
    
    const profileData = {
      firstName: formValues.firstName || '',
      lastName: formValues.lastName || '',
      email: formValues.email || '',
      phone: formValues.phone || undefined,
      company: formValues.company || undefined,
      serviceType: formValues.serviceType || '',
      experience: formValues.experience || '',
      location: formValues.location || '',
      specialties: specialtiesArray,
      termsAgreed: formValues.terms === 'on',
      marketingOptIn: formValues.marketing === 'on',
      profileImage: previewUrl || undefined,
    };
    
    console.log("Sending data to backend:", JSON.stringify(profileData, null, 2));
    
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
      
      if (e.currentTarget) {
        e.currentTarget.reset();
        handleRemoveImage();
      }
      
    } catch (error) {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .form-container {
          animation: fadeInUp 0.8s ease-out;
        }
        
        .input-focus {
          transition: all 0.3s ease;
        }
        
        .input-focus:focus {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(76, 175, 184, 0.3);
        }

        .profile-upload-hover:hover {
          transform: scale(1.02);
        }
      `}</style>
      
      <div className="w-full max-w-3xl">
        <Card className="form-container p-8 md:p-12 bg-white shadow-2xl border-0 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4CAFB8] via-teal-400 to-[#4CAFB8]"></div>
          
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">Join Our Network</h2>
            <p className="text-gray-600">Fill out your information to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Picture Upload */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-[#4CAFB8] border-opacity-20 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center profile-upload-hover transition-all duration-300">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="profileImage"
                  className="absolute bottom-0 right-0 w-10 h-10 bg-[#4CAFB8] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#3d9ea6] transition-all duration-300 shadow-lg hover:scale-110"
                >
                  <Upload className="w-5 h-5 text-white" />
                </label>
                {previewUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-0 right-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600 transition-all duration-300 shadow-lg hover:scale-110"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            </div>

            {/* Personal Info */}
            <div className="space-y-5">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-[#4CAFB8] bg-opacity-10 rounded-lg">
                  <Users className="w-5 h-5 text-[#4CAFB8]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-gray-700 font-medium">First Name *</Label>
                  <Input 
                    id="firstName" 
                    name="firstName" 
                    placeholder="John" 
                    required 
                    className="input-focus border-gray-300 focus:border-[#4CAFB8] focus:ring-[#4CAFB8]"
                    onFocus={() => setFocusedField('firstName')}
                    onBlur={() => setFocusedField('')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-gray-700 font-medium">Last Name *</Label>
                  <Input 
                    id="lastName" 
                    name="lastName" 
                    placeholder="Doe" 
                    required 
                    className="input-focus border-gray-300 focus:border-[#4CAFB8] focus:ring-[#4CAFB8]"
                    onFocus={() => setFocusedField('lastName')}
                    onBlur={() => setFocusedField('')}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email Address *</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="john@example.com" 
                  required 
                  className="input-focus border-gray-300 focus:border-[#4CAFB8] focus:ring-[#4CAFB8]"
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  type="tel" 
                  placeholder="+1 (555) 123-4567" 
                  className="input-focus border-gray-300 focus:border-[#4CAFB8] focus:ring-[#4CAFB8]"
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField('')}
                />
              </div>
            </div>

            {/* Professional Info */}
            <div className="space-y-5 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-[#4CAFB8] bg-opacity-10 rounded-lg">
                  <Briefcase className="w-5 h-5 text-[#4CAFB8]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Professional Information</h3>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="serviceType" className="text-gray-700 font-medium">Service Type *</Label>
                <select 
                  name="serviceType" 
                  id="serviceType" 
                  className="input-focus flex h-11 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm focus:border-[#4CAFB8] focus:outline-none focus:ring-2 focus:ring-[#4CAFB8] focus:ring-opacity-30" 
                  required
                  onFocus={() => setFocusedField('serviceType')}
                  onBlur={() => setFocusedField('')}
                >
                  <option value="">Select your service type</option>
                  <option value="ic-team">I&C Team/Engineer</option>
                  <option value="solar-design">Solar Design Engineer</option>
                  <option value="equipment">Equipment Provider</option>
                  <option value="consultant">Consultant</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company" className="text-gray-700 font-medium">Company/Organization</Label>
                <Input 
                  id="company" 
                  name="company" 
                  placeholder="Your company name" 
                  className="input-focus border-gray-300 focus:border-[#4CAFB8] focus:ring-[#4CAFB8]"
                  onFocus={() => setFocusedField('company')}
                  onBlur={() => setFocusedField('')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experience" className="text-gray-700 font-medium">Years of Experience *</Label>
                <select 
                  name="experience" 
                  id="experience" 
                  className="input-focus flex h-11 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm focus:border-[#4CAFB8] focus:outline-none focus:ring-2 focus:ring-[#4CAFB8] focus:ring-opacity-30" 
                  required
                  onFocus={() => setFocusedField('experience')}
                  onBlur={() => setFocusedField('')}
                >
                  <option value="">Select experience level</option>
                  <option value="0-2">0-2 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="6-10">6-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location" className="text-gray-700 font-medium">Location *</Label>
                <Input 
                  id="location" 
                  name="location" 
                  placeholder="City, State" 
                  required
                  className="input-focus border-gray-300 focus:border-[#4CAFB8] focus:ring-[#4CAFB8]"
                  onFocus={() => setFocusedField('location')}
                  onBlur={() => setFocusedField('')}
                />
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-5 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-[#4CAFB8] bg-opacity-10 rounded-lg">
                  <Award className="w-5 h-5 text-[#4CAFB8]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Additional Information</h3>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialties" className="text-gray-700 font-medium">Specialties & Certifications</Label>
                <Textarea
                  id="specialties"
                  name="specialties"
                  placeholder="List your key specialties, certifications, e.g., SCADA, PVsyst, NABCEP"
                  className="input-focus h-32 border-gray-300 focus:border-[#4CAFB8] focus:ring-[#4CAFB8] resize-none"
                  onFocus={() => setFocusedField('specialties')}
                  onBlur={() => setFocusedField('')}
                />
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="space-y-3 pt-6 border-t border-gray-200">
              <div className="flex items-start space-x-3 p-3 bg-[#4CAFB8] bg-opacity-5 rounded-xl border border-[#4CAFB8] border-opacity-20 hover:bg-opacity-10 transition-all duration-300">
                <Checkbox id="terms" name="terms" required className="mt-0.5 data-[state=checked]:bg-[#4CAFB8] data-[state=checked]:border-[#4CAFB8]" />
                <Label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed cursor-pointer font-medium">
                  I agree to the Terms of Service and Privacy Policy *
                </Label>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-[#4CAFB8] bg-opacity-5 rounded-xl border border-[#4CAFB8] border-opacity-20 hover:bg-opacity-10 transition-all duration-300">
                <Checkbox id="marketing" name="marketing" className="mt-0.5 data-[state=checked]:bg-[#4CAFB8] data-[state=checked]:border-[#4CAFB8]" />
                <Label htmlFor="marketing" className="text-sm text-gray-700 leading-relaxed cursor-pointer font-medium">
                  I'd like to receive updates about new opportunities and platform features
                </Label>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-[#4CAFB8] to-teal-500 hover:from-[#3d9ea6] hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]" 
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Save Changes
                </span>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default EditProfile;