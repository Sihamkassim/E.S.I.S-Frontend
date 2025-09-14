import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Building2, Users, DollarSign, CheckCircle, Loader2, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
// Mock data for frontend development

export default function StartupForm() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  
  // Form data structure matching the API from Postman collection
  const [formData, setFormData] = useState({
    name: '',
    logoUrl: '',
    siteUrl: '',
    pitch: '',
    founders: [] as string[],
    stage: '',
    traction: '',
    deckUrl: '',
    demoLink: '',
    tags: [] as string[],
    country: '',
    industry: '',
  });
  
  const [founderInput, setFounderInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addFounder = () => {
    if (founderInput.trim()) {
      setFormData(prev => ({
        ...prev,
        founders: [...prev.founders, founderInput.trim()]
      }));
      setFounderInput('');
    }
  };

  const removeFounder = (index: number) => {
    setFormData(prev => ({
      ...prev,
      founders: prev.founders.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Startup Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for submitting your startup. We'll review your submission and get back to you within 3-5 business days.
            </p>
            <div className="space-x-4">
              <Button onClick={() => navigate('/dashboard/startups')}>
                My Startups
              </Button>
              <Button variant="outline" onClick={() => navigate('/dashboard/startups/directory')}>
                Browse Directory
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
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/startups')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Startups
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Submit Your Startup</h1>
          <p className="text-gray-600">Share your startup with our community and get discovered</p>
        </div>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Tell us about your startup
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Startup Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., ASTU Innovators"
                  required
                />
              </div>
              <div>
                <Label htmlFor="industry">Industry *</Label>
                <Select value={formData.industry} onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="E-commerce">E-commerce</SelectItem>
                    <SelectItem value="Agriculture">Agriculture</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="pitch">Pitch *</Label>
              <Textarea
                id="pitch"
                name="pitch"
                value={formData.pitch}
                onChange={handleInputChange}
                placeholder="Brief description of your startup and what problem it solves..."
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="siteUrl">Website URL</Label>
                <Input
                  id="siteUrl"
                  name="siteUrl"
                  type="url"
                  value={formData.siteUrl}
                  onChange={handleInputChange}
                  placeholder="https://yourstartup.com"
                />
              </div>
              <div>
                <Label htmlFor="demoLink">Demo Link</Label>
                <Input
                  id="demoLink"
                  name="demoLink"
                  type="url"
                  value={formData.demoLink}
                  onChange={handleInputChange}
                  placeholder="https://demo.yourstartup.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Team Information
            </CardTitle>
            <CardDescription>
              Tell us about your founding team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Founders *</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={founderInput}
                  onChange={(e) => setFounderInput(e.target.value)}
                  placeholder="Enter founder name"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFounder())}
                />
                <Button type="button" onClick={addFounder} variant="outline">
                  Add
                </Button>
              </div>
              {formData.founders.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.founders.map((founder, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {founder}
                      <button
                        type="button"
                        onClick={() => removeFounder(index)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Business Information
            </CardTitle>
            <CardDescription>
              Tell us about your business stage and traction
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stage">Stage *</Label>
                <Select value={formData.stage} onValueChange={(value) => setFormData(prev => ({ ...prev, stage: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Idea">Idea</SelectItem>
                    <SelectItem value="MVP">MVP</SelectItem>
                    <SelectItem value="Seed">Seed</SelectItem>
                    <SelectItem value="Series A">Series A</SelectItem>
                    <SelectItem value="Series B">Series B</SelectItem>
                    <SelectItem value="Growth">Growth</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="e.g., Ethiopia"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="traction">Traction</Label>
              <Textarea
                id="traction"
                name="traction"
                value={formData.traction}
                onChange={handleInputChange}
                placeholder="Describe your traction, metrics, and achievements..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="deckUrl">Pitch Deck URL</Label>
              <Input
                id="deckUrl"
                name="deckUrl"
                type="url"
                value={formData.deckUrl}
                onChange={handleInputChange}
                placeholder="https://drive.google.com/deck.pdf"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
            <CardDescription>
              Add relevant tags to help people discover your startup
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Enter a tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline">
                Add Tag
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboard/startups')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Startup'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}