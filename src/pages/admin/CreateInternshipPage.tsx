import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import internshipCreationService, { InternshipPosition, CreateInternshipData, UpdateInternshipData } from '../../services/internshipCreationService';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Loader2, ArrowLeft, Save, Building, MapPin, Calendar, DollarSign, Users } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const CreateInternshipPage = () => {
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
    description: '',
    department: '',
    location: '',
    requirements: '',
    responsibilities: '',
    startDate: '',
    endDate: '',
    isRemote: false,
    isPaid: false,
    stipendAmount: '',
    maxApplicants: '',
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED',
  });

  const [originalInternship, setOriginalInternship] = useState<InternshipPosition | null>(null);

  // Fetch internship data if editing
  useEffect(() => {
    if (isEditing && id) {
      fetchInternship();
    }
  }, [id, isEditing]);

  const fetchInternship = async () => {
    try {
      setLoading(true);
      setError("");

      const internship = await internshipCreationService.getInternshipById(parseInt(id!));
      setOriginalInternship(internship);
      updateFormDataFromInternship(internship);

    } catch (err) {
      setError('Failed to load internship');
      console.error('Error fetching internship:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateFormDataFromInternship = (internship: InternshipPosition) => {
    setFormData({
      title: internship.title || "",
      description: internship.description || "",
      department: internship.department || "",
      location: internship.location || "",
      requirements: internship.requirements || "",
      responsibilities: internship.responsibilities || "",
      startDate: internship.startDate ? new Date(internship.startDate).toISOString().split('T')[0] : "",
      endDate: internship.endDate ? new Date(internship.endDate).toISOString().split('T')[0] : "",
      isRemote: internship.isRemote || false,
      isPaid: internship.isPaid || false,
      stipendAmount: internship.stipendAmount?.toString() || "",
      maxApplicants: internship.maxApplicants?.toString() || "",
      status: 'DRAFT', // Always set to DRAFT when loading
    });
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (error || success) {
      setError('');
      setSuccess('');
    }
  };

  const handleCheckboxChange = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev]
    }));
  };

  const handleSaveDraft = async () => {
    try {
      setSubmitting(true);
      setError('');

      // Validate required fields
      const requiredFields = ['title', 'description', 'department', 'location', 'requirements', 'responsibilities'];
      const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]?.toString().trim());

      if (missingFields.length > 0) {
        setError(`Missing required fields: ${missingFields.join(', ')}`);
        return;
      }

      // Validate dates
      if (formData.startDate && formData.endDate) {
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        if (end <= start) {
          setError('End date must be after start date');
          return;
        }
      }

      // Validate stipend amount if paid
      if (formData.isPaid && formData.stipendAmount) {
        const stipend = parseFloat(formData.stipendAmount);
        if (isNaN(stipend) || stipend < 0) {
          setError('Stipend amount must be a positive number');
          return;
        }
      }

      // Validate max applicants
      if (formData.maxApplicants) {
        const maxApps = parseInt(formData.maxApplicants);
        if (isNaN(maxApps) || maxApps < 1) {
          setError('Max applicants must be a positive number');
          return;
        }
      }

      const submitData: CreateInternshipData | UpdateInternshipData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        department: formData.department.trim(),
        location: formData.location.trim(),
        requirements: formData.requirements.trim(),
        responsibilities: formData.responsibilities.trim(),
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        isRemote: formData.isRemote,
        isPaid: formData.isPaid,
        stipendAmount: formData.stipendAmount ? parseFloat(formData.stipendAmount) : undefined,
        maxApplicants: formData.maxApplicants ? parseInt(formData.maxApplicants) : undefined,
        status: 'DRAFT', // Force DRAFT status
      };

      let result: InternshipPosition;

      if (isEditing && originalInternship) {
        result = await internshipCreationService.updateInternship(originalInternship.id, submitData as UpdateInternshipData);
        setSuccess('Draft saved successfully!');
        setOriginalInternship(result);
      } else {
        result = await internshipCreationService.createInternship(submitData as CreateInternshipData);
        setSuccess('Draft created successfully!');
        
        // Redirect to internships list
        setTimeout(() => {
          navigate("../../dashboard/admin-internships");
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
    if (!isEditing || !originalInternship) return true;
    
    return (
      formData.title !== originalInternship.title ||
      formData.description !== originalInternship.description ||
      formData.department !== originalInternship.department ||
      formData.location !== originalInternship.location ||
      formData.requirements !== originalInternship.requirements ||
      formData.responsibilities !== originalInternship.responsibilities ||
      formData.startDate !== (originalInternship.startDate ? new Date(originalInternship.startDate).toISOString().split('T')[0] : "") ||
      formData.endDate !== (originalInternship.endDate ? new Date(originalInternship.endDate).toISOString().split('T')[0] : "") ||
      formData.isRemote !== originalInternship.isRemote ||
      formData.isPaid !== originalInternship.isPaid ||
      formData.stipendAmount !== (originalInternship.stipendAmount?.toString() || "") ||
      formData.maxApplicants !== (originalInternship.maxApplicants?.toString() || "")
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            {isEditing ? 'Loading internship...' : 'Preparing form...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container max-w-4xl mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(-1)}
              className={theme === 'dark' ? 'border-gray-700 hover:bg-gray-800 text-white/80' : 'border-gray-300 hover:bg-gray-100'}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {isEditing ? 'Edit Internship Draft' : 'Create New Internship'}
              </h1>
              <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {isEditing ? 'Update your internship draft' : 'Create a new internship position'}
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

        {/* Internship Info (only for editing) */}
        {isEditing && originalInternship && (
          <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className={`font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Created:</span>
                  <span className={`ml-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {new Date(originalInternship.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className={`font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Last Updated:</span>
                  <span className={`ml-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {new Date(originalInternship.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className={`font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Applications:</span>
                  <span className={`ml-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {originalInternship.applications?.length || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-6">
          {/* Basic Information */}
          <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
            <CardHeader>
              <CardTitle className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Basic Information
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="title" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Position Title *
                  </label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Software Engineering Intern"
                    className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="department" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Department *
                  </label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => handleInputChange('department', value)}
                  >
                    <SelectTrigger className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Product">Product</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="HR">Human Resources</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Description *
                </label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the internship position, learning opportunities, and overall experience..."
                  rows={4}
                  className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="location" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location *
                    </div>
                  </label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., New York, NY or Remote"
                    className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="maxApplicants" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Max Applicants
                    </div>
                  </label>
                  <Input
                    id="maxApplicants"
                    type="number"
                    min="1"
                    value={formData.maxApplicants}
                    onChange={(e) => handleInputChange('maxApplicants', e.target.value)}
                    placeholder="Leave empty for unlimited"
                    className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dates & Location */}
          <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
            <CardHeader>
              <CardTitle className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Dates & Location
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="startDate" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Start Date
                  </label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="endDate" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    End Date
                  </label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <label htmlFor="isRemote" className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Remote Position
                  </label>
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    This internship can be done remotely
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="isRemote"
                  checked={formData.isRemote}
                  onChange={() => handleCheckboxChange('isRemote')}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Compensation */}
          <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
            <CardHeader>
              <CardTitle className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Compensation
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <label htmlFor="isPaid" className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Paid Internship
                  </label>
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    This internship offers financial compensation
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="isPaid"
                  checked={formData.isPaid}
                  onChange={() => handleCheckboxChange('isPaid')}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
              </div>

              {formData.isPaid && (
                <div className="space-y-2">
                  <label htmlFor="stipendAmount" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Stipend Amount (per month)
                  </label>
                  <Input
                    id="stipendAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.stipendAmount}
                    onChange={(e) => handleInputChange('stipendAmount', e.target.value)}
                    placeholder="e.g., 1500.00"
                    className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Requirements & Responsibilities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
              <CardHeader>
                <CardTitle className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <label htmlFor="requirements" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Required Skills & Qualifications *
                  </label>
                  <Textarea
                    id="requirements"
                    value={formData.requirements}
                    onChange={(e) => handleInputChange('requirements', e.target.value)}
                    placeholder="List the required skills, qualifications, and experience..."
                    rows={8}
                    className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}
                  />
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Use bullet points or separate with new lines
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
              <CardHeader>
                <CardTitle className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <label htmlFor="responsibilities" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Key Responsibilities *
                  </label>
                  <Textarea
                    id="responsibilities"
                    value={formData.responsibilities}
                    onChange={(e) => handleInputChange('responsibilities', e.target.value)}
                    placeholder="Describe the daily tasks and responsibilities..."
                    rows={8}
                    className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}
                  />
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Use bullet points or separate with new lines
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status Information */}
          <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
            <CardContent className="p-6">
              <div className={`p-4 rounded-md ${theme === 'dark' ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'}`}>
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
                  This internship will be saved as a draft
                </p>
                <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                  You can publish it later from the internships management page when you're ready to accept applications.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateInternshipPage;