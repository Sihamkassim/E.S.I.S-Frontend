import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  User,
  Tag
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

const tickets = [
  {
    id: 'TKT-001',
    title: 'Unable to submit internship application',
    description: 'I\'m getting an error when trying to submit my application for the Software Developer position.',
    category: 'Technical Issue',
    priority: 'High',
    status: 'open',
    createdDate: '2024-01-20',
    lastUpdated: '2024-01-20',
    assignedTo: 'Support Team',
    messages: 3,
  },
  {
    id: 'TKT-002',
    title: 'Webinar recording not available',
    description: 'I attended the AI webinar last week but can\'t find the recording in my account.',
    category: 'Webinar',
    priority: 'Medium',
    status: 'in progress',
    createdDate: '2024-01-18',
    lastUpdated: '2024-01-19',
    assignedTo: 'Sarah Johnson',
    messages: 5,
  },
  {
    id: 'TKT-003',
    title: 'Membership billing question',
    description: 'I was charged twice for my premium membership this month. Can you help resolve this?',
    category: 'Billing',
    priority: 'High',
    status: 'resolved',
    createdDate: '2024-01-15',
    lastUpdated: '2024-01-17',
    assignedTo: 'Billing Team',
    messages: 4,
  },
  {
    id: 'TKT-004',
    title: 'Feature request: Project collaboration',
    description: 'It would be great to have real-time collaboration features for project submissions.',
    category: 'Feature Request',
    priority: 'Low',
    status: 'closed',
    createdDate: '2024-01-10',
    lastUpdated: '2024-01-12',
    assignedTo: 'Product Team',
    messages: 2,
  },
];

export default function SupportTickets() {
  const [selectedTab, setSelectedTab] = useState('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'in progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'closed':
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTickets = selectedTab === 'all' 
    ? tickets 
    : tickets.filter(ticket => ticket.status === selectedTab);

  const statusCounts = {
    all: tickets.length,
    open: tickets.filter(ticket => ticket.status === 'open').length,
    'in progress': tickets.filter(ticket => ticket.status === 'in progress').length,
    resolved: tickets.filter(ticket => ticket.status === 'resolved').length,
    closed: tickets.filter(ticket => ticket.status === 'closed').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-gray-600">Get help with your account and platform issues</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Ticket
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Tickets</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.all}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Open</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.open}</p>
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
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts['in progress']}</p>
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
                <p className="text-sm font-medium text-gray-500">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.resolved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tickets List */}
      <Card>
        <CardHeader>
          <CardTitle>Support Requests</CardTitle>
          <CardDescription>
            Track the status of your support tickets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
              <TabsTrigger value="open">Open ({statusCounts.open})</TabsTrigger>
              <TabsTrigger value="in progress">Progress ({statusCounts['in progress']})</TabsTrigger>
              <TabsTrigger value="resolved">Resolved ({statusCounts.resolved})</TabsTrigger>
              <TabsTrigger value="closed">Closed ({statusCounts.closed})</TabsTrigger>
            </TabsList>
            
            <TabsContent value={selectedTab} className="mt-6">
              <div className="space-y-4">
                {filteredTickets.map((ticket) => (
                  <div key={ticket.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getStatusIcon(ticket.status)}
                          <h3 className="text-lg font-semibold text-gray-900">
                            {ticket.title}
                          </h3>
                          <Badge className={getStatusColor(ticket.status)}>
                            {ticket.status}
                          </Badge>
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {ticket.priority}
                          </Badge>
                        </div>
                        <p className="text-gray-700 mb-3">{ticket.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Tag className="h-4 w-4 mr-1" />
                            {ticket.category}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Created: {new Date(ticket.createdDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            Assigned to: {ticket.assignedTo}
                          </div>
                          <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {ticket.messages} messages
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <Link to={`/dashboard/support/${ticket.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                        {ticket.status === 'resolved' && (
                          <Button variant="outline" size="sm">
                            Reopen
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredTickets.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
                  <p className="text-gray-500 mb-4">
                    {selectedTab === 'all' 
                      ? "You haven't created any support tickets yet."
                      : `You don't have any ${selectedTab} tickets.`
                    }
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Ticket
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
