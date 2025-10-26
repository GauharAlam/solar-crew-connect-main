import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  Briefcase,
  Phone,
  Mail,
  Star,
  Users,
  Search,
  Filter,
  Clock,
  X,
  CheckCircle,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

interface Engineer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  serviceType: string;
  experience: string;
  location: string;
  specialties: string[];
  rating: number;
  total_projects: number;
  availability: "available" | "busy" | "unavailable";
  createdAt: string;
}

// Sample engineers data - replace with actual API data
const sampleEngineers: Engineer[] = [
  {
    _id: "68fd1ba75eb748f559be508f",
    firstName: "Gauhar",
    lastName: "Alam",
    email: "danishzayan6@gmail.com",
    phone: "+918409153351",
    company: "Tech Solutions Inc.",
    serviceType: "solar-design",
    experience: "0-2",
    location: "Mumbai",
    specialties: ["Solar Design", "AutoCAD", "PVsyst"],
    rating: 4.8,
    total_projects: 15,
    availability: "available",
    createdAt: "2025-10-25T18:49:11.533+00:00",
  },
  {
    _id: "68fd1ba75eb748f559be5090",
    firstName: "Priya",
    lastName: "Sharma",
    email: "priya.sharma@email.com",
    phone: "+919876543210",
    company: "Solar Energy Corp",
    serviceType: "installation",
    experience: "3-5",
    location: "Bangalore",
    specialties: ["Installation", "Commissioning", "Maintenance"],
    rating: 4.9,
    total_projects: 42,
    availability: "available",
    createdAt: "2025-09-15T10:30:00.000+00:00",
  },
  {
    _id: "68fd1ba75eb748f559be5091",
    firstName: "Rajesh",
    lastName: "Kumar",
    email: "rajesh.k@email.com",
    phone: "+918765432109",
    company: "Power Solutions",
    serviceType: "electrical-work",
    experience: "5-10",
    location: "Delhi",
    specialties: ["Electrical Design", "Grid Connection", "Troubleshooting"],
    rating: 4.7,
    total_projects: 58,
    availability: "busy",
    createdAt: "2025-08-20T14:45:22.000+00:00",
  },
  {
    _id: "68fd1ba75eb748f559be5092",
    firstName: "Anjali",
    lastName: "Singh",
    email: "anjali.singh@email.com",
    phone: "+917654321098",
    company: "Renewable Tech",
    serviceType: "solar-design",
    experience: "2-3",
    location: "Pune",
    specialties: ["Solar Design", "Site Survey", "CAD Drafting"],
    rating: 4.6,
    total_projects: 28,
    availability: "available",
    createdAt: "2025-10-10T09:15:33.000+00:00",
  },
  {
    _id: "68fd1ba75eb748f559be5093",
    firstName: "Vikram",
    lastName: "Patel",
    email: "vikram.patel@email.com",
    phone: "+916543210987",
    company: "Green Energy Ltd",
    serviceType: "installation",
    experience: "10+",
    location: "Ahmedabad",
    specialties: ["Installation", "Quality Assurance", "Team Lead"],
    rating: 5.0,
    total_projects: 120,
    availability: "available",
    createdAt: "2025-07-01T11:20:44.000+00:00",
  },
];

const SERVICE_TYPES: Record<string, string> = {
  "solar-design": "Solar Design",
  installation: "Installation",
  "electrical-work": "Electrical Work",
  maintenance: "Maintenance",
  "quality-assurance": "Quality Assurance",
};

const EXPERIENCE_LEVELS: Record<string, string> = {
  "0-2": "0-2 Years",
  "2-3": "2-3 Years",
  "3-5": "3-5 Years",
  "5-10": "5-10 Years",
  "10+": "10+ Years",
};

const getServiceTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    "solar-design": "bg-blue-100 text-blue-700 border-blue-200",
    installation: "bg-green-100 text-green-700 border-green-200",
    "electrical-work": "bg-yellow-100 text-yellow-700 border-yellow-200",
    maintenance: "bg-purple-100 text-purple-700 border-purple-200",
    "quality-assurance": "bg-red-100 text-red-700 border-red-200",
  };
  return colors[type] || "bg-gray-100 text-gray-700 border-gray-200";
};

