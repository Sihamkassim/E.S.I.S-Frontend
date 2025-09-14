import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';

// Mock data for frontend development
const mockInternship = {
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
};

export default function ApplyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Form data structure matching the API
  const [formData, setFormData] = useState({
    personal: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
    education: {
      degree: '',
      institution: '',
      graduationYear: '',
      gpa: '',
    },
    experience: {
      previousJobs: '',
      skills: '',
      projects: '',
    },
    motivation: {
      whyInterested: '',
      careerGoals: '',
      availability: '',
    },
    documents: {
      resumeUrl: '',
      coverLetterUrl: '',
      portfolioUrl: '',
    },
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...(prev[parent as keyof typeof prev] as any), [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'resumeUrl' | 'coverLetterUrl' | 'portfolioUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload the file first and get the URL
      // For now, we'll use a placeholder URL
      setFormData(prev => ({
        ...prev,
        documents: { ...prev.documents, [field]: URL.createObjectURL(file) }
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your application. We'll review your submission and get back to you within 5-7 business days.
            </p>
            <div className="space-x-4">
              <Button onClick={() => navigate('/dashboard/internships')}>
                Browse More Internships
              </Button>
              <Button variant="outline" onClick={() => navigate('/dashboard/internships/my')}>
                View My Applications
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
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/internships')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Internships
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Apply for Internship</h1>
          <p className="text-gray-600">
            Complete your application for {mockInternship.title} at {mockInternship.department}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Provide your basic contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="personal.name">Full Name *</Label>
                <Input
                  id="personal.name"
                  name="personal.name"
                  value={formData.personal.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="personal.email">Email Address *</Label>
                <Input
                  id="personal.email"
                  name="personal.email"
                  type="email"
                  value={formData.personal.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="personal.phone">Phone Number</Label>
                <Input
                  id="personal.phone"
                  name="personal.phone"
                  type="tel"
                  value={formData.personal.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="personal.address">Address</Label>
                <Input
                  id="personal.address"
                  name="personal.address"
                  value={formData.personal.address}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Education Information */}
        <Card>
          <CardHeader>
            <CardTitle>Education Information</CardTitle>
            <CardDescription>
              Tell us about your educational background
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="education.degree">Degree *</Label>
                <Input
                  id="education.degree"
                  name="education.degree"
                  value={formData.education.degree}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="education.institution">Institution *</Label>
                <Input
                  id="education.institution"
                  name="education.institution"
                  value={formData.education.institution}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="education.graduationYear">Graduation Year *</Label>
                <Input
                  id="education.graduationYear"
                  name="education.graduationYear"
                  type="number"
                  value={formData.education.graduationYear}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="education.gpa">GPA (Optional)</Label>
                <Input
                  id="education.gpa"
                  name="education.gpa"
                  type="text"
                  value={formData.education.gpa}
                  onChange={handleInputChange}
                  placeholder="e.g., 3.5/4.0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Experience Information */}
        <Card>
          <CardHeader>
            <CardTitle>Experience & Skills</CardTitle>
            <CardDescription>
              Tell us about your previous work experience and skills
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="experience.previousJobs">Previous Jobs/Experience</Label>
              <Textarea
                id="experience.previousJobs"
                name="experience.previousJobs"
                value={formData.experience.previousJobs}
                onChange={handleInputChange}
                placeholder="Describe your previous work experience..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="experience.skills">Skills</Label>
              <Textarea
                id="experience.skills"
                name="experience.skills"
                value={formData.experience.skills}
                onChange={handleInputChange}
                placeholder="List your relevant skills..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="experience.projects">Projects</Label>
              <Textarea
                id="experience.projects"
                name="experience.projects"
                value={formData.experience.projects}
                onChange={handleInputChange}
                placeholder="Describe any relevant projects you've worked on..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Motivation */}
        <Card>
          <CardHeader>
            <CardTitle>Motivation & Goals</CardTitle>
            <CardDescription>
              Tell us why you're interested in this internship
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="motivation.whyInterested">Why are you interested in this internship? *</Label>
              <Textarea
                id="motivation.whyInterested"
                name="motivation.whyInterested"
                value={formData.motivation.whyInterested}
                onChange={handleInputChange}
                placeholder="Explain your interest in this internship..."
                rows={4}
                required
              />
            </div>
            <div>
              <Label htmlFor="motivation.careerGoals">Career Goals</Label>
              <Textarea
                id="motivation.careerGoals"
                name="motivation.careerGoals"
                value={formData.motivation.careerGoals}
                onChange={handleInputChange}
                placeholder="What are your career goals?"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="motivation.availability">Availability</Label>
              <Textarea
                id="motivation.availability"
                name="motivation.availability"
                value={formData.motivation.availability}
                onChange={handleInputChange}
                placeholder="When are you available to start? How many hours per week?"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>
              Upload your resume and other relevant documents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="resume">Resume *</Label>
              <div className="mt-2">
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, 'resumeUrl')}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">PDF, DOC, or DOCX files only</p>
              </div>
            </div>
            <div>
              <Label htmlFor="coverLetter">Cover Letter</Label>
              <div className="mt-2">
                <Input
                  id="coverLetter"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, 'coverLetterUrl')}
                />
                <p className="text-sm text-gray-500 mt-1">PDF, DOC, or DOCX files only</p>
              </div>
            </div>
            <div>
              <Label htmlFor="portfolio">Portfolio</Label>
              <div className="mt-2">
                <Input
                  id="portfolio"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, 'portfolioUrl')}
                />
                <p className="text-sm text-gray-500 mt-1">PDF, DOC, or DOCX files only</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboard/internships')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        </div>
      </form>
    </div>
  );
}