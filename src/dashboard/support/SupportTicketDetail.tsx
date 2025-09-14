import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  User,
  Tag,
  Send,
  Paperclip,
  MoreVertical
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';

export default function SupportTicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock ticket data - in real app, this would come from API
  const ticket = {
    id: 'TKT-001',
    title: 'Unable to submit internship application',
    description: 'I\'m getting an error when trying to submit my application for the Software Developer position. The form keeps showing "Please fill in all required fields" even though I\'ve filled everything out.',
    category: 'Technical Issue',
    priority: 'High',
    status: 'in progress',
    createdDate: '2024-01-20T10:30:00Z',
    lastUpdated: '2024-01-20T14:45:00Z',
    assignedTo: 'Support Team',
    messages: [
      {
        id: 1,
        sender: 'John Doe',
        senderType: 'user',
        content: 'I\'m getting an error when trying to submit my application for the Software Developer position. The form keeps showing "Please fill in all required fields" even though I\'ve filled everything out.',
        timestamp: '2024-01-20T10:30:00Z',
        attachments: []
      },
      {
        id: 2,
        sender: 'Sarah Johnson',
        senderType: 'support',
        content: 'Thank you for reaching out! I can see the issue you\'re experiencing. Let me investigate this for you. Can you please try the following steps:\n\n1. Clear your browser cache and cookies\n2. Try using a different browser\n3. Make sure all required fields are filled (especially the resume upload)\n\nIf the issue persists, please let me know and I\'ll escalate this to our technical team.',
        timestamp: '2024-01-20T11:15:00Z',
        attachments: []
      },
      {
        id: 3,
        sender: 'John Doe',
        senderType: 'user',
        content: 'I tried all the steps you mentioned but I\'m still getting the same error. I\'ve attached a screenshot of the error message.',
        timestamp: '2024-01-20T14:30:00Z',
        attachments: ['error-screenshot.png']
      },
      {
        id: 4,
        sender: 'Sarah Johnson',
        senderType: 'support',
        content: 'I can see the screenshot you provided. This appears to be a validation issue on our end. I\'ve escalated this to our technical team and they\'re working on a fix. I\'ll update you as soon as we have a resolution. In the meantime, you can try submitting your application using our mobile app as an alternative.',
        timestamp: '2024-01-20T14:45:00Z',
        attachments: []
      }
    ]
  };

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

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setNewMessage('');
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/support')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Support
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Ticket #{ticket.id}</h1>
          <p className="text-gray-600">{ticket.title}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2 mb-2">
                {getStatusIcon(ticket.status)}
                <Badge className={getStatusColor(ticket.status)}>
                  {ticket.status}
                </Badge>
                <Badge className={getPriorityColor(ticket.priority)}>
                  {ticket.priority}
                </Badge>
              </div>
              <CardTitle>{ticket.title}</CardTitle>
              <CardDescription>
                {ticket.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-2" />
                  {ticket.category}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Created: {formatTimestamp(ticket.createdDate)}
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Assigned to: {ticket.assignedTo}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Last updated: {formatTimestamp(ticket.lastUpdated)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Messages */}
          <Card>
            <CardHeader>
              <CardTitle>Conversation</CardTitle>
              <CardDescription>
                {ticket.messages.length} messages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {ticket.messages.map((message) => (
                  <div key={message.id} className={`flex space-x-3 ${message.senderType === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.senderType === 'support' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-500 text-white text-xs">
                          {message.sender.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`max-w-xs lg:max-w-md ${message.senderType === 'user' ? 'order-first' : ''}`}>
                      <div className={`p-3 rounded-lg ${
                        message.senderType === 'user' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        {message.attachments.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {message.attachments.map((attachment, index) => (
                              <div key={index} className="flex items-center space-x-2 text-xs opacity-75">
                                <Paperclip className="h-3 w-3" />
                                <span>{attachment}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className={`text-xs text-gray-500 mt-1 ${message.senderType === 'user' ? 'text-right' : 'text-left'}`}>
                        {message.sender} • {formatTimestamp(message.timestamp)}
                      </div>
                    </div>
                    {message.senderType === 'user' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gray-500 text-white text-xs">
                          {message.sender.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reply Form */}
          {ticket.status !== 'closed' && (
            <Card>
              <CardHeader>
                <CardTitle>Reply</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message here..."
                  rows={4}
                />
                <div className="flex justify-between items-center">
                  <Button variant="outline" size="sm">
                    <Paperclip className="h-4 w-4 mr-2" />
                    Attach File
                  </Button>
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isSubmitting}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Ticket Info */}
          <Card>
            <CardHeader>
              <CardTitle>Ticket Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Status</h4>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(ticket.status)}
                  <Badge className={getStatusColor(ticket.status)}>
                    {ticket.status}
                  </Badge>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Priority</h4>
                <Badge className={getPriorityColor(ticket.priority)}>
                  {ticket.priority}
                </Badge>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Category</h4>
                <p className="text-sm text-gray-600">{ticket.category}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Assigned To</h4>
                <p className="text-sm text-gray-600">{ticket.assignedTo}</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {ticket.status === 'resolved' && (
                <Button variant="outline" className="w-full">
                  Reopen Ticket
                </Button>
              )}
              {ticket.status === 'in progress' && (
                <Button variant="outline" className="w-full">
                  Mark as Resolved
                </Button>
              )}
              <Button variant="outline" className="w-full">
                Escalate Ticket
              </Button>
              <Button variant="outline" className="w-full">
                Add Internal Note
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
