import { ArrowLeft, PlusCircle, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { useTheme } from '../../hooks/useTheme';
import { api } from '@/services/api';

interface StartupFormData {
  name: string;
  logo: string;
  website: string;
  pitch: string;
  stage: string;
  traction: string;
  deck: string;
  demoLink: string;
  tags: string[];
  country: string;
}

const UserCreateStartup: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<StartupFormData>({
    name: '',
    logo: '',
    website: '',
    pitch: '',
    stage: '',
    traction: '',
    deck: '',
    demoLink: '',
    tags: [],
    country: '',
  });

  const [currentTag, setCurrentTag] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof StartupFormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/user/startups', formData);

      toast.success('Startup created successfully!');
      navigate('/dashboard/my-startups');
    } catch (error: any) {
      toast.error(`Failed to create startup: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Startups
        </Button>
        <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Create New Startup
        </h1>
        <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Fill out the details below to register your startup.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Startup Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="font-medium">Startup Name *</label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your startup name"
            />
          </div>

          {/* Country */}
          <div className="space-y-2">
            <label htmlFor="country" className="font-medium">Country *</label>
            <Input
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              placeholder="Country of operation"
            />
          </div>

          {/* Website */}
          <div className="space-y-2">
            <label htmlFor="website" className="font-medium">Website</label>
            <Input
              id="website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
            />
          </div>

          {/* Stage */}
          <div className="space-y-2">
            <label htmlFor="stage" className="font-medium">Stage *</label>
            <Select
              value={formData.stage}
              onValueChange={(value) => handleSelectChange('stage', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select startup stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Idea">Idea Stage</SelectItem>
                <SelectItem value="Pre-Seed">Pre-Seed</SelectItem>
                <SelectItem value="Seed">Seed</SelectItem>
                <SelectItem value="Series A">Series A</SelectItem>
                <SelectItem value="Series B">Series B+</SelectItem>
                <SelectItem value="Growth">Growth Stage</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Logo URL */}
          <div className="space-y-2">
            <label htmlFor="logo" className="font-medium">Logo URL</label>
            <Input
              id="logo"
              name="logo"
              type="url"
              value={formData.logo}
              onChange={handleChange}
              placeholder="https://example.com/logo.png"
            />
          </div>

          {/* Demo Link */}
          <div className="space-y-2">
            <label htmlFor="demoLink" className="font-medium">Demo Link</label>
            <Input
              id="demoLink"
              name="demoLink"
              type="url"
              value={formData.demoLink}
              onChange={handleChange}
              placeholder="https://demo.example.com"
            />
          </div>

          {/* Deck URL */}
          <div className="space-y-2">
            <label htmlFor="deck" className="font-medium">Pitch Deck URL</label>
            <Input
              id="deck"
              name="deck"
              type="url"
              value={formData.deck}
              onChange={handleChange}
              placeholder="https://docs.google.com/presentation/..."
            />
          </div>

          {/* Pitch */}
          <div className="md:col-span-2 space-y-2">
            <label htmlFor="pitch" className="font-medium">Pitch *</label>
            <Textarea
              id="pitch"
              name="pitch"
              value={formData.pitch}
              onChange={handleChange}
              rows={4}
              required
              placeholder="Describe your startup in 2-3 sentences..."
            />
          </div>

          {/* Traction */}
          <div className="md:col-span-2 space-y-2">
            <label htmlFor="traction" className="font-medium">Traction</label>
            <Textarea
              id="traction"
              name="traction"
              value={formData.traction}
              onChange={handleChange}
              rows={3}
              placeholder="Key milestones, user growth, revenue, etc."
            />
          </div>

          {/* Tags */}
          <div className="md:col-span-2 space-y-2">
            <label htmlFor="tags" className="font-medium">Tags</label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                  placeholder="Add a tag (e.g., AI, Fintech, SaaS)"
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  <PlusCircle className="h-4 w-4 mr-2" /> Add
                </Button>
              </div>

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <div key={index} className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full">
                      <span className="text-sm">{tag}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4"
                        onClick={() => removeTag(index)}
                      >
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={() => navigate('/dashboard/me-startup')}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Startup'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserCreateStartup;