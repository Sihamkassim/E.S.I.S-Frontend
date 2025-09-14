import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  FolderOpen, 
  Calendar, 
  Tag,
  Star,
  Download,
  Share2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

const projects = [
  {
    id: 1,
    title: 'E-commerce Platform',
    description: 'A full-stack e-commerce platform built with React, Node.js, and MongoDB. Features include user authentication, product catalog, shopping cart, and payment integration.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    category: 'Web Development',
    status: 'published',
    submittedDate: '2024-01-15',
    views: 156,
    likes: 23,
    downloads: 8,
    githubUrl: 'https://github.com/user/ecommerce-platform',
    demoUrl: 'https://ecommerce-demo.com',
    thumbnail: null,
  },
  {
    id: 2,
    title: 'AI Chatbot Assistant',
    description: 'An intelligent chatbot built using OpenAI API and React. Provides customer support and can answer questions about products and services.',
    technologies: ['React', 'OpenAI API', 'Python', 'FastAPI'],
    category: 'AI/ML',
    status: 'under review',
    submittedDate: '2024-01-20',
    views: 89,
    likes: 15,
    downloads: 3,
    githubUrl: 'https://github.com/user/ai-chatbot',
    demoUrl: 'https://chatbot-demo.com',
    thumbnail: null,
  },
  {
    id: 3,
    title: 'Mobile Task Manager',
    description: 'A cross-platform mobile app for task management with features like project tracking, team collaboration, and deadline reminders.',
    technologies: ['React Native', 'Firebase', 'Redux'],
    category: 'Mobile Development',
    status: 'draft',
    submittedDate: '2024-01-25',
    views: 0,
    likes: 0,
    downloads: 0,
    githubUrl: null,
    demoUrl: null,
    thumbnail: null,
  },
  {
    id: 4,
    title: 'Data Visualization Dashboard',
    description: 'Interactive dashboard for visualizing business metrics and KPIs with real-time data updates and customizable charts.',
    technologies: ['D3.js', 'React', 'Express', 'PostgreSQL'],
    category: 'Data Visualization',
    status: 'published',
    submittedDate: '2023-12-10',
    views: 234,
    likes: 45,
    downloads: 12,
    githubUrl: 'https://github.com/user/dashboard',
    demoUrl: 'https://dashboard-demo.com',
    thumbnail: null,
  },
];

export default function ProjectsList() {
  const [selectedTab, setSelectedTab] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'under review':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'Published';
      case 'under review':
        return 'Under Review';
      case 'draft':
        return 'Draft';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  const filteredProjects = selectedTab === 'all' 
    ? projects 
    : projects.filter(project => project.status === selectedTab);

  const statusCounts = {
    all: projects.length,
    published: projects.filter(project => project.status === 'published').length,
    'under review': projects.filter(project => project.status === 'under review').length,
    draft: projects.filter(project => project.status === 'draft').length,
    rejected: projects.filter(project => project.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
          <p className="text-gray-600">Manage and showcase your projects</p>
        </div>
        <Link to="/dashboard/projects/submit">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Submit New Project
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FolderOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.all}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Star className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Published</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.published}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Eye className="h-5 w-5 text-yellow-600" />
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
              <div className="p-2 bg-gray-100 rounded-lg">
                <Edit className="h-5 w-5 text-gray-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Drafts</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.draft}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects List */}
      <Card>
        <CardHeader>
          <CardTitle>Project Portfolio</CardTitle>
          <CardDescription>
            View and manage your submitted projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
              <TabsTrigger value="published">Published ({statusCounts.published})</TabsTrigger>
              <TabsTrigger value="under review">Review ({statusCounts['under review']})</TabsTrigger>
              <TabsTrigger value="draft">Drafts ({statusCounts.draft})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({statusCounts.rejected})</TabsTrigger>
            </TabsList>
            
            <TabsContent value={selectedTab} className="mt-6">
              <div className="space-y-6">
                {filteredProjects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {project.title}
                          </h3>
                          <Badge className={getStatusColor(project.status)}>
                            {getStatusText(project.status)}
                          </Badge>
                        </div>
                        <p className="text-gray-700 mb-4">{project.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies.map((tech, index) => (
                            <Badge key={index} variant="secondary">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <Tag className="h-4 w-4 mr-1" />
                            {project.category}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(project.submittedDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {project.views} views
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 mr-1" />
                            {project.likes} likes
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2 ml-6">
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        {project.status === 'draft' && (
                          <Button variant="outline" size="sm" className="w-full">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        )}
                        {project.githubUrl && (
                          <Button variant="outline" size="sm" className="w-full" asChild>
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4 mr-1" />
                              GitHub
                            </a>
                          </Button>
                        )}
                        {project.demoUrl && (
                          <Button variant="outline" size="sm" className="w-full" asChild>
                            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                              <Share2 className="h-4 w-4 mr-1" />
                              Demo
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
              
              {filteredProjects.length === 0 && (
                <div className="text-center py-12">
                  <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                  <p className="text-gray-500 mb-4">
                    {selectedTab === 'all' 
                      ? "You haven't submitted any projects yet."
                      : `You don't have any ${selectedTab} projects.`
                    }
                  </p>
                  <Link to="/dashboard/projects/submit">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Submit Your First Project
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
