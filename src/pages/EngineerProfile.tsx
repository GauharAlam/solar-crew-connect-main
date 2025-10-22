// src/pages/EngineerProfile.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Award, Briefcase, Mail, MapPin, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "react-day-picker";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
// ... other imports ...
// Removed: import { supabase } from "@/integrations/supabase/client";

// Define your backend API URL
const API_URL = 'https://solar-crew-connect-main.onrender.com/api';

interface EngineerProfile { // Keep or adjust this interface based on your Mongoose model
  _id: string; // MongoDB uses _id
  // ... other fields from your Mongoose model
  full_name?: string; // Add if you populate from User model
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  years_experience?: number; // Adjust types based on model
  specialties?: string[];
  certifications?: string[];
  hourly_rate?: number;
  rating?: number;
  total_projects?: number;
  availability?: 'available' | 'busy' | 'unavailable';
}


export default function EngineerProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState<EngineerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Add error state

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) {
         setError("No profile ID provided.");
         setLoading(false);
         return;
      };
      setLoading(true);
      setError(null); // Reset error before fetching

      try {
        const response = await fetch(`${API_URL}/engineers/profile/${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        const data: EngineerProfile = await response.json();
         // Map _id to id if your component expects 'id'
         // data.id = data._id;
        setProfile(data);
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        setError(error.message || "Failed to load profile.");
        setProfile(null); // Clear profile on error
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]); // Dependency array includes id

  if (loading) {
    // ... loading spinner ...
  }

  // Display error message
  if (error) {
      return (
      <div className="min-h-screen bg-background pt-16 flex items-center justify-center">
          <div className="text-center text-red-600">
          <h1 className="text-2xl font-bold mb-2">Error Loading Profile</h1>
          <p>{error}</p>
          </div>
      </div>
      );
  }


  if (!profile) {
     // Keep the original 'Profile Not Found' message or adjust if needed
     // This state might be reached if fetchProfile completes without error but returns null/undefined data
    return (
      <div className="min-h-screen bg-background pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Profile Not Found</h1>
          <p className="text-muted-foreground">The engineer profile you're looking for doesn't exist or couldn't be loaded.</p>
        </div>
      </div>
    );
  }

  // --- IMPORTANT: Update rendering logic below ---
  // Make sure the fields you access (e.g., profile.full_name, profile.years_experience)
  // match the fields defined in your Mongoose EngineerProfileSchema and fetched from the backend.
  // You might need to combine firstName and lastName if your model stores them separately.
  const displayName = profile.full_name || `${profile.firstName || ''} ${profile.lastName || ''}`.trim();


  // ... rest of the component rendering using 'profile' data ...
  // Remember to use profile._id if accessing MongoDB's default ID
    const getAvailabilityColor = (availability?: string) => { // Make availability optional
        switch (availability) {
        case 'available': return 'bg-green-500';
        case 'busy': return 'bg-yellow-500';
        case 'unavailable': return 'bg-red-500';
        default: return 'bg-gray-500';
        }
    };

    return (
        <div className="min-h-screen bg-background pt-16">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header Section */}
                <Card className="mb-8">
                <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                        <Avatar className="w-32 h-32">
                        <AvatarImage src={profile.avatar_url} alt={displayName} />
                        <AvatarFallback className="text-2xl">
                            {/* Generate fallback from displayName */}
                            {displayName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                        </Avatar>
                    </div>

                    <div className="flex-grow">
                        <div className="flex items-start justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">{displayName}</h1>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-muted-foreground mb-3">
                                {profile.location && (
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        <span>{profile.location}</span>
                                    </div>
                                )}
                                {profile.years_experience !== undefined && profile.years_experience !== null && (
                                    <div className="flex items-center gap-1">
                                        <Briefcase className="w-4 h-4" />
                                        <span>{profile.years_experience} years experience</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                            <div className="flex items-center gap-1 mb-2 justify-end">
                            {profile.rating !== undefined && (
                                <>
                                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    <span className="font-semibold">{profile.rating.toFixed(1)}</span>
                                    <span className="text-muted-foreground">({profile.total_projects || 0} projects)</span>
                                </>
                             )}
                            </div>
                            <div className="flex items-center gap-2 justify-end">
                              <div className={`w-3 h-3 rounded-full ${getAvailabilityColor(profile.availability)}`}></div>
                              <span className="text-sm capitalize">{profile.availability || 'Unknown'}</span>
                            </div>
                        </div>
                        </div>

                        {profile.bio && (
                        <p className="text-muted-foreground mb-4">{profile.bio}</p>
                        )}

                        <div className="flex flex-wrap gap-3">
                        <Button className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            Contact Engineer
                        </Button>
                        {/* Conditionally render View Portfolio if relevant data exists */}
                        {/* <Button variant="outline" className="flex items-center gap-2">
                            <ExternalLink className="w-4 h-4" />
                            View Portfolio
                        </Button> */}
                        </div>
                    </div>
                    </div>
                </CardContent>
                </Card>

                {/* ... Rest of the card sections (Services, Contact, Reviews) - Adapt fields as needed ... */}
                {/* Example adaptation for Specialties */}
                <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Award className="w-5 h-5" />
                            Services & Specialties
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {profile.specialties && profile.specialties.length > 0 && (
                            <div>
                                <h4 className="font-semibold mb-2">Specialties</h4>
                                <div className="flex flex-wrap gap-2">
                                {/* Adjust based on whether specialties is string or array */}
                                {Array.isArray(profile.specialties) ? (
                                    profile.specialties.map((specialty, index) => (
                                    <Badge key={index} variant="secondary">{specialty}</Badge>
                                    ))
                                ) : (
                                    <Badge variant="secondary">{profile.specialties}</Badge> // If it's a single string
                                )}
                                </div>
                            </div>
                        )}
                        {/* ... Certifications, Hourly Rate ... */}
                    </CardContent>
                 </Card>
                 {/* ... Other Cards ... */}
            </div>
        </div>
    );
}