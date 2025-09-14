import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, CheckCircle, Plus, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

export default function SubmitProject() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    technologies: [] as string[],
    difficulty: '',
    duration: '',
    githubUrl: '',
    demoUrl: '',
    documentation: '',
    features: [] as string[],
    challenges: '',
    learnings: '',
    futurePlans: '',
    screenshots: [] as File[],
    video: null as File | null,
    readme: null as File | null,
  });
  const [newTechnology, setNewTechnology] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'screenshots' | 'video' | 'readme') => {
    if (field === 'screenshots') {
      const files = Array.from(e.target.files || []);
      setFormData(prev => ({ ...prev, [field]: [...prev[field], ...files] }));
    } else {
      const file = e.target.files?.[0] || null;
      setFormData(prev => ({ ...prev, [field]: file }));
    }
  };

  const addTechnology = () => {
    if (newTechnology.trim() && !formData.technologies.includes(newTechnology.trim())) {
      setFormData(prev => ({ ...prev, technologies: [...prev.technologies, newTechnology.trim()] }));
      setNewTechnology('');
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData(prev => ({ ...prev, technologies: prev.technologies.filter(t => t !== tech) }));
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({ ...prev, features: [...prev.features, newFeature.trim()] }));
      setNewFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    setFormData(prev => ({ ...prev, features: prev.features.filter(f => f !== feature) }));
  };

  const removeScreenshot = (index: number) => {
    setFormData(prev => ({ ...prev, screenshots: prev.screenshots.filter((_, i) => i !== index) }));
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for submitting your project. Our team will review your submission and get back to you within 3-5 business days.
            </p>
            <div className="space-x-4">
              <Button onClick={() => navigate('/dashboard/projects')}>
                View My Projects
              </Button>
              <Button variant="outline" onClick={() => navigate('/dashboard/projects/submit')}>
                Submit Another Project
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
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/projects')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Submit Project</h1>
          <p className="text-gray-600">Share your project with the community</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
            <CardDescription>
              Tell us about your project
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter your project title"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your project, what it does, and why you built it..."
                rows={4}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web-development">Web Development</SelectItem>
                    <SelectItem value="mobile-development">Mobile Development</SelectItem>
                    <SelectItem value="ai-ml">AI/ML</SelectItem>
                    <SelectItem value="data-science">Data Science</SelectItem>
                    <SelectItem value="game-development">Game Development</SelectItem>
                    <SelectItem value="desktop-application">Desktop Application</SelectItem>
                    <SelectItem value="iot">IoT</SelectItem>
                    <SelectItem value="blockchain">Blockchain</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="difficulty">Difficulty Level *</Label>
                <Select value={formData.difficulty} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration">Development Time</Label>
                <Input
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="e.g., 2 weeks, 3 months"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technologies */}
        <Card>
          <CardHeader>
            <CardTitle>Technologies Used</CardTitle>
            <CardDescription>
              List the technologies, frameworks, and tools you used
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={newTechnology}
                onChange={(e) => setNewTechnology(e.target.value)}
                placeholder="Add technology (e.g., React, Python, MongoDB)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
              />
              <Button type="button" onClick={addTechnology}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.technologies.map((tech, index) => (
                <div key={index} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTechnology(tech)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Links */}
        <Card>
          <CardHeader>
            <CardTitle>Project Links</CardTitle>
            <CardDescription>
              Share your project's GitHub repository and live demo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="githubUrl">GitHub Repository URL</Label>
              <Input
                id="githubUrl"
                name="githubUrl"
                type="url"
                value={formData.githubUrl}
                onChange={handleInputChange}
                placeholder="https://github.com/username/project-name"
              />
            </div>
            <div>
              <Label htmlFor="demoUrl">Live Demo URL</Label>
              <Input
                id="demoUrl"
                name="demoUrl"
                type="url"
                value={formData.demoUrl}
                onChange={handleInputChange}
                placeholder="https://your-project-demo.com"
              />
            </div>
            <div>
              <Label htmlFor="documentation">Documentation URL</Label>
              <Input
                id="documentation"
                name="documentation"
                type="url"
                value={formData.documentation}
                onChange={handleInputChange}
                placeholder="https://docs.your-project.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
            <CardDescription>
              Highlight the main features of your project
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a feature"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              />
              <Button type="button" onClick={addFeature}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <ul className="space-y-2">
              {formData.features.map((feature, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span>{feature}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(feature)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Project Details */}
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>
              Share your development experience and insights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="challenges">Challenges Faced</Label>
              <Textarea
                id="challenges"
                name="challenges"
                value={formData.challenges}
                onChange={handleInputChange}
                placeholder="What challenges did you encounter during development?"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="learnings">Key Learnings</Label>
              <Textarea
                id="learnings"
                name="learnings"
                value={formData.learnings}
                onChange={handleInputChange}
                placeholder="What did you learn from building this project?"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="futurePlans">Future Plans</Label>
              <Textarea
                id="futurePlans"
                name="futurePlans"
                value={formData.futurePlans}
                onChange={handleInputChange}
                placeholder="What are your plans for improving or expanding this project?"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Media Files */}
        <Card>
          <CardHeader>
            <CardTitle>Media & Documentation</CardTitle>
            <CardDescription>
              Upload screenshots, videos, and documentation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="screenshots">Screenshots (JPG, PNG - Max 5MB each)</Label>
              <div className="mt-2">
                <Input
                  id="screenshots"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  multiple
                  onChange={(e) => handleFileChange(e, 'screenshots')}
                />
                {formData.screenshots.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {formData.screenshots.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeScreenshot(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="video">Demo Video (MP4, MOV - Max 50MB)</Label>
              <div className="mt-2">
                <Input
                  id="video"
                  type="file"
                  accept=".mp4,.mov"
                  onChange={(e) => handleFileChange(e, 'video')}
                />
                {formData.video && (
                  <p className="text-sm text-green-600 mt-1">
                    <FileText className="h-4 w-4 inline mr-1" />
                    {formData.video.name}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="readme">README File (MD, TXT - Max 2MB)</Label>
              <div className="mt-2">
                <Input
                  id="readme"
                  type="file"
                  accept=".md,.txt"
                  onChange={(e) => handleFileChange(e, 'readme')}
                />
                {formData.readme && (
                  <p className="text-sm text-green-600 mt-1">
                    <FileText className="h-4 w-4 inline mr-1" />
                    {formData.readme.name}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => navigate('/dashboard/projects')}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Project'}
          </Button>
        </div>
      </form>
    </div>
  );
}
