import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Users, 
  DollarSign,
  Calendar,
  Star,
  ExternalLink,
  Heart,
  Share2,
  MessageCircle,
  Mail,
  Linkedin,
  Twitter,
  Instagram
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

export default function StartupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  // Mock startup data - in real app, this would come from API
  const startup = {
    id: 1,
    name: 'TechFlow Solutions',
    tagline: 'Streamlining business operations with AI',
    description: 'We help small businesses automate their workflows using artificial intelligence and machine learning. Our platform reduces manual work by 70% and increases productivity by providing intelligent automation solutions that adapt to your business needs.',
    industry: 'Technology',
    stage: 'Early Stage',
    foundedYear: '2023',
    teamSize: '2-5 people',
    fundingStage: 'Seed',
    fundingAmount: '$500K',
    location: 'San Francisco, CA',
    website: 'https://techflow.com',
    socialMedia: {
      linkedin: 'https://linkedin.com/company/techflow',
      twitter: 'https://twitter.com/techflow',
      instagram: 'https://instagram.com/techflow'
    },
    logo: null,
    founders: [
      { 
        name: 'John Smith', 
        role: 'CEO', 
        email: 'john@techflow.com',
        linkedin: 'https://linkedin.com/in/johnsmith',
        bio: 'Former Google engineer with 10+ years of experience in AI and machine learning.'
      },
      { 
        name: 'Sarah Johnson', 
        role: 'CTO', 
        email: 'sarah@techflow.com',
        linkedin: 'https://linkedin.com/in/sarahjohnson',
        bio: 'PhD in Computer Science from Stanford, specializing in natural language processing.'
      }
    ],
    businessModel: 'SaaS subscription model with tiered pricing based on business size and usage.',
    targetMarket: 'Small to medium businesses (10-500 employees) looking to automate their operations.',
    competitiveAdvantage: 'Our AI adapts to each business\'s unique workflow, providing personalized automation solutions.',
    revenue: '$50K MRR',
    challenges: 'Scaling our AI models to handle diverse business workflows while maintaining accuracy.',
    goals: 'Reach $100K MRR by end of 2024 and expand to 500+ customers.',
    likes: 45,
    views: 234,
    isLiked: false,
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleContact = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/startups/directory')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Directory
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{startup.name}</h1>
          <p className="text-gray-600">{startup.tagline}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleLike}>
            <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current text-red-500' : ''}`} />
            {startup.likes + (isLiked ? 1 : 0)}
          </Button>
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle>About {startup.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{startup.description}</p>
            </CardContent>
          </Card>

          {/* Business Details */}
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Business Model</h4>
                <p className="text-gray-700">{startup.businessModel}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Target Market</h4>
                <p className="text-gray-700">{startup.targetMarket}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Competitive Advantage</h4>
                <p className="text-gray-700">{startup.competitiveAdvantage}</p>
              </div>
            </CardContent>
          </Card>

          {/* Founders */}
          <Card>
            <CardHeader>
              <CardTitle>Founders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {startup.founders.map((founder, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{founder.name}</h4>
                        <p className="text-gray-600 mb-2">{founder.role}</p>
                        <p className="text-gray-700 text-sm">{founder.bio}</p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button variant="outline" size="sm" onClick={() => handleContact(founder.email)}>
                          <Mail className="h-4 w-4 mr-1" />
                          Contact
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a href={founder.linkedin} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Company Info */}
          <Card>
            <CardHeader>
              <CardTitle>Company Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-sm">
                <Building2 className="h-4 w-4 mr-2 text-gray-500" />
                <span>{startup.industry} • {startup.stage}</span>
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                <span>{startup.location}</span>
              </div>
              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 mr-2 text-gray-500" />
                <span>{startup.teamSize}</span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span>Founded {startup.foundedYear}</span>
              </div>
              <div className="flex items-center text-sm">
                <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                <span>{startup.fundingStage} • {startup.fundingAmount}</span>
              </div>
              <div className="flex items-center text-sm">
                <Star className="h-4 w-4 mr-2 text-gray-500" />
                <span>{startup.views} views</span>
              </div>
            </CardContent>
          </Card>

          {/* Contact & Links */}
          <Card>
            <CardHeader>
              <CardTitle>Connect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {startup.website && (
                <Button variant="outline" className="w-full" asChild>
                  <a href={startup.website} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Website
                  </a>
                </Button>
              )}
              {startup.socialMedia.linkedin && (
                <Button variant="outline" className="w-full" asChild>
                  <a href={startup.socialMedia.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </a>
                </Button>
              )}
              {startup.socialMedia.twitter && (
                <Button variant="outline" className="w-full" asChild>
                  <a href={startup.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                  </a>
                </Button>
              )}
              {startup.socialMedia.instagram && (
                <Button variant="outline" className="w-full" asChild>
                  <a href={startup.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                    <Instagram className="h-4 w-4 mr-2" />
                    Instagram
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Current Revenue</h4>
                <p className="text-sm text-gray-600">{startup.revenue}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Current Challenges</h4>
                <p className="text-sm text-gray-600">{startup.challenges}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Short-term Goals</h4>
                <p className="text-sm text-gray-600">{startup.goals}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
