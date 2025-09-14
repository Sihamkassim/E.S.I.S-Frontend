import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Building2, 
  MapPin, 
  Users, 
  DollarSign,
  Calendar,
  Star,
  ExternalLink,
  Heart
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

const startups = [
  {
    id: 1,
    name: 'TechFlow Solutions',
    tagline: 'Streamlining business operations with AI',
    description: 'We help small businesses automate their workflows using artificial intelligence and machine learning. Our platform reduces manual work by 70% and increases productivity.',
    industry: 'Technology',
    stage: 'Early Stage',
    foundedYear: '2023',
    teamSize: '2-5 people',
    fundingStage: 'Seed',
    fundingAmount: '$500K',
    location: 'San Francisco, CA',
    website: 'https://techflow.com',
    linkedin: 'https://linkedin.com/company/techflow',
    logo: null,
    founders: [
      { name: 'John Smith', role: 'CEO', linkedin: 'https://linkedin.com/in/johnsmith' },
      { name: 'Sarah Johnson', role: 'CTO', linkedin: 'https://linkedin.com/in/sarahjohnson' }
    ],
    likes: 45,
    views: 234,
    isLiked: false,
  },
  {
    id: 2,
    name: 'EcoGreen Innovations',
    tagline: 'Sustainable solutions for a better tomorrow',
    description: 'Developing eco-friendly products and services to reduce environmental impact. Our biodegradable packaging solutions are used by 50+ companies worldwide.',
    industry: 'Sustainability',
    stage: 'MVP',
    foundedYear: '2023',
    teamSize: '1',
    fundingStage: 'Bootstrapped',
    fundingAmount: '$0',
    location: 'Austin, TX',
    website: 'https://ecogreen.com',
    linkedin: 'https://linkedin.com/company/ecogreen',
    logo: null,
    founders: [
      { name: 'Mike Chen', role: 'Founder & CEO', linkedin: 'https://linkedin.com/in/mikechen' }
    ],
    likes: 32,
    views: 189,
    isLiked: true,
  },
  {
    id: 3,
    name: 'HealthTech Pro',
    tagline: 'Revolutionizing healthcare with technology',
    description: 'Mobile health solutions for remote patient monitoring and telemedicine. Our platform connects patients with healthcare providers seamlessly.',
    industry: 'Healthcare',
    stage: 'Growth Stage',
    foundedYear: '2022',
    teamSize: '6-10 people',
    fundingStage: 'Series A',
    fundingAmount: '$2M',
    location: 'Boston, MA',
    website: 'https://healthtechpro.com',
    linkedin: 'https://linkedin.com/company/healthtechpro',
    logo: null,
    founders: [
      { name: 'Dr. Emily Rodriguez', role: 'CEO', linkedin: 'https://linkedin.com/in/emilyrodriguez' },
      { name: 'David Kim', role: 'CTO', linkedin: 'https://linkedin.com/in/davidkim' }
    ],
    likes: 67,
    views: 456,
    isLiked: false,
  },
  {
    id: 4,
    name: 'EduTech Solutions',
    tagline: 'Making education accessible to everyone',
    description: 'Online learning platform that provides affordable education to students in developing countries. Over 10,000 students have benefited from our courses.',
    industry: 'Education',
    stage: 'Early Stage',
    foundedYear: '2023',
    teamSize: '2-5 people',
    fundingStage: 'Pre-seed',
    fundingAmount: '$100K',
    location: 'Remote',
    website: 'https://edutechsolutions.com',
    linkedin: 'https://linkedin.com/company/edutechsolutions',
    logo: null,
    founders: [
      { name: 'Lisa Wang', role: 'Founder', linkedin: 'https://linkedin.com/in/lisawang' }
    ],
    likes: 28,
    views: 167,
    isLiked: false,
  },
];

export default function StartupDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('all');
  const [filterStage, setFilterStage] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [likedStartups, setLikedStartups] = useState<number[]>([2]);

  const filteredStartups = startups.filter(startup => {
    const matchesSearch = startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         startup.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         startup.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = filterIndustry === 'all' || startup.industry.toLowerCase() === filterIndustry;
    const matchesStage = filterStage === 'all' || startup.stage.toLowerCase().replace(' ', '-') === filterStage;
    const matchesLocation = filterLocation === 'all' || 
                           startup.location.toLowerCase().includes(filterLocation.toLowerCase());
    
    return matchesSearch && matchesIndustry && matchesStage && matchesLocation;
  });

  const handleLike = (startupId: number) => {
    setLikedStartups(prev => 
      prev.includes(startupId) 
        ? prev.filter(id => id !== startupId)
        : [...prev, startupId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Startup Directory</h1>
          <p className="text-gray-600">Discover innovative startups and connect with founders</p>
        </div>
        <Link to="/dashboard/startups/submit">
          <Button>
            Submit Your Startup
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search startups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterIndustry} onValueChange={setFilterIndustry}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="sustainability">Sustainability</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStage} onValueChange={setFilterStage}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="mvp">MVP</SelectItem>
                <SelectItem value="early-stage">Early Stage</SelectItem>
                <SelectItem value="growth-stage">Growth Stage</SelectItem>
                <SelectItem value="scale-stage">Scale Stage</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterLocation} onValueChange={setFilterLocation}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="san francisco">San Francisco</SelectItem>
                <SelectItem value="austin">Austin</SelectItem>
                <SelectItem value="boston">Boston</SelectItem>
                <SelectItem value="new york">New York</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStartups.map((startup) => (
          <Card key={startup.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-1">{startup.name}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-1">
                    {startup.tagline}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(startup.id)}
                  className={`p-1 ${likedStartups.includes(startup.id) ? 'text-red-500' : 'text-gray-400'}`}
                >
                  <Heart className={`h-4 w-4 ${likedStartups.includes(startup.id) ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                {startup.description}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Building2 className="h-4 w-4 mr-2" />
                  {startup.industry} • {startup.stage}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {startup.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  {startup.teamSize} • Founded {startup.foundedYear}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 mr-2" />
                  {startup.fundingStage} • {startup.fundingAmount}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-1" />
                  {startup.likes + (likedStartups.includes(startup.id) ? 1 : 0)}
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1" />
                  {startup.views} views
                </div>
              </div>
              
              <div className="space-y-2">
                <Link to={`/dashboard/startups/${startup.id}`}>
                  <Button className="w-full">
                    View Details
                  </Button>
                </Link>
                {startup.website && (
                  <Button variant="outline" className="w-full" asChild>
                    <a href={startup.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Website
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStartups.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-500">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No startups found</h3>
              <p>Try adjusting your search criteria or check back later for new startups.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
