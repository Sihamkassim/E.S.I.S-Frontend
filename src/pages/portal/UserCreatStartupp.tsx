import { ArrowLeft, PlusCircle, Trash2, Building2, Globe, MapPin, Tag, TrendingUp, FileText, Link, Image, BarChart, Text } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
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
      await api.post('/user/startups', formData);
      toast.success('Startup created successfully!');
      navigate('/dashboard/my-startups');
    } catch (error: any) {
      toast.error(`Failed to create startup: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard/me-startup')}
          className="mb-6 group"
        >
          <ArrowLeft className={`mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1 ${theme} === 'dark' ? 'text-gray-300' : 'text-gray-700'`} />
          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
            Back to Startups
          </span>
        </Button>

        <div className="text-center max-w-2xl mx-auto">
          <h1 className={`text-3xl lg:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
            Create New Startup
          </h1>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
            Fill out your startup details to get listed and attract potential investors
          </p>
        </div>
      </div>

      {/* Main Form */}
      <Card className={`
        border-2 transition-all duration-200
        ${theme === 'dark'
          ? 'bg-gray-800/50 border-gray-700'
          : 'bg-white border-gray-200'
        }
      `}>
        <CardHeader className="text-center pb-6">
          <CardTitle className={`text-2xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
            Startup Information
          </CardTitle>
          <CardDescription className={`
            text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
          `}>
            Fields marked with * are required
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-6">
              <h3 className={`
                text-xl font-semibold pb-2 border-b
                ${theme === 'dark'
                  ? 'text-white border-gray-700'
                  : 'text-gray-900 border-gray-200'
                }
              `}>
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Startup Name */}
                <div className="space-y-3">
                  <label htmlFor="name" className={`
                    flex items-center gap-2 text-sm font-medium
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}>
                    <Building2 className="h-4 w-4" />
                    Startup Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your startup name"
                    className={`
                      transition-all duration-200
                      ${theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                      }
                    `}
                  />
                </div>

                {/* Country */}
                <div className="space-y-3">
                  <label htmlFor="country" className={`
                    flex items-center gap-2 text-sm font-medium
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}>
                    <MapPin className="h-4 w-4" />
                    Country *
                  </label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    placeholder="Country of operation"
                    className={`
                      transition-all duration-200
                      ${theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                      }
                    `}
                  />
                </div>

                {/* Stage */}
                <div className="space-y-3">
                  <label htmlFor="stage" className={`
                    flex items-center gap-2 text-sm font-medium
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}>
                    <TrendingUp className="h-4 w-4" />
                    Stage *
                  </label>
                  <Select
                    value={formData.stage}
                    onValueChange={(value) => handleSelectChange('stage', value)}
                  >
                    <SelectTrigger className={`
                      transition-all duration-200
                      ${theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                      }
                    `}>
                      <SelectValue placeholder="Select startup stage" />
                    </SelectTrigger>
                    <SelectContent className={`
                      ${theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                      }
                    `}>
                      <SelectItem value="Idea">Idea Stage</SelectItem>
                      <SelectItem value="Pre-Seed">Pre-Seed</SelectItem>
                      <SelectItem value="Seed">Seed</SelectItem>
                      <SelectItem value="Series A">Series A</SelectItem>
                      <SelectItem value="Series B">Series B+</SelectItem>
                      <SelectItem value="Growth">Growth Stage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Website */}
                <div className="space-y-3">
                  <label htmlFor="website" className={`
                    flex items-center gap-2 text-sm font-medium
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}>
                    <Globe className="h-4 w-4" />
                    Website
                  </label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className={`
                      transition-all duration-200
                      ${theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                      }
                    `}
                  />
                </div>
              </div>
            </div>

            {/* Media & Links Section */}
            <div className="space-y-6">
              <h3 className={`
                text-xl font-semibold pb-2 border-b
                ${theme === 'dark'
                  ? 'text-white border-gray-700'
                  : 'text-gray-900 border-gray-200'
                }
              `}>
                Media & Links
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Logo URL */}
                <div className="space-y-3">
                  <label htmlFor="logo" className={`
                    flex items-center gap-2 text-sm font-medium
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}>
                    <Image className="h-4 w-4" />
                    Logo URL
                  </label>
                  <Input
                    id="logo"
                    name="logo"
                    type="url"
                    value={formData.logo}
                    onChange={handleChange}
                    placeholder="https://example.com/logo.png"
                    className={`
                      transition-all duration-200
                      ${theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                      }
                    `}
                  />
                </div>

                {/* Demo Link */}
                <div className="space-y-3">
                  <label htmlFor="demoLink" className={`
                    flex items-center gap-2 text-sm font-medium
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}>
                    <Link className="h-4 w-4" />
                    Demo Link
                  </label>
                  <Input
                    id="demoLink"
                    name="demoLink"
                    type="url"
                    value={formData.demoLink}
                    onChange={handleChange}
                    placeholder="https://demo.example.com"
                    className={`
                      transition-all duration-200
                      ${theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                      }
                    `}
                  />
                </div>

                {/* Deck URL */}
                <div className="space-y-3">
                  <label htmlFor="deck" className={`
                    flex items-center gap-2 text-sm font-medium
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}>
                    <FileText className="h-4 w-4" />
                    Pitch Deck URL
                  </label>
                  <Input
                    id="deck"
                    name="deck"
                    type="url"
                    value={formData.deck}
                    onChange={handleChange}
                    placeholder="https://docs.google.com/presentation/..."
                    className={`
                      transition-all duration-200
                      ${theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                      }
                    `}
                  />
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-6">
              <h3 className={`
                text-xl font-semibold pb-2 border-b
                ${theme === 'dark'
                  ? 'text-white border-gray-700'
                  : 'text-gray-900 border-gray-200'
                }
              `}>
                Description
              </h3>

              {/* Pitch */}
              <div className="space-y-3">
                <label htmlFor="pitch" className={`
                  flex items-center gap-2 text-sm font-medium
                  ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                `}>
                  <Text className="h-4 w-4" />
                  Pitch Description *
                </label>
                <Textarea
                  id="pitch"
                  name="pitch"
                  value={formData.pitch}
                  onChange={handleChange}
                  rows={4}
                  required
                  placeholder="Describe your startup in 2-3 sentences. What problem are you solving and for whom?"
                  className={`
                    resize-none transition-all duration-200
                    ${theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                    }
                  `}
                />
              </div>

              {/* Traction */}
              <div className="space-y-3">
                <label htmlFor="traction" className={`
                  flex items-center gap-2 text-sm font-medium
                  ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                `}>
                  <BarChart className="h-4 w-4" />
                  Traction & Milestones
                </label>
                <Textarea
                  id="traction"
                  name="traction"
                  value={formData.traction}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Key milestones, user growth, revenue, partnerships, or any other metrics that show progress..."
                  className={`
                    resize-none transition-all duration-200
                    ${theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                    }
                  `}
                />
              </div>
            </div>

            {/* Tags Section */}
            <div className="space-y-6">
              <h3 className={`
                text-xl font-semibold pb-2 border-b
                ${theme === 'dark'
                  ? 'text-white border-gray-700'
                  : 'text-gray-900 border-gray-200'
                }
              `}>
                Tags & Categories
              </h3>

              <div className="space-y-4">
                <label htmlFor="tags" className={`
                  flex items-center gap-2 text-sm font-medium
                  ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                `}>
                  <Tag className="h-4 w-4" />
                  Tags
                </label>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={handleTagKeyPress}
                      placeholder="Add a tag (e.g., AI, Fintech, SaaS)"
                      className={`
                        transition-all duration-200
                        ${theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                        }
                      `}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addTag}
                      className={`
                        transition-all duration-200
                        ${theme === 'dark'
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>

                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className={`
                            gap-2 px-3 py-1.5 text-sm transition-all duration-200
                            ${theme === 'dark'
                              ? 'bg-blue-900/30 text-blue-300 hover:bg-blue-900/50'
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }
                          `}
                        >
                          {tag}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 hover:bg-transparent"
                            onClick={() => removeTag(index)}
                          >
                            <Trash2 className={`
                              h-3 w-3 transition-colors
                              ${theme === 'dark'
                                ? 'text-red-400 hover:text-red-300'
                                : 'text-red-500 hover:text-red-600'
                              }
                            `} />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className={`
              flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t
              ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
            `}>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard/my-startups')}
                className={`
                  transition-all duration-200
                  ${theme === 'dark'
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className={`
                  min-w-[160px] transition-all duration-200
                  bg-blue-600 hover:bg-blue-700 text-white
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transform hover:scale-105 active:scale-95
                `}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Creating Startup...
                  </>
                ) : (
                  'Create Startup'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Help Text */}
      <div className={`
        mt-8 p-6 rounded-lg text-center
        ${theme === 'dark'
          ? 'bg-gray-800/30 border border-gray-700'
          : 'bg-gray-50 border border-gray-200'
        }
      `}>
        <p className={`
          text-sm
          ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
        `}>
          Your startup will be created as a draft. You can submit it for review once you've completed all the details.
        </p>
      </div>
    </div>
  );
};

export default UserCreateStartup;