const getAvailabilityBadge = (availability: string) => {
  const config: Record<string, { color: string; icon: React.ReactNode }> = {
    available: {
      color: "bg-green-100 text-green-700 border-green-200",
      icon: <CheckCircle className="w-3 h-3" />,
    },
    busy: {
      color: "bg-yellow-100 text-yellow-700 border-yellow-200",
      icon: <Clock className="w-3 h-3" />,
    },
    unavailable: {
      color: "bg-red-100 text-red-700 border-red-200",
      icon: <X className="w-3 h-3" />,
    },
  };

  const cfg = config[availability] || config.unavailable;
  return { ...cfg, label: availability.charAt(0).toUpperCase() + availability.slice(1) };
};

const getInitials = (firstName: string, lastName: string): string => {
  return (firstName[0] + lastName[0]).toUpperCase();
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
};

export default function EngineersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null);
  const [selectedServiceType, setSelectedServiceType] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Extract unique values
  const uniqueLocations = Array.from(new Set(sampleEngineers.map(e => e.location))).sort();
  const uniqueServiceTypes = Array.from(new Set(sampleEngineers.map(e => e.serviceType))).sort();
  const uniqueExperience = Array.from(new Set(sampleEngineers.map(e => e.experience))).sort();

  // Filtering logic
  const filteredEngineers = useMemo(() => {
    return sampleEngineers.filter((engineer) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        engineer.firstName.toLowerCase().includes(searchLower) ||
        engineer.lastName.toLowerCase().includes(searchLower) ||
        engineer.email.toLowerCase().includes(searchLower) ||
        engineer.company.toLowerCase().includes(searchLower) ||
        engineer.location.toLowerCase().includes(searchLower) ||
        engineer.specialties.some(s => s.toLowerCase().includes(searchLower));

      const matchesExperience = !selectedExperience || engineer.experience === selectedExperience;
      const matchesServiceType = !selectedServiceType || engineer.serviceType === selectedServiceType;
      const matchesLocation = !selectedLocation || engineer.location === selectedLocation;

      return matchesSearch && matchesExperience && matchesServiceType && matchesLocation;
    });
  }, [searchTerm, selectedExperience, selectedServiceType, selectedLocation]);

  const activeFilters = [selectedExperience, selectedServiceType, selectedLocation].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-down { animation: fadeInDown 0.6s ease-out; }
        .animate-slide-up { animation: slideInUp 0.6s ease-out 0.2s backwards; }
        .engineer-card-hover {
          transition: all 0.3s ease;
        }
        .engineer-card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(76, 175, 184, 0.15);
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-down">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Find Expert Solar Engineers
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with skilled professionals for your solar projects. Browse certified engineers by experience, specialty, and location.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 animate-slide-up">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search by name, company, location, or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-base border-gray-300"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 animate-slide-up">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Experience Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Experience
              </label>
              <select
                value={selectedExperience || ""}
                onChange={(e) => setSelectedExperience(e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAFB8]"
              >
                <option value="">All Experience Levels</option>
                {uniqueExperience.map((exp) => (
                  <option key={exp} value={exp}>
                    {EXPERIENCE_LEVELS[exp]}
                  </option>
                ))}
              </select>
            </div>

            {/* Service Type Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Service Type
              </label>
              <select
                value={selectedServiceType || ""}
                onChange={(e) => setSelectedServiceType(e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAFB8]"
              >
                <option value="">All Services</option>
                {uniqueServiceTypes.map((type) => (
                  <option key={type} value={type}>
                    {SERVICE_TYPES[type]}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location
              </label>
              <select
                value={selectedLocation || ""}
                onChange={(e) => setSelectedLocation(e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAFB8]"
              >
                <option value="">All Locations</option>
                {uniqueLocations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFilters > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600 font-medium">Active filters:</span>
              {selectedExperience && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-blue-100 text-blue-700 border-blue-200">
                  {EXPERIENCE_LEVELS[selectedExperience]}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => setSelectedExperience(null)}
                  />
                </Badge>
              )}
              {selectedServiceType && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-green-100 text-green-700 border-green-200">
                  {SERVICE_TYPES[selectedServiceType]}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => setSelectedServiceType(null)}
                  />
                </Badge>
              )}
              {selectedLocation && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-purple-100 text-purple-700 border-purple-200">
                  {selectedLocation}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => setSelectedLocation(null)}
                  />
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6 animate-slide-up">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredEngineers.length}</span> engineer
            {filteredEngineers.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Engineers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
          {filteredEngineers.length > 0 ? (
            filteredEngineers.map((engineer) => {
              const availability = getAvailabilityBadge(engineer.availability);

              return (
                <Card
                  key={engineer._id}
                  className="engineer-card-hover border border-gray-200 overflow-hidden"
                >
                  {/* Header with gradient */}
                  <div className="h-1 bg-gradient-to-r from-[#4CAFB8] to-[#3d9ba3]"></div>

                  <CardContent className="p-6">
                    {/* Avatar & Name */}
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="h-14 w-14 border-2 border-[#4CAFB8]/20">
                        <AvatarFallback className="bg-gradient-to-br from-[#4CAFB8] to-[#3d9ba3] text-white font-bold">
                          {getInitials(engineer.firstName, engineer.lastName)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {engineer.firstName} {engineer.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{engineer.company}</p>
                      </div>

                      <Badge
                        className={`${availability.color} border flex items-center gap-1 px-2 py-1`}
                      >
                        {availability.icon}
                        <span className="text-xs font-semibold">{availability.label}</span>
                      </Badge>
                    </div>

                    {/* Rating & Projects */}
                    <div className="flex gap-3 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-gray-900">
                          {engineer.rating > 0 ? engineer.rating.toFixed(1) : "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span className="text-sm font-medium">{engineer.total_projects} Projects</span>
                      </div>
                    </div>

                    {/* Service Type Badge */}
                    <div className="mb-4">
                      <Badge className={`${getServiceTypeColor(engineer.serviceType)} border`}>
                        {SERVICE_TYPES[engineer.serviceType]}
                      </Badge>
                    </div>

                    {/* Experience & Location */}
                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-[#4CAFB8]" />
                        <span>{EXPERIENCE_LEVELS[engineer.experience]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#4CAFB8]" />
                        <span>{engineer.location}</span>
                      </div>
                    </div>

                    {/* Specialties */}
                    {engineer.specialties.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-600 mb-2">Specialties</p>
                        <div className="flex flex-wrap gap-1">
                          {engineer.specialties.slice(0, 3).map((specialty, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs bg-gray-50">
                              {specialty}
                            </Badge>
                          ))}
                          {engineer.specialties.length > 3 && (
                            <Badge variant="outline" className="text-xs bg-gray-50">
                              +{engineer.specialties.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Contact Info */}
                    <div className="border-t border-gray-200 pt-4 mb-4 space-y-2 text-sm">
                      <a
                        href={`mailto:${engineer.email}`}
                        className="flex items-center gap-2 text-gray-700 hover:text-[#4CAFB8] transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{engineer.email}</span>
                      </a>
                      <a
                        href={`tel:${engineer.phone}`}
                        className="flex items-center gap-2 text-gray-700 hover:text-[#4CAFB8] transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        <span>{engineer.phone}</span>
                      </a>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Button className="w-full bg-gradient-to-r from-[#4CAFB8] to-[#3d9ba3] hover:from-[#3d9ba3] hover:to-[#2d7a83] text-white flex items-center justify-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Contact
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-[#4CAFB8] text-[#4CAFB8] hover:bg-[#4CAFB8] hover:text-white flex items-center justify-center gap-2"
                      >
                        View Profile
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No engineers found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Load More */}
        {filteredEngineers.length > 0 && (
          <div className="text-center mt-12 animate-slide-up">
            <Button
              variant="outline"
              size="lg"
              className="border-[#4CAFB8] text-[#4CAFB8] hover:bg-[#4CAFB8] hover:text-white"
            >
              Load More Engineers
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}