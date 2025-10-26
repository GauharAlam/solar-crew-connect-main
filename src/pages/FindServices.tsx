import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Search, 
  MapPin, 
  Star, 
  Users, 
  Wrench, 
  PenTool,
  Filter,
  ArrowRight,
  X,
  ChevronDown
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { EngineerCard } from "@/components/EngineerCard";

const services = [
  {
    id: 1,
    name: "Arizona Solar Services",
    type: "I&C Team",
    location: "Phoenix, AZ",
    rating: 4.8,
    reviews: 127,
    price: "$450/day",
    description: "Specialized in utility-scale solar I&C with 10+ years experience",
    specialties: ["Utility Scale", "Commercial", "SCADA Systems"],
    availability: "Available Now",
    image: "/api/placeholder/80/80"
  },
  {
    id: 2,
    name: "SunTech Designs",
    type: "Solar Design",
    location: "Los Angeles, CA", 
    rating: 4.9,
    reviews: 89,
    price: "$2,500/project",
    description: "Expert solar system design and engineering services",
    specialties: ["AutoCAD", "PVsyst", "Permit Drawings"],
    availability: "2-3 weeks",
    image: "/api/placeholder/80/80"
  },
  {
    id: 3,
    name: "PowerTest Solutions",
    type: "Tools",
    location: "San Diego, CA",
    rating: 4.7,
    reviews: 203,
    price: "$200/day",
    description: "Professional testing equipment rental and services",
    specialties: ["IV Curve Tracers", "Thermal Cameras", "Multimeters"],
    availability: "Available Now",
    image: "/api/placeholder/80/80"
  },
  {
    id: 4,
    name: "California Solar Pro",
    type: "I&C Team",
    location: "San Francisco, CA",
    rating: 4.6,
    reviews: 95,
    price: "$500/day",
    description: "Expert in residential and commercial installations",
    specialties: ["Residential", "Commercial", "Battery Systems"],
    availability: "Available Now",
    image: "/api/placeholder/80/80"
  },
  {
    id: 5,
    name: "Desert Energy Design",
    type: "Solar Design",
    location: "Phoenix, AZ",
    rating: 4.8,
    reviews: 112,
    price: "$3,000/project",
    description: "Specializing in desert climate solar optimization",
    specialties: ["PVsyst", "Thermal Analysis", "Permit Drawings"],
    availability: "1-2 weeks",
    image: "/api/placeholder/80/80"
  }
];

const engineers = [
  {
    id: "eng-1",
    name: "Ava Thompson",
    location: "Austin, TX",
    specialties: ["Utility-Scale I&C", "SCADA", "Commissioning"],
    rating: 4.9,
    totalProjects: 120,
    hourlyRate: 85,
    availability: "available" as const,
    avatarUrl: "/api/placeholder/64/64",
  },
  {
    id: "eng-2",
    name: "Miguel Santos",
    location: "San Diego, CA",
    specialties: ["Inverter Start-up", "Thermal Imaging", "Medium Voltage"],
    rating: 4.8,
    totalProjects: 98,
    hourlyRate: 92,
    availability: "busy" as const,
    avatarUrl: "/api/placeholder/64/64",
  },
  {
    id: "eng-3",
    name: "Priya Sharma",
    location: "Phoenix, AZ",
    specialties: ["PV Design", "PVsyst", "Permit Drawings", "As-Builts"],
    rating: 5.0,
    totalProjects: 150,
    hourlyRate: 100,
    availability: "available" as const,
    avatarUrl: "/api/placeholder/64/64",
  },
  {
    id: "eng-4",
    name: "Liam O'Connor",
    location: "Denver, CO",
    specialties: ["QA/QC", "IV Curve Tracing", "String Commissioning"],
    rating: 4.7,
    totalProjects: 76,
    hourlyRate: 80,
    availability: "unavailable" as const,
    avatarUrl: "/api/placeholder/64/64",
  },
  {
    id: "eng-5",
    name: "Sara Kim",
    location: "Los Angeles, CA",
    specialties: ["Protection Testing", "Relay Settings", "MV Switchgear"],
    rating: 4.85,
    totalProjects: 110,
    hourlyRate: 120,
    availability: "busy" as const,
    avatarUrl: "/api/placeholder/64/64",
  },
  {
    id: "eng-6",
    name: "Raj Patel",
    location: "San Francisco, CA",
    specialties: ["Residential Design", "Commercial Setup", "Battery Systems"],
    rating: 4.75,
    totalProjects: 85,
    hourlyRate: 95,
    availability: "available" as const,
    avatarUrl: "/api/placeholder/64/64",
  },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case "I&C Team": return <Users className="w-4 h-4" />;
    case "Solar Design": return <PenTool className="w-4 h-4" />;
    case "Tools": return <Wrench className="w-4 h-4" />;
    default: return null;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "I&C Team": return "bg-blue-100 text-blue-700 border-blue-200";
    case "Solar Design": return "bg-purple-100 text-purple-700 border-purple-200";
    case "Tools": return "bg-orange-100 text-orange-700 border-orange-200";
    default: return "bg-gray-100 text-gray-700";
  }
};

