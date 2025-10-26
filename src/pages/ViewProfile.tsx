import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Calendar,
  User,
  Briefcase,
  Edit,
  Share2,
  ArrowLeft,
  MapPin,
  Clock,
  Shield,
  Download,
  Copy,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  userType: "engineer" | "service" | "company";
  profileImage?: string;
  createdAt: string;
  bio?: string;
  location?: string;
  specialties?: string[];
  rating?: number;
  totalProjects?: number;
  hourlyRate?: number;
}

// Sample user data - replace with actual data from API
const sampleUser: UserProfile = {
  id: "123456",
  fullName: "Gauhar Alam",
  email: "danish@gmail.com",
  userType: "engineer",
  profileImage: "/api/placeholder/200/200",
  createdAt: "2025-10-20T14:52:55.962+00:00",
  bio: "Experienced solar engineer with 10+ years in utility-scale I&C and commissioning. Passionate about renewable energy solutions.",
  location: "Phoenix, AZ",
  specialties: ["Utility-Scale I&C", "SCADA Systems", "Commissioning", "Thermal Imaging"],
  rating: 4.9,
  totalProjects: 127,
  hourlyRate: 85,
};

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getUserTypeColor = (type: string) => {
  switch (type) {
    case "engineer":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "service":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "company":
      return "bg-green-100 text-green-700 border-green-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const getUserTypeLabel = (type: string): string => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

export default function ViewProfile() {
  const navigate = useNavigate();
  const user = sampleUser;
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(user.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
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

        .animate-fade-down {
          animation: fadeInDown 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slideInUp 0.6s ease-out 0.2s backwards;
        }

        .profile-header-gradient {
          background: linear-gradient(135deg, #4CAFB8 0%, #3d9ba3 100%);
        }

        .avatar-ring {
          position: relative;
          transition: all 0.3s ease;
        }

        .avatar-ring:hover {
          transform: scale(1.05);
        }

        .stat-card {
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(76, 175, 184, 0.15);
        }

        .badge-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-[#4CAFB8] mb-6 transition-colors animate-fade-down"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Go Back</span>
        </button>

        {/* Profile Header Card */}
        <Card className="overflow-hidden border-0 shadow-xl animate-fade-down mb-6">
          <div className="profile-header-gradient h-32 sm:h-40"></div>

          <CardContent className="px-4 sm:px-8 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6 -mt-16 mb-6">
              {/* Avatar */}
              <div className="avatar-ring">
                <Avatar className="h-32 w-32 sm:h-40 sm:w-40 border-4 border-white shadow-lg">
                  <AvatarImage src={user.profileImage} alt={user.fullName} />
                  <AvatarFallback className="bg-gradient-to-br from-[#4CAFB8] to-[#3d9ba3] text-white text-4xl font-bold">
                    {getInitials(user.fullName)}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* User Info Header */}
              <div className="flex-1 pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                      {user.fullName}
                    </h1>
                    <Badge
                      className={`mt-2 px-3 py-1 text-sm font-semibold border ${getUserTypeColor(
                        user.userType
                      )}`}
                    >
                      <Shield className="w-3 h-3 mr-1" />
                      {getUserTypeLabel(user.userType)}
                    </Badge>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => navigate("/edit-profile")}
                      className="flex items-center gap-2 bg-[#4CAFB8] hover:bg-[#3d9ba3] text-white"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="hidden sm:inline">Edit Profile</span>
                      <span className="sm:hidden">Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 border-[#4CAFB8] text-[#4CAFB8] hover:bg-[#4CAFB8] hover:text-white"
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Share</span>
                    </Button>
                  </div>
                </div>

                {/* Bio */}
                {user.bio && (
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    {user.bio}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Section */}
        {user.userType === "engineer" && user.rating && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 animate-slide-up">
            <div className="stat-card">
              <Card className="border border-gray-200 hover:border-[#4CAFB8]/30">
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center mb-2">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{user.rating}</p>
                  <p className="text-xs text-gray-600 mt-1">Rating</p>
                </CardContent>
              </Card>
            </div>

            <div className="stat-card">
              <Card className="border border-gray-200 hover:border-[#4CAFB8]/30">
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Briefcase className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{user.totalProjects}</p>
                  <p className="text-xs text-gray-600 mt-1">Projects</p>
                </CardContent>
              </Card>
            </div>

            <div className="stat-card">
              <Card className="border border-gray-200 hover:border-[#4CAFB8]/30">
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center mb-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <span className="text-lg font-bold text-green-600">$</span>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">${user.hourlyRate}</p>
                  <p className="text-xs text-gray-600 mt-1">/hour</p>
                </CardContent>
              </Card>
            </div>

            <div className="stat-card">
              <Card className="border border-gray-200 hover:border-[#4CAFB8]/30">
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center mb-2">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">100%</p>
                  <p className="text-xs text-gray-600 mt-1">Complete</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Specialties */}
            {user.specialties && user.specialties.length > 0 && (
              <Card className="border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="p-2 bg-[#4CAFB8]/10 rounded-lg">
                      <Briefcase className="w-5 h-5 text-[#4CAFB8]" />
                    </div>
                    Specialties
                  </CardTitle>
                  <CardDescription>
                    Areas of expertise and skills
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.specialties.map((specialty, index) => (
                      <Badge
                        key={index}
                        className="badge-hover bg-gradient-to-r from-[#4CAFB8]/10 to-[#3d9ba3]/10 text-[#4CAFB8] border border-[#4CAFB8]/20 hover:border-[#4CAFB8] cursor-pointer transition-all"
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Location */}
            {user.location && (
              <Card className="border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 font-medium">{user.location}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card className="border border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Mail className="w-5 h-5 text-orange-600" />
                  </div>
                  Contact Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-gray-600 font-semibold uppercase mb-1">
                    Email Address
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-800 break-all font-medium">
                      {user.email}
                    </p>
                    <button
                      onClick={handleCopyEmail}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Copy email"
                    >
                      {copied ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400 hover:text-[#4CAFB8]" />
                      )}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card className="border border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  Account Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-gray-600 font-semibold uppercase mb-1">
                    User ID
                  </p>
                  <p className="text-sm text-gray-800 font-mono break-all">{user.id}</p>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-xs text-gray-600 font-semibold uppercase mb-1">
                    Member Since
                  </p>
                  <div className="flex items-center gap-1 text-sm text-gray-800">
                    <Calendar className="w-4 h-4 text-[#4CAFB8]" />
                    {formatDate(user.createdAt)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Download Profile */}
            <Button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#4CAFB8] to-[#3d9ba3] hover:from-[#3d9ba3] hover:to-[#2d7a83] text-white">
              <Download className="w-4 h-4" />
              Download Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}