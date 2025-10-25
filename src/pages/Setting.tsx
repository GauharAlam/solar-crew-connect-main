import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, CheckCircle, User } from "lucide-react";

export default function Setting() {
  const [availableStatus, setAvailableStatus] = useState(true);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleToggle = () => {
    setAvailableStatus(!availableStatus);
  };

  const handleSave = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Settings Updated!",
        description: `Your availability status is now ${availableStatus ? 'visible' : 'hidden'}.`,
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50 py-12 px-4 sm:px-6 lg:px-8 mt-10">
      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
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

        .animate-fade-down {
          animation: fadeInDown 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slideInUp 0.6s ease-out 0.2s backwards;
        }

        .toggle-switch {
          position: relative;
          width: 60px;
          height: 30px;
          background-color: #e5e7eb;
          border-radius: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .toggle-switch.active {
          background: linear-gradient(135deg, #4CAFB8 0%, #3d9ea6 100%);
        }

        .toggle-slider {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 24px;
          height: 24px;
          background-color: white;
          border-radius: 50%;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .toggle-switch.active .toggle-slider {
          left: 33px;
        }
      `}</style>

      {/* Floating Background Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-[#4CAFB8] opacity-10 rounded-full blur-3xl" style={{ animation: 'float 6s ease-in-out infinite' }}></div>
      <div className="absolute bottom-40 right-40 w-40 h-40 bg-teal-400 opacity-10 rounded-full blur-3xl" style={{ animation: 'float 6s ease-in-out infinite 2s' }}></div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-down">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-[#4CAFB8] to-teal-500 rounded-2xl shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Settings
              </h1>
              <p className="text-gray-600 mt-1">Manage your account preferences</p>
            </div>
          </div>
        </div>

        {/* Settings Card */}
        <Card className="animate-slide-up shadow-2xl border-0 overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4CAFB8] via-teal-400 to-[#4CAFB8]"></div>
          
          <CardHeader className="bg-gradient-to-b from-white to-slate-50 pb-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-[#4CAFB8] bg-opacity-10 rounded-lg">
                <User className="w-5 h-5 text-[#4CAFB8]" />
              </div>
              <div>
                <CardTitle className="text-2xl text-gray-900">Profile Visibility</CardTitle>
                <CardDescription className="mt-1">Control how others see your availability</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8 space-y-6">
            {/* Availability Status Toggle */}
            <div className="p-6 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-gray-200 hover:border-[#4CAFB8] hover:border-opacity-30 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl transition-all duration-300 ${availableStatus ? 'bg-[#4CAFB8] bg-opacity-10' : 'bg-gray-100'}`}>
                    {availableStatus ? (
                      <Eye className="w-6 h-6 text-[#4CAFB8]" />
                    ) : (
                      <EyeOff className="w-6 h-6 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Label className="text-lg font-semibold text-gray-900 cursor-pointer" onClick={handleToggle}>
                      Show Available Status
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      {availableStatus 
                        ? "Your availability status is visible to others" 
                        : "Your availability status is hidden from others"}
                    </p>
                    <div className="mt-3 flex items-center space-x-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
                        availableStatus 
                          ? 'bg-[#4CAFB8] bg-opacity-10 text-[#4CAFB8]' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {availableStatus ? 'Visible' : 'Hidden'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Custom Toggle Switch */}
                <div 
                  className={`toggle-switch ${availableStatus ? 'active' : ''}`}
                  onClick={handleToggle}
                >
                  <div className="toggle-slider"></div>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-start space-x-3">
                <div className="p-1.5 bg-blue-100 rounded-lg mt-0.5">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-blue-800 font-medium">Privacy Information</p>
                  <p className="text-xs text-blue-700 mt-1">
                    When your status is visible, other users can see if you're currently available for projects and collaborations.
                  </p>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-gray-200">
              <Button 
                onClick={handleSave}
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-[#4CAFB8] to-teal-500 hover:from-[#3d9ea6] hover:to-teal-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Save Changes
                  </span>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            More settings options coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}