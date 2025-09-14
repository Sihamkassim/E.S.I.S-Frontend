import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, CheckCircle, Calendar, Clock, Users, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';

// Mock data for frontend development
const mockWebinar = {
  id: 1,
  title: 'AI in Business: Transforming Industries',
  description: 'Learn how artificial intelligence is revolutionizing business operations across various industries.',
  date: '2024-02-15',
  time: '2:00 PM - 3:30 PM EST',
  duration: 90,
  price: 49,
  maxParticipants: 100,
  currentParticipants: 67,
  questions: [
    'What is your current role and experience level?',
    'What specific topics would you like to learn about?',
    'Do you have any questions for the instructor?'
  ],
  status: 'PUBLISHED',
  createdAt: '2024-01-10T10:00:00Z'
};

export default function WebinarApplication() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Form data structure matching the API
  const [formData, setFormData] = useState({
    answers: {} as Record<string, string>,
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      answers: { ...prev.answers, [name]: value }
    }));
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setIsCompleted(true);
  };

  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
            <p className="text-gray-600 mb-6">
              You've successfully registered for "{mockWebinar.title}". We'll send you the meeting link and materials 24 hours before the webinar.
            </p>
            <div className="space-x-4">
              <Button onClick={() => navigate('/dashboard/webinars')}>
                Browse More Webinars
              </Button>
              <Button variant="outline" onClick={() => navigate('/dashboard/webinars/my')}>
                View My Webinars
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/webinars')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Webinars
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Register for Webinar</h1>
          <p className="text-gray-600">Complete your registration and payment</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Webinar Details */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Webinar Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{mockWebinar.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{mockWebinar.description}</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{new Date(mockWebinar.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{mockWebinar.time} ({mockWebinar.duration} min)</span>
                </div>
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{mockWebinar.currentParticipants}/{mockWebinar.maxParticipants} registered</span>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Price:</span>
                  <span className="text-2xl font-bold text-green-600">
                    <DollarSign className="h-5 w-5 inline mr-1" />
                    {mockWebinar.price === 0 ? 'Free' : mockWebinar.price}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Registration Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleApply} className="space-y-6">
            {/* Webinar Questions */}
            <Card>
              <CardHeader>
                <CardTitle>Registration Questions</CardTitle>
                <CardDescription>
                  Please answer the following questions to complete your registration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockWebinar.questions.map((question, index) => (
                  <div key={index}>
                    <Label htmlFor={`question${index + 1}`}>
                      {question} {index === 0 && '*'}
                    </Label>
                    <Textarea
                      id={`question${index + 1}`}
                      name={`question${index + 1}`}
                      value={formData.answers[`question${index + 1}`] || ''}
                      onChange={handleInputChange}
                      placeholder="Your answer..."
                      rows={3}
                      required={index === 0}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => navigate('/dashboard/webinars')}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  'Processing...'
                ) : (
                  <>
                    {mockWebinar.price === 0 ? (
                      'Register for Free'
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Register - ${mockWebinar.price}
                      </>
                    )}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}