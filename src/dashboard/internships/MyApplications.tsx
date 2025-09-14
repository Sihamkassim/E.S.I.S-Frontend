import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Eye, 
  Calendar, 
  Building2, 
  Clock, 
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

const applications = [
  {
    id: 1,
    title: 'Software Developer Intern',
    company: 'TechCorp Solutions',
    appliedDate: '2024-01-15',
    status: 'pending',
    location: 'San Francisco, CA',
    type: 'Full-time',
    duration: '3 months',
    salary: '$3,000/month',
  },
  {
    id: 2,
    title: 'Data Science Intern',
    company: 'DataFlow Inc',
    appliedDate: '2024-01-10',
    status: 'under review',
    location: 'Remote',
    type: 'Part-time',
    duration: '6 months',
    salary: '$2,500/month',
  },
  {
    id: 3,
    title: 'UX/UI Design Intern',
    company: 'DesignStudio',
    appliedDate: '2024-01-05',
    status: 'accepted',
    location: 'New York, NY',
    type: 'Full-time',
    duration: '4 months',
    salary: '$2,800/month',
  },
  {
    id: 4,
    title: 'Marketing Intern',
    company: 'GrowthCo',
    appliedDate: '2023-12-20',
    status: 'rejected',
    location: 'Austin, TX',
    type: 'Part-time',
    duration: '3 months',
    salary: '$2,200/month',
  },
];

export default function MyApplications() {
  const [selectedTab, setSelectedTab] = useState('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'under review':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'under review':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Not Selected';
      case 'under review':
        return 'Under Review';
      case 'pending':
        return 'Application Submitted';
      default:
        return status;
    }
  };

  const filteredApplications = selectedTab === 'all' 
    ? applications 
    : applications.filter(app => app.status === selectedTab);

  const statusCounts = {
    all: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    'under review': applications.filter(app => app.status === 'under review').length,
    accepted: applications.filter(app => app.status === 'accepted').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-600">Track the status of your internship applications</p>
        </div>
        <Link to="/dashboard/internships">
          <Button>
            Browse Internships
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.all}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Under Review</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts['under review']}</p>
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
                <p className="text-sm font-medium text-gray-500">Accepted</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.accepted}</p>
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
                <p className="text-sm font-medium text-gray-500">Not Selected</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.rejected}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications List */}
      <Card>
        <CardHeader>
          <CardTitle>Application History</CardTitle>
          <CardDescription>
            View and manage your internship applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({statusCounts.pending})</TabsTrigger>
              <TabsTrigger value="under review">Review ({statusCounts['under review']})</TabsTrigger>
              <TabsTrigger value="accepted">Accepted ({statusCounts.accepted})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({statusCounts.rejected})</TabsTrigger>
            </TabsList>
            
            <TabsContent value={selectedTab} className="mt-6">
              <div className="space-y-4">
                {filteredApplications.map((application) => (
                  <div key={application.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getStatusIcon(application.status)}
                          <h3 className="text-lg font-semibold text-gray-900">
                            {application.title}
                          </h3>
                          <Badge className={getStatusColor(application.status)}>
                            {getStatusText(application.status)}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Building2 className="h-4 w-4 mr-1" />
                          {application.company}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Applied: {new Date(application.appliedDate).toLocaleDateString()}
                          </div>
                          <div>
                            {application.location} • {application.type}
                          </div>
                          <div>
                            {application.duration} • {application.salary}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        {application.status === 'accepted' && (
                          <Button size="sm">
                            Accept Offer
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredApplications.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                  <p className="text-gray-500 mb-4">
                    {selectedTab === 'all' 
                      ? "You haven't applied to any internships yet."
                      : `You don't have any ${selectedTab} applications.`
                    }
                  </p>
                  <Link to="/dashboard/internships">
                    <Button>Browse Internships</Button>
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
