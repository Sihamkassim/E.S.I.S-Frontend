import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Video, 
  Calendar, 
  Clock, 
  Users, 
  Play,
  Download,
  Star,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

const webinars = [
  {
    id: 1,
    title: 'AI in Business: Transforming Industries',
    description: 'Learn how artificial intelligence is revolutionizing business operations across various industries.',
    instructor: 'Dr. Sarah Johnson',
    date: '2024-02-15',
    time: '2:00 PM - 3:30 PM EST',
    duration: '90 minutes',
    price: 49,
    category: 'Technology',
    level: 'Intermediate',
    status: 'upcoming',
    registeredDate: '2024-01-10',
    meetingLink: null,
    recordingUrl: null,
    materials: ['Presentation Slides', 'Resource Links', 'Q&A Transcript'],
    rating: null,
    feedback: null,
  },
  {
    id: 2,
    title: 'Startup Funding Strategies',
    description: 'Comprehensive guide to securing funding for your startup from seed to Series A.',
    instructor: 'Mark Thompson',
    date: '2024-02-20',
    time: '1:00 PM - 2:30 PM EST',
    duration: '90 minutes',
    price: 79,
    category: 'Business',
    level: 'Beginner',
    status: 'upcoming',
    registeredDate: '2024-01-15',
    meetingLink: null,
    recordingUrl: null,
    materials: ['Funding Checklist', 'Pitch Deck Template', 'Investor Contacts'],
    rating: null,
    feedback: null,
  },
  {
    id: 3,
    title: 'Digital Marketing Masterclass',
    description: 'Advanced digital marketing techniques for growing your online presence.',
    instructor: 'Emily Chen',
    date: '2024-01-25',
    time: '3:00 PM - 4:30 PM EST',
    duration: '90 minutes',
    price: 39,
    category: 'Marketing',
    level: 'Advanced',
    status: 'completed',
    registeredDate: '2024-01-05',
    meetingLink: null,
    recordingUrl: 'https://webinar-recording.com/digital-marketing',
    materials: ['Marketing Playbook', 'Tool Recommendations', 'Case Studies'],
    rating: 5,
    feedback: 'Excellent webinar! Very informative and practical tips.',
  },
  {
    id: 4,
    title: 'React Development Best Practices',
    description: 'Learn modern React development patterns and best practices from industry experts.',
    instructor: 'Alex Rodriguez',
    date: '2024-01-20',
    time: '2:00 PM - 3:30 PM EST',
    duration: '90 minutes',
    price: 59,
    category: 'Technology',
    level: 'Intermediate',
    status: 'completed',
    registeredDate: '2023-12-15',
    meetingLink: null,
    recordingUrl: 'https://webinar-recording.com/react-best-practices',
    materials: ['Code Examples', 'Best Practices Guide', 'Performance Tips'],
    rating: 4,
    feedback: 'Great content, learned a lot about React optimization.',
  },
  {
    id: 5,
    title: 'Data Science Fundamentals',
    description: 'Introduction to data science concepts and tools for beginners.',
    instructor: 'Dr. Michael Brown',
    date: '2024-01-10',
    time: '10:00 AM - 11:30 AM EST',
    duration: '90 minutes',
    price: 29,
    category: 'Data Science',
    level: 'Beginner',
    status: 'cancelled',
    registeredDate: '2023-12-20',
    meetingLink: null,
    recordingUrl: null,
    materials: [],
    rating: null,
    feedback: null,
  },
];

export default function MyWebinars() {
  const [selectedTab, setSelectedTab] = useState('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'Upcoming';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const filteredWebinars = selectedTab === 'all' 
    ? webinars 
    : webinars.filter(webinar => webinar.status === selectedTab);

  const statusCounts = {
    all: webinars.length,
    upcoming: webinars.filter(webinar => webinar.status === 'upcoming').length,
    completed: webinars.filter(webinar => webinar.status === 'completed').length,
    cancelled: webinars.filter(webinar => webinar.status === 'cancelled').length,
  };

  const totalSpent = webinars.reduce((sum, webinar) => sum + webinar.price, 0);
  const completedCount = webinars.filter(webinar => webinar.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Webinars</h1>
          <p className="text-gray-600">Manage your webinar registrations and access recordings</p>
        </div>
        <Link to="/dashboard/webinars">
          <Button>
            Browse Webinars
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Video className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Webinars</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.all}</p>
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
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Calendar className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.upcoming}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">${totalSpent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Webinars List */}
      <Card>
        <CardHeader>
          <CardTitle>Webinar Registrations</CardTitle>
          <CardDescription>
            View and manage your webinar registrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming ({statusCounts.upcoming})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({statusCounts.completed})</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled ({statusCounts.cancelled})</TabsTrigger>
            </TabsList>
            
            <TabsContent value={selectedTab} className="mt-6">
              <div className="space-y-4">
                {filteredWebinars.map((webinar) => (
                  <div key={webinar.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getStatusIcon(webinar.status)}
                          <h3 className="text-xl font-semibold text-gray-900">
                            {webinar.title}
                          </h3>
                          <Badge className={getStatusColor(webinar.status)}>
                            {getStatusText(webinar.status)}
                          </Badge>
                        </div>
                        <p className="text-gray-700 mb-3">{webinar.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {webinar.instructor}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(webinar.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {webinar.time} ({webinar.duration})
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 mr-1" />
                            ${webinar.price} • {webinar.level}
                          </div>
                        </div>
                        
                        {webinar.rating && (
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm text-gray-600">Your rating:</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < webinar.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {webinar.feedback && (
                          <p className="text-sm text-gray-600 italic">"{webinar.feedback}"</p>
                        )}
                      </div>
                      
                      <div className="flex flex-col space-y-2 ml-6">
                        {webinar.status === 'upcoming' && (
                          <Button className="w-full">
                            <Play className="h-4 w-4 mr-1" />
                            Join Webinar
                          </Button>
                        )}
                        {webinar.status === 'completed' && webinar.recordingUrl && (
                          <Button variant="outline" className="w-full" asChild>
                            <a href={webinar.recordingUrl} target="_blank" rel="noopener noreferrer">
                              <Play className="h-4 w-4 mr-1" />
                              Watch Recording
                            </a>
                          </Button>
                        )}
                        {webinar.materials.length > 0 && (
                          <Button variant="outline" className="w-full">
                            <Download className="h-4 w-4 mr-1" />
                            Download Materials
                          </Button>
                        )}
                        {webinar.status === 'completed' && !webinar.rating && (
                          <Button variant="outline" className="w-full">
                            <Star className="h-4 w-4 mr-1" />
                            Rate & Review
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredWebinars.length === 0 && (
                <div className="text-center py-12">
                  <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No webinars found</h3>
                  <p className="text-gray-500 mb-4">
                    {selectedTab === 'all' 
                      ? "You haven't registered for any webinars yet."
                      : `You don't have any ${selectedTab} webinars.`
                    }
                  </p>
                  <Link to="/dashboard/webinars">
                    <Button>Browse Webinars</Button>
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