const extractUnique = (items: any[], key: string) => {
  return Array.from(new Set(items.flatMap(item => item[key]))).sort();
};

const extractCities = (items: any[]) => {
  return Array.from(new Set(items.map(item => item.location))).sort();
};

export default function FindServices() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    serviceType: [] as string[],
    locations: [] as string[],
    specialties: [] as string[],
    showServices: true,
    showEngineers: true,
  });

  useEffect(() => {
    document.title = "Find Solar Services & Engineers | SolarConnect";
    const desc = "Find solar services and top solar engineers near you for design, I&C, testing, and more.";
    let tag = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("name", "description");
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", desc);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", window.location.href);
  }, []);

  const serviceTypes = ["I&C Team", "Solar Design", "Tools"];
  const allLocations = extractCities([...services, ...engineers]);
  const allSpecialties = extractUnique([...services, ...engineers], "specialties");

  // Filtering logic
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch = 
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
        service.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filters.serviceType.length === 0 || filters.serviceType.includes(service.type);
      const matchesLocation = filters.locations.length === 0 || filters.locations.includes(service.location);
      const matchesSpecialty = filters.specialties.length === 0 || 
        service.specialties.some(s => filters.specialties.includes(s));

      return matchesSearch && matchesType && matchesLocation && matchesSpecialty;
    });
  }, [searchTerm, filters]);

  const filteredEngineers = useMemo(() => {
    return engineers.filter((engineer) => {
      const matchesSearch = 
        engineer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        engineer.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
        engineer.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLocation = filters.locations.length === 0 || filters.locations.includes(engineer.location);
      const matchesSpecialty = filters.specialties.length === 0 || 
        engineer.specialties.some(s => filters.specialties.includes(s));

      return matchesSearch && matchesLocation && matchesSpecialty;
    });
  }, [searchTerm, filters]);

  const handleServiceTypeToggle = (type: string) => {
    setFilters(prev => ({
      ...prev,
      serviceType: prev.serviceType.includes(type)
        ? prev.serviceType.filter(t => t !== type)
        : [...prev.serviceType, type]
    }));
  };

  const handleLocationToggle = (location: string) => {
    setFilters(prev => ({
      ...prev,
      locations: prev.locations.includes(location)
        ? prev.locations.filter(l => l !== location)
        : [...prev.locations, location]
    }));
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setFilters(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const handleContentTypeToggle = (type: "services" | "engineers") => {
    setFilters(prev => ({
      ...prev,
      [type === "services" ? "showServices" : "showEngineers"]: !prev[type === "services" ? "showServices" : "showEngineers"]
    }));
  };

  const clearFilters = () => {
    setFilters({
      serviceType: [],
      locations: [],
      specialties: [],
      showServices: true,
      showEngineers: true,
    });
    setSearchTerm("");
  };

  const activeFilterCount = filters.serviceType.length + filters.locations.length + filters.specialties.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50 pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Solar Services & Engineers</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with verified I&C teams, design experts, and equipment providers for your solar projects
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search services, locations, engineers, or specialties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors relative"
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#4CAFB8] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Filter Panel */}
          {isFilterOpen && (
            <Card className="p-6 mb-6 border border-gray-200 shadow-lg">
              <div className="space-y-6">
                {/* Content Type Filter */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span>Show Results</span>
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="show-services"
                        checked={filters.showServices}
                        onCheckedChange={() => handleContentTypeToggle("services")}
                      />
                      <label htmlFor="show-services" className="text-sm cursor-pointer text-gray-700">
                        Services
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="show-engineers"
                        checked={filters.showEngineers}
                        onCheckedChange={() => handleContentTypeToggle("engineers")}
                      />
                      <label htmlFor="show-engineers" className="text-sm cursor-pointer text-gray-700">
                        Engineers
                      </label>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200"></div>

                {/* Service Type Filter */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Service Type</h3>
                  <div className="space-y-2">
                    {serviceTypes.map((type) => (
                      <div key={type} className="flex items-center gap-2">
                        <Checkbox
                          id={`type-${type}`}
                          checked={filters.serviceType.includes(type)}
                          onCheckedChange={() => handleServiceTypeToggle(type)}
                        />
                        <label htmlFor={`type-${type}`} className="text-sm cursor-pointer text-gray-700 flex items-center gap-2">
                          {getTypeIcon(type)}
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200"></div>

                {/* Locations Filter */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Locations</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {allLocations.map((location) => (
                      <div key={location} className="flex items-center gap-2">
                        <Checkbox
                          id={`location-${location}`}
                          checked={filters.locations.includes(location)}
                          onCheckedChange={() => handleLocationToggle(location)}
                        />
                        <label htmlFor={`location-${location}`} className="text-sm cursor-pointer text-gray-700 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {location}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200"></div>

                {/* Specialties Filter */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Specialties</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {allSpecialties.map((specialty) => (
                      <div key={specialty} className="flex items-center gap-2">
                        <Checkbox
                          id={`specialty-${specialty}`}
                          checked={filters.specialties.includes(specialty)}
                          onCheckedChange={() => handleSpecialtyToggle(specialty)}
                        />
                        <label htmlFor={`specialty-${specialty}`} className="text-sm cursor-pointer text-gray-700">
                          {specialty}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    className="w-full"
                  >
                    Clear All Filters
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Active Filters Display */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {filters.serviceType.map(type => (
                <Badge key={type} variant="secondary" className="flex items-center gap-1">
                  {type}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => handleServiceTypeToggle(type)} />
                </Badge>
              ))}
              {filters.locations.map(location => (
                <Badge key={location} variant="secondary" className="flex items-center gap-1">
                  {location}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => handleLocationToggle(location)} />
                </Badge>
              ))}
              {filters.specialties.map(specialty => (
                <Badge key={specialty} variant="secondary" className="flex items-center gap-1">
                  {specialty}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => handleSpecialtyToggle(specialty)} />
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Services Section */}
        {filters.showServices && (
          <div className="space-y-6 mb-16">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredServices.length} {filteredServices.length === 1 ? "Service" : "Services"} Found
              </h2>
            </div>

            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <Card key={service.id} className="p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-200">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Service Info */}
                    <div className="lg:col-span-8">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#4CAFB8] to-[#3d9ba3] rounded-lg flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                          {service.name.charAt(0)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{service.name}</h3>
                            <Badge className={`flex items-center gap-1 ${getTypeColor(service.type)}`}>
                              {getTypeIcon(service.type)}
                              {service.type}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3 flex-wrap">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium text-gray-900">{service.rating}</span>
                              <span className="text-gray-600 text-sm">({service.reviews} reviews)</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span className="text-sm">{service.location}</span>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 mb-4 text-sm">{service.description}</p>
                          
                          <div className="flex flex-wrap gap-2">
                            {service.specialties.map((specialty, index) => (
                              <Badge 
                                key={index} 
                                variant="secondary" 
                                className="text-xs cursor-pointer hover:bg-[#4CAFB8] hover:text-white transition-colors"
                                onClick={() => {
                                  if (!filters.specialties.includes(specialty)) {
                                    handleSpecialtyToggle(specialty);
                                  }
                                }}
                              >
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="lg:col-span-4 flex flex-col justify-between">
                      <div className="mb-4">
                        <div className="text-2xl font-bold text-gray-900">{service.price}</div>
                        <div className="text-sm text-gray-600">Starting price</div>
                        <div className="text-sm text-[#4CAFB8] font-medium mt-2">{service.availability}</div>
                      </div>
                      
                      <div className="space-y-2">
                        <Button className="w-full flex items-center justify-center gap-2 bg-[#4CAFB8] hover:bg-[#3d9ba3]">
                          Contact Service
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" className="w-full">
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-12 text-center border border-gray-200">
                <p className="text-gray-500 text-lg">No services found matching your criteria</p>
              </Card>
            )}
          </div>
        )}

        {/* Engineers Section */}
        {filters.showEngineers && (
          <div className="mt-16">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredEngineers.length} {filteredEngineers.length === 1 ? "Engineer" : "Engineers"} Available
              </h2>
            </div>
            {filteredEngineers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEngineers.map((eng) => (
                  <EngineerCard key={eng.id} {...eng} />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center border border-gray-200">
                <p className="text-gray-500 text-lg">No engineers found matching your criteria</p>
              </Card>
            )}
          </div>
        )}

        {/* No Results */}
        {!filters.showServices && !filters.showEngineers && (
          <Card className="p-12 text-center border border-gray-200">
            <p className="text-gray-500 text-lg">Please select at least one result type to display</p>
          </Card>
        )}

        {/* Load More */}
        {(filteredServices.length > 0 || filteredEngineers.length > 0) && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="border-[#4CAFB8] text-[#4CAFB8] hover:bg-[#4CAFB8] hover:text-white">
              Load More Results
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}