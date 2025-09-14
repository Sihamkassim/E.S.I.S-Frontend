import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Building2, 
  Calendar, 
  Users, 
  DollarSign,
  ExternalLink,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

const startups = [
  {
    id: 1,
    name: 'TechFlow Solutions',
    tagline: 'Streamlining business operations with AI',
    description: 'We help small businesses automate their workflows using artificial intelligence and machine learning.',
    industry: 'Technology',
    stage: 'Early Stage',
    foundedYear: '2023',
    teamSize: '2-5 people',
    fundingStage: 'Seed',
    fundingAmount: '$500K',
    status: 'approved',
    submittedDate: '2024-01-10',
    website: 'https://techflow.com',
    logo: null,
  },
  {
    id: 2,
    name: 'EcoGreen Innovations',
    tagline: 'Sustainable solutions for a better tomorrow',
    description: 'Developing eco-friendly products and services to reduce environmental impact.',
    industry: 'Sustainability',
    stage: 'MVP',
    foundedYear: '2023',
    teamSize: '1',
    fundingStage: 'Bootstrapped',
    fundingAmount: '$0',
    status: 'pending',
    submittedDate: '2024-01-15',
    website: 'https://ecogreen.com',
    logo: null,
  },
  {
    id: 3,
    name: 'HealthTech Pro',
    tagline: 'Revolutionizing healthcare with technology',
    description: 'Mobile health solutions for remote patient monitoring and telemedicine.',
    industry: 'Healthcare',
    stage: 'Growth Stage',
    foundedYear: '2022',
    teamSize: '6-10 people',
    fundingStage: 'Series A',
    fundingAmount: '$2M',
    status: 'rejected',
    submittedDate: '2023-12-20',
    website: 'https://healthtechpro.com',
    logo: null,
  },
];

export default function MyStartups() {
  const [selectedTab, setSelectedTab] = useState('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'pending':
        return 'Under Review';
      default:
        return status;
    }
  };

  const filteredStartups = selectedTab === 'all' 
    ? startups 
    : startups.filter(startup => startup.status === selectedTab);

  const statusCounts = {
    all: startups.length,
    pending: startups.filter(startup => startup.status === 'pending').length,
    approved: startups.filter(startup => startup.status === 'approved').length,
    rejected: startups.filter(startup => startup.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Startups</h1>
          <p className="text-gray-600">Manage and track your startup submissions</p>
        </div>
        <div className="flex space-x-2">
          <Link to="/dashboard/startups/directory">
            <Button variant="outline">
              Browse Directory
            </Button>
          </Link>
          <Link to="/dashboard/startups/submit">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Submit New Startup
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Startups</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.all}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Under Review</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.rejected}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Startups List */}
      <Card>
        <CardHeader>
          <CardTitle>Startup Submissions</CardTitle>
          <CardDescription>
            View and manage your startup submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({statusCounts.pending})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({statusCounts.approved})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({statusCounts.rejected})</TabsTrigger>
            </TabsList>
            
            <TabsContent value={selectedTab} className="mt-6">
              <div className="space-y-4">
                {filteredStartups.map((startup) => (
                  <div key={startup.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getStatusIcon(startup.status)}
                          <h3 className="text-xl font-semibold text-gray-900">
                            {startup.name}
                          </h3>
                          <Badge className={getStatusColor(startup.status)}>
                            {getStatusText(startup.status)}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{startup.tagline}</p>
                        <p className="text-gray-700 mb-4">{startup.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <Building2 className="h-4 w-4 mr-1" />
                            {startup.industry}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Founded {startup.foundedYear}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {startup.teamSize}
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {startup.fundingStage} • {startup.fundingAmount}
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-500">
                          Submitted: {new Date(startup.submittedDate).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2 ml-6">
                        <Link to={`/dashboard/startups/${startup.id}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </Link>
                        {startup.status === 'pending' && (
                          <Button variant="outline" size="sm" className="w-full">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        )}
                        {startup.website && (
                          <Button variant="outline" size="sm" className="w-full" asChild>
                            <a href={startup.website} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Website
                            </a>
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className="w-full text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredStartups.length === 0 && (
                <div className="text-center py-12">
                  <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No startups found</h3>
                  <p className="text-gray-500 mb-4">
                    {selectedTab === 'all' 
                      ? "You haven't submitted any startups yet."
                      : `You don't have any ${selectedTab} startups.`
                    }
                  </p>
                  <Link to="/dashboard/startups/submit">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Submit Your First Startup
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
