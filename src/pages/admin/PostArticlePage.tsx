import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import articleService, { Article, CreateArticleData, UpdateArticleData, Tag } from '../../services/articleService';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Loader2, ArrowLeft, Save, Upload, X, Image as ImageIcon, Tag as TagIcon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const PostArticlePage = () => {
  const { user } = useAuthStore();
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    categoryId: '',
    tags: [] as string[],
    metaTitle: '',
    metaDescription: '',
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'SCHEDULED',
    publishAt: '',
  });

  const [tagInput, setTagInput] = useState('');
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [originalArticle, setOriginalArticle] = useState<Article | null>(null);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const [loadingTags, setLoadingTags] = useState(false);

  // Fetch article data and available tags
  useEffect(() => {
    fetchAvailableTags();
    if (isEditing && id) {
      fetchArticle();
    }
  }, [id, isEditing]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      setError("");

      // Get article data for editing
      const articlesResponse = await articleService.getAdminArticles({ status: '' });
      const articleFromAdmin = articlesResponse.data.find(a => a.id === parseInt(id!));
      
      if (!articleFromAdmin) {
        throw new Error("Article not found");
      }

      let finalArticle = articleFromAdmin;

      // Try to get full content from public API if published
      if (articleFromAdmin.status === 'PUBLISHED' && articleFromAdmin.slug) {
        try {
          const publicArticle = await articleService.getArticleBySlug(articleFromAdmin.slug);
          finalArticle = {
            ...articleFromAdmin,
            content: publicArticle.content || articleFromAdmin.content,
            summary: publicArticle.summary || articleFromAdmin.summary,
          };
        } catch (publicError) {
          console.warn('Using admin data only, public API failed:', publicError);
        }
      }

      setOriginalArticle(finalArticle);
      updateFormDataFromArticle(finalArticle);

    } catch (err) {
      setError('Failed to load article');
      console.error('Error fetching article:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateFormDataFromArticle = (article: Article) => {
    // Extract tag names
    const tagNames = (article.tags || [])
      .map(tag => {
        if (typeof tag === 'string') return tag;
        if (tag?.tag?.name) return tag.tag.name;
        return null;
      })
      .filter((name): name is string => Boolean(name?.trim()));

    setFormData({
      title: article.title || "",
      content: article.content || "",
      summary: article.summary || "",
      categoryId: article.categoryId?.toString() || "",
      tags: tagNames,
      metaTitle: article.metaTitle || "",
      metaDescription: article.metaDescription || "",
      status: 'DRAFT', // Always set to DRAFT when loading
      publishAt: article.publishedAt
        ? new Date(article.publishedAt).toISOString().slice(0, 16)
        : "",
    });

    // Set featured image
    if (article.featuredImage) {
      const imageUrl = article.featuredImage.startsWith("http")
        ? article.featuredImage
        : `${import.meta.env.VITE_API_BASE_URL || ""}${article.featuredImage}`;
      setImagePreview(imageUrl);
    }
  };

  const fetchAvailableTags = async () => {
    try {
      setLoadingTags(true);
      const tags = await articleService.getTags();
      setAvailableTags(tags);
    } catch (err) {
      console.error('Error fetching tags:', err);
    } finally {
      setLoadingTags(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value || ''
    }));
    
    if (error || success) {
      setError('');
      setSuccess('');
    }
  };

  const handleTagInputChange = (value: string) => {
    setTagInput(value);
    
    if (value.trim()) {
      const suggestions = availableTags
        .map(tag => tag.name)
        .filter(name => 
          name.toLowerCase().includes(value.toLowerCase()) && 
          !formData.tags.includes(name)
        )
        .slice(0, 5);
      setTagSuggestions(suggestions);
    } else {
      setTagSuggestions([]);
    }
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag]
      }));
      setTagInput('');
      setTagSuggestions([]);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    if (!formData.tags.includes(suggestion)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, suggestion]
      }));
    }
    setTagInput('');
    setTagSuggestions([]);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setFeaturedImage(file);
    setError('');
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setFeaturedImage(null);
    setImagePreview('');
    
    // Reset the file input
    const fileInput = document.getElementById('featuredImage') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSaveDraft = async () => {
    try {
      setSubmitting(true);
      setError('');

      // Validate required fields
      const title = formData.title?.trim();
      const content = formData.content?.trim();

      if (!title || !content) {
        setError('Title and content are required');
        return;
      }

      // Always save as draft - override any status selection
      const submitData: CreateArticleData | UpdateArticleData = {
        title: title,
        content: content,
        summary: formData.summary?.trim() || undefined,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : undefined,
        tags: formData.tags.filter(tag => tag.trim()),
        metaTitle: formData.metaTitle?.trim() || undefined,
        metaDescription: formData.metaDescription?.trim() || undefined,
        status: 'DRAFT', // Force DRAFT status
        publishAt: undefined, // Clear publish date since we're saving as draft
        featuredImage: featuredImage || undefined,
      };

      let result: Article;

      if (isEditing && originalArticle) {
        result = await articleService.updateArticle(originalArticle.id, submitData as UpdateArticleData);
        setSuccess('Draft saved successfully!');
        setOriginalArticle(result);
      } else {
        result = await articleService.createArticle(submitData as CreateArticleData);
        setSuccess('Draft created successfully!');
        
        // Redirect to edit page for the new article
        setTimeout(() => {
          navigate("../../dashboard/admin-articles");
        }, 1500);
      }

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to save draft';
      setError(errorMessage);
      console.error('Error saving draft:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Check if there are changes (for editing mode)
  const hasChanges = () => {
    if (!isEditing || !originalArticle) return true; // Always true for new articles
    
    const originalTagNames = (originalArticle.tags || [])
      .map(tag => {
        if (typeof tag === 'string') return tag;
        if (tag?.tag?.name) return tag.tag.name;
        return null;
      })
      .filter((name): name is string => Boolean(name?.trim()));

    const currentTags = formData.tags.filter(tag => tag.trim());
    
    return (
      formData.title !== originalArticle.title ||
      formData.content !== originalArticle.content ||
      formData.summary !== (originalArticle.summary || '') ||
      formData.categoryId !== (originalArticle.categoryId?.toString() || '') ||
      JSON.stringify(currentTags.sort()) !== JSON.stringify(originalTagNames.sort()) ||
      formData.metaTitle !== (originalArticle.metaTitle || '') ||
      formData.metaDescription !== (originalArticle.metaDescription || '') ||
      featuredImage !== null
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            {isEditing ? 'Loading article...' : 'Preparing editor...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container max-w-6xl mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(-1)}
              className={theme === 'dark' ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-100'}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {isEditing ? 'Edit Draft' : 'Create New Draft'}
              </h1>
              <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {isEditing ? 'Update your draft content' : 'Create a new draft article'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSaveDraft}
              disabled={submitting || (isEditing && !hasChanges())}
              className="bg-primary hover:bg-primary-dark text-white"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              {isEditing ? 'Save Draft' : 'Create Draft'}
            </Button>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className={`p-4 rounded-lg ${
            theme === 'dark' ? 'bg-red-900/20 border border-red-800 text-red-400' : 'bg-red-50 border border-red-200 text-red-600'
          }`}>
            {error}
          </div>
        )}
        {success && (
          <div className={`p-4 rounded-lg ${
            theme === 'dark' ? 'bg-green-900/20 border border-green-800 text-green-400' : 'bg-green-50 border border-green-200 text-green-600'
          }`}>
            {success}
          </div>
        )}

        {/* Article Info (only for editing) */}
        {isEditing && originalArticle && (
          <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className={`font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Created:</span>
                  <span className={`ml-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {new Date(originalArticle.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className={`font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Last Updated:</span>
                  <span className={`ml-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {new Date(originalArticle.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className={`font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Status:</span>
                  <span className={`ml-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Draft
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
              <CardHeader>
                <CardTitle className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Article Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Title *
                  </label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter article title..."
                    className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="summary" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Summary
                  </label>
                  <Textarea
                    id="summary"
                    value={formData.summary}
                    onChange={(e) => handleInputChange('summary', e.target.value)}
                    placeholder="Brief summary of your article..."
                    rows={3}
                    className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="content" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Content *
                  </label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Write your article content here..."
                    rows={15}
                    className={`resize-none ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Image */}
            <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
              <CardHeader>
                <CardTitle className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Featured Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {imagePreview ? (
                  <div className="space-y-2">
                    <div className="relative aspect-video rounded-md overflow-hidden border border-gray-600">
                      <img
                        src={imagePreview}
                        alt="Featured image preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex gap-2">
                      <label htmlFor="featuredImage" className="flex-1 cursor-pointer">
                        <div
                          className={`w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 ${
                            theme === 'dark' ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Change Image
                        </div>
                      </label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={removeImage}
                        className="flex-1"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remove Image
                      </Button>
                    </div>
                  </div>
                ) : (
                  <label htmlFor="featuredImage" className="cursor-pointer">
                    <div className={`border-2 border-dashed rounded-md p-6 text-center transition-colors hover:border-primary ${
                      theme === 'dark' ? 'border-gray-600 hover:border-primary' : 'border-gray-300 hover:border-primary'
                    }`}>
                      <ImageIcon className={`h-8 w-8 mx-auto mb-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                      <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Click to upload featured image
                      </p>
                      <div className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 ${
                        theme === 'dark' ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'
                      }`}>
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Image
                      </div>
                    </div>
                  </label>
                )}
                
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="featuredImage"
                />
                
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Supports: JPEG, PNG, WebP • Max size: 5MB
                </p>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
              <CardHeader>
                <CardTitle className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Category
                  </label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => handleInputChange('categoryId', value)}
                  >
                    <SelectTrigger className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}>
                      <SelectItem value="1">Technology</SelectItem>
                      <SelectItem value="2">Programming</SelectItem>
                      <SelectItem value="3">Web Development</SelectItem>
                      <SelectItem value="4">Mobile Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Tags
                    {loadingTags && (
                      <span className="ml-2 text-xs text-gray-500">Loading tags...</span>
                    )}
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          value={tagInput}
                          onChange={(e) => handleTagInputChange(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                          placeholder="Type to search tags..."
                          className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}
                        />
                        {tagSuggestions.length > 0 && (
                          <div className={`absolute top-full left-0 right-0 mt-1 rounded-md border shadow-lg z-10 ${
                            theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
                          }`}>
                            {tagSuggestions.map((suggestion, index) => (
                              <div
                                key={index}
                                className={`px-3 py-2 cursor-pointer hover:bg-opacity-50 ${
                                  theme === 'dark' 
                                    ? 'hover:bg-gray-700 text-gray-300' 
                                    : 'hover:bg-gray-100 text-gray-700'
                                } ${index === 0 ? 'rounded-t-md' : ''} ${
                                  index === tagSuggestions.length - 1 ? 'rounded-b-md' : ''
                                }`}
                                onClick={() => handleSelectSuggestion(suggestion)}
                              >
                                <div className="flex items-center gap-2">
                                  <TagIcon className="h-3 w-3" />
                                  {suggestion}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleAddTag}
                        disabled={!tagInput.trim()}
                        className={theme === 'dark' ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'}
                      >
                        Add
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="secondary" 
                          className={`flex items-center gap-1 ${
                            theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          <TagIcon className="h-3 w-3" />
                          {tag}
                          <X
                            className="h-3 w-3 cursor-pointer hover:opacity-70"
                            onClick={() => handleRemoveTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                    
                    {availableTags.length > 0 && (
                      <div className="mt-2">
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
                          Available tags ({availableTags.length}):
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {availableTags.slice(0, 10).map((tag) => (
                            <Badge
                              key={tag.id}
                              variant="outline"
                              className={`text-xs cursor-pointer ${
                                formData.tags.includes(tag.name)
                                  ? theme === 'dark' 
                                    ? 'bg-primary text-white' 
                                    : 'bg-primary text-white'
                                  : theme === 'dark'
                                    ? 'border-gray-600 text-gray-400 hover:bg-gray-700'
                                    : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                              }`}
                              onClick={() => {
                                if (!formData.tags.includes(tag.name)) {
                                  setFormData(prev => ({
                                    ...prev,
                                    tags: [...prev.tags, tag.name]
                                  }));
                                }
                              }}
                            >
                              {tag.name} ({tag.articleCount})
                            </Badge>
                          ))}
                          {availableTags.length > 10 && (
                            <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                              +{availableTags.length - 10} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className={`p-3 rounded-md ${theme === 'dark' ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'}`}>
                    <p className={`text-sm font-medium ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
                      This article will be saved as a draft
                    </p>
                    <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                      You can publish it later from the drafts list.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SEO Settings */}
            <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
              <CardHeader>
                <CardTitle className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="metaTitle" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Meta Title
                  </label>
                  <Input
                    id="metaTitle"
                    value={formData.metaTitle}
                    onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                    placeholder="SEO title (optional)"
                    className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="metaDescription" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Meta Description
                  </label>
                  <Textarea
                    id="metaDescription"
                    value={formData.metaDescription}
                    onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                    placeholder="SEO description (optional)"
                    rows={3}
                    className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostArticlePage;