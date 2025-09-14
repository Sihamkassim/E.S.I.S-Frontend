import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Building2, 
  Users,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

// Mock data for frontend development
const mockInternships = [
  {
    id: 1,
    title: 'Software Developer Intern',
    description: 'Join our development team and work on cutting-edge web applications using React and Node.js.',
    department: 'TechCorp Solutions',
    location: 'San Francisco, CA',
    isRemote: false,
    isPaid: true,
    stipendAmount: 3000,
    maxApplicants: 5,
    requirements: 'React, JavaScript, Node.js, Git',
    status: 'PUBLISHED',
    createdAt: '2024-01-15T10:00:00Z',
    startDate: '2024-06-01',
    endDate: '2024-08-31'
  },
  {
    id: 2,
    title: 'Marketing Intern',
    description: 'Help us create engaging marketing campaigns and analyze social media performance.',
    department: 'Digital Marketing Co',
    location: 'Remote',
    isRemote: true,
    isPaid: true,
    stipendAmount: 2500,
    maxApplicants: 3,
    requirements: 'Social Media, Analytics, Content Creation',
    status: 'PUBLISHED',
    createdAt: '2024-01-10T14:30:00Z',
    startDate: '2024-05-15',
    endDate: '2024-08-15'
  },
  {
    id: 3,
    title: 'Data Science Intern',
    description: 'Work with our data team to analyze large datasets and build predictive models.',
    department: 'Data Insights Inc',
    location: 'New York, NY',
    isRemote: false,
    isPaid: true,
    stipendAmount: 3500,
    maxApplicants: 4,
    requirements: 'Python, Machine Learning, SQL, Statistics',
    status: 'PUBLISHED',
    createdAt: '2024-01-08T09:15:00Z',
    startDate: '2024-06-15',
    endDate: '2024-09-15'
  }
];

export default function InternshipsList() {
  const [internships] = useState(mockInternships);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');

  const filteredInternships = internships.filter(internship => {
    const matchesSearch = internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' ||
                       (filterType === 'full-time' && !internship.isRemote) ||
                       (filterType === 'part-time' && internship.isRemote);
    const matchesLocation = filterLocation === 'all' ||
                           internship.location.toLowerCase().includes(filterLocation.toLowerCase());
    return matchesSearch && matchesType && matchesLocation;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-100 text-green-800';
      case 'DRAFT': return 'bg-yellow-100 text-yellow-800';
      case 'CLOSED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Internships</h1>
          <p className="text-gray-600">Find and apply for internship opportunities</p>
        </div>
        <Link to="/dashboard/internships/my">
          <Button variant="outline">
            My Applications
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
                  placeholder="Search internships..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
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
                <SelectItem value="new york">New York</SelectItem>
                <SelectItem value="austin">Austin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        {filteredInternships.map((internship) => (
          <Card key={internship.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{internship.title}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Building2 className="h-4 w-4 mr-1" />
                    {internship.department}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(internship.status)}>
                  {internship.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {internship.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  {internship.isRemote ? 'Remote' : 'On-site'} • {internship.isPaid ? `$${internship.stipendAmount}/month` : 'Unpaid'}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  Max {internship.maxApplicants} applicants
                </div>
              </div>

              <p className="text-gray-700 mb-4">{internship.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {internship.requirements.split(',').map((req, index) => (
                  <Badge key={index} variant="secondary">
                    {req.trim()}
                  </Badge>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Posted {formatDate(internship.createdAt)} • {new Date(internship.startDate).toLocaleDateString()} - {new Date(internship.endDate).toLocaleDateString()}
                </div>
                <Link to={`/dashboard/internships/apply/${internship.id}`}>
                  <Button>
                    Apply Now
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredInternships.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No internships found</h3>
              <p>Try adjusting your search criteria or check back later for new opportunities.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}