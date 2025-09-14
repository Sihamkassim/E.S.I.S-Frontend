import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Users, 
  DollarSign,
  Video,
  Play
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

const webinars = [
  {
    id: 1,
    title: 'AI in Business: Transforming Industries',
    description: 'Learn how artificial intelligence is revolutionizing business operations across various industries.',
    instructor: 'Dr. Sarah Johnson',
    date: '2024-02-15',
    time: '2:00 PM - 3:30 PM EST',
    duration: '90 minutes',
    price: '$49',
    maxParticipants: 100,
    currentParticipants: 67,
    category: 'Technology',
    level: 'Intermediate',
    status: 'upcoming',
    thumbnail: null,
  },
  {
    id: 2,
    title: 'Startup Funding Strategies',
    description: 'Comprehensive guide to securing funding for your startup from seed to Series A.',
    instructor: 'Mark Thompson',
    date: '2024-02-20',
    time: '1:00 PM - 2:30 PM EST',
    duration: '90 minutes',
    price: '$79',
    maxParticipants: 50,
    currentParticipants: 23,
    category: 'Business',
    level: 'Beginner',
    status: 'upcoming',
    thumbnail: null,
  },
  {
    id: 3,
    title: 'Digital Marketing Masterclass',
    description: 'Advanced digital marketing techniques for growing your online presence.',
    instructor: 'Emily Chen',
    date: '2024-02-10',
    time: '3:00 PM - 4:30 PM EST',
    duration: '90 minutes',
    price: '$39',
    maxParticipants: 200,
    currentParticipants: 156,
    category: 'Marketing',
    level: 'Advanced',
    status: 'upcoming',
    thumbnail: null,
  },
  {
    id: 4,
    title: 'React Development Best Practices',
    description: 'Learn modern React development patterns and best practices from industry experts.',
    instructor: 'Alex Rodriguez',
    date: '2024-01-25',
    time: '2:00 PM - 3:30 PM EST',
    duration: '90 minutes',
    price: '$59',
    maxParticipants: 75,
    currentParticipants: 75,
    category: 'Technology',
    level: 'Intermediate',
    status: 'completed',
    thumbnail: null,
  },
];

export default function WebinarsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredWebinars = webinars.filter(webinar => {
    const matchesSearch = webinar.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         webinar.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || webinar.category.toLowerCase() === filterCategory;
    const matchesLevel = filterLevel === 'all' || webinar.level.toLowerCase() === filterLevel;
    const matchesStatus = filterStatus === 'all' || webinar.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesLevel && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isWebinarFull = (webinar: any) => {
    return webinar.currentParticipants >= webinar.maxParticipants;
  };

  const isWebinarPast = (webinar: any) => {
    return webinar.status === 'completed';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Webinars</h1>
          <p className="text-gray-600">Join live webinars and learn from industry experts</p>
        </div>
        <Link to="/dashboard/webinars/my">
          <Button variant="outline">
            My Webinars
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
                  placeholder="Search webinars..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="design">Design</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWebinars.map((webinar) => (
          <Card key={webinar.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge className={getStatusColor(webinar.status)}>
                  {webinar.status}
                </Badge>
                <Badge className={getLevelColor(webinar.level)}>
                  {webinar.level}
                </Badge>
              </div>
              <CardTitle className="text-lg line-clamp-2">{webinar.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {webinar.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  {webinar.instructor}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(webinar.date).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  {webinar.time} ({webinar.duration})
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  {webinar.currentParticipants}/{webinar.maxParticipants} participants
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 mr-2" />
                  {webinar.price}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                {isWebinarPast(webinar) ? (
                  <Button variant="outline" className="w-full" disabled>
                    <Play className="h-4 w-4 mr-2" />
                    Recording Available
                  </Button>
                ) : isWebinarFull(webinar) ? (
                  <Button variant="outline" className="w-full" disabled>
                    Fully Booked
                  </Button>
                ) : (
                  <Link to={`/dashboard/webinars/apply/${webinar.id}`}>
                    <Button className="w-full">
                      Register Now
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredWebinars.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-500">
              <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No webinars found</h3>
              <p>Try adjusting your search criteria or check back later for new webinars.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
