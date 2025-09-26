// pages/AccountSettingsPage.tsx
import { Loader2, Camera, Save, Trash2, Edit, X, UserPlus, ExternalLink } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { Profile, profileService, UpdateProfileData } from '../../services/profileService';

const AccountSettingsPage: React.FC = () => {
  const { theme } = useTheme();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Form state
  const [formData, setFormData] = useState<UpdateProfileData>({
    name: '',
    education: '',
    phone: '',
    resumeUrl: '',
    skills: [],
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [skillsInput, setSkillsInput] = useState<string>('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const profileData = await profileService.getProfile();
      setProfile(profileData);
      
      if (profileData) {
        // if profile exists fill form with existing data
        setFormData({
          name: profileData.name || '',
          education: profileData.education || '',
          phone: profileData.phone || '',
          resumeUrl: profileData.resumeUrl || '',
          skills: profileData.skills || [],
        });
        setSkillsInput(profileData.skills?.join(', ') || '');
        if (profileData.avatarUrl?.startsWith('http')) {
          setAvatarPreview(profileData.avatarUrl);
        }
        setIsCreating(false);
      } else {
        // If profile doesn't exist set up empty form for creation
        resetForm();
        setIsCreating(true);
        setIsEditing(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      education: '',
      phone: '',
      resumeUrl: '',
      skills: [],
    });
    setSkillsInput('');
    setAvatarPreview('');
    setAvatarFile(null);
    setFormErrors({});
  };

  // URL validation function
  const isValidUrl = (url: string): boolean => {
    if (!url) return false;
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  // Form validation function
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Required fields validation
    if (!formData.name?.trim()) {
      errors.name = 'Full name is required';
    }

    if (!formData.education?.trim()) {
      errors.education = 'Education is required';
    }

    if (!formData.phone?.trim()) {
      errors.phone = 'Phone number is required';
    }

    if (!formData.resumeUrl?.trim()) {
      errors.resumeUrl = 'Resume URL is required';
    } else if (!isValidUrl(formData.resumeUrl)) {
      errors.resumeUrl = 'Please enter a valid URL (http:// or https://)';
    }

    if (!skillsInput.trim() || (formData.skills?.length ?? 0) === 0) {
      errors.skills = 'At least one skill is required';
    }

    // Avatar validation (only required when creating new profile)
    if (isCreating && !avatarFile && !avatarPreview) {
      errors.avatar = 'Profile picture is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSkillsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSkillsInput(value);
    
    // Update skills array in form data
    const skillsArray = value.split(',')
      .map(skill => skill.trim())
      .filter(skill => skill);
    
    setFormData(prev => ({
      ...prev,
      skills: skillsArray,
    }));

    // Clear error when user starts typing
    if (formErrors.skills) {
      setFormErrors(prev => ({
        ...prev,
        skills: '',
      }));
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic client-side validation
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setFormErrors(prev => ({
          ...prev,
          avatar: 'Please select a valid image file (JPG, PNG, or GIF)'
        }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setFormErrors(prev => ({
          ...prev,
          avatar: 'Image size must be less than 5MB'
        }));
        return;
      }

      setAvatarFile(file);
      setFormErrors(prev => ({
        ...prev,
        avatar: '',
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(profile?.avatarUrl || '');
    if (isCreating) {
      setFormErrors(prev => ({
        ...prev,
        avatar: 'Profile picture is required',
      }));
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    setIsEditing(true);
    setError(null);
    setSuccess(null);
    setFormErrors({});
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
    setSuccess(null);
    setFormErrors({});
  };

  const handleCancel = () => {
    if (profile) {
      // Reset to original profile values
      setFormData({
        name: profile.name || '',
        education: profile.education || '',
        phone: profile.phone || '',
        resumeUrl: profile.resumeUrl || '',
        skills: profile.skills || [],
      });
      setSkillsInput(profile.skills?.join(', ') || '');
      setAvatarPreview(profile.avatarUrl || '');
      setIsEditing(false);
    } else {
      // Cancel creation
      resetForm();
      setIsCreating(false);
      setIsEditing(false);
    }
    setAvatarFile(null);
    setError(null);
    setSuccess(null);
    setFormErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      setError('Please fix the errors in the form before submitting.');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response = await profileService.upsertProfile(formData, avatarFile || undefined);
      setProfile(response.profile);
      setSuccess(isCreating ? 'Profile created successfully!' : 'Profile updated successfully!');
      setIsCreating(false);
      setIsEditing(false);
      setAvatarFile(null);
      setFormErrors({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveResume = () => {
    setFormData(prev => ({
      ...prev,
      resumeUrl: '',
    }));
    setFormErrors(prev => ({
      ...prev,
      resumeUrl: 'Resume URL is required',
    }));
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className={`text-2xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Account Settings
          </h1>
          <p className={`mt-1 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {profile ? 'Manage your profile information' : 'Create your profile to get started'}
          </p>
        </div>
        
        {!isEditing ? (
          profile ? (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium transition-colors"
            >
              <Edit size={18} />
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium transition-colors"
            >
              <UserPlus size={18} />
              Create Profile
            </button>
          )
        ) : (
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={18} />
            Cancel
          </button>
        )}
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className={`p-4 rounded-lg ${
          theme === 'dark' ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-800'
        }`}>
          {success}
        </div>
      )}
      
      {error && (
        <div className={`p-4 rounded-lg ${
          theme === 'dark' ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-800'
        }`}>
          {error}
        </div>
      )}

      {/* Profile Form/View */}
      {(!profile && !isCreating) ? (
        // Empty state
        <div className={`p-8 rounded-lg text-center ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white border border-gray-200'
        }`}>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <UserPlus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className={`text-lg font-medium mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            No Profile Found
          </h3>
          <p className={`mb-6 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Create your profile to showcase your skills and experience.
          </p>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium transition-colors mx-auto"
          >
            <UserPlus size={18} />
            Create Your Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Section */}
          <div className={`p-6 rounded-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white border border-gray-200'
          }`}>
            <h2 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Profile Picture *
            </h2>
            
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600">
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                {isEditing && avatarPreview && (
                  <button
                    type="button"
                    onClick={removeAvatar}
                    className="absolute -top-1 -right-1 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
              
              {isEditing ? (
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    id="avatar-upload"
                    required={isCreating}
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Camera size={18} />
                    {avatarPreview ? 'Change Avatar' : 'Upload Avatar'}
                  </label>
                  <p className={`mt-2 text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    JPG, PNG or GIF. Max size 5MB.
                  </p>
                  {formErrors.avatar && (
                    <p className={`mt-1 text-sm ${
                      theme === 'dark' ? 'text-red-400' : 'text-red-600'
                    }`}>
                      {formErrors.avatar}
                    </p>
                  )}
                </div>
              ) : (
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {profile?.avatarUrl ? 'Profile picture uploaded' : 'No profile picture'}
                </p>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className={`p-6 rounded-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white border border-gray-200'
          }`}>
            <h2 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Full Name *
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-primary ${
                        formErrors.name ? 'border-red-500' : ''
                      }`}
                      placeholder="Enter your full name"
                    />
                    {formErrors.name && (
                      <p className={`mt-1 text-sm ${
                        theme === 'dark' ? 'text-red-400' : 'text-red-600'
                      }`}>
                        {formErrors.name}
                      </p>
                    )}
                  </>
                ) : (
                  <p className={`px-4 py-2 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'
                  }`}>
                    {profile?.name || 'Not provided'}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="education" className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Education *
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      id="education"
                      name="education"
                      required
                      value={formData.education || ''}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-primary ${
                        formErrors.education ? 'border-red-500' : ''
                      }`}
                      placeholder="Your education background"
                    />
                    {formErrors.education && (
                      <p className={`mt-1 text-sm ${
                        theme === 'dark' ? 'text-red-400' : 'text-red-600'
                      }`}>
                        {formErrors.education}
                      </p>
                    )}
                  </>
                ) : (
                  <p className={`px-4 py-2 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'
                  }`}>
                    {profile?.education || 'Not provided'}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="phone" className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Phone Number *
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone || ''}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-primary ${
                        formErrors.phone ? 'border-red-500' : ''
                      }`}
                      placeholder="Your phone number"
                    />
                    {formErrors.phone && (
                      <p className={`mt-1 text-sm ${
                        theme === 'dark' ? 'text-red-400' : 'text-red-600'
                      }`}>
                        {formErrors.phone}
                      </p>
                    )}
                  </>
                ) : (
                  <p className={`px-4 py-2 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'
                  }`}>
                    {profile?.phone || 'Not provided'}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="skills" className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Skills *
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      id="skills"
                      required
                      value={skillsInput}
                      onChange={handleSkillsInputChange}
                      placeholder="JavaScript, React, TypeScript"
                      className={`w-full px-4 py-2 rounded-lg border ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-primary ${
                        formErrors.skills ? 'border-red-500' : ''
                      }`}
                    />
                    {formErrors.skills && (
                      <p className={`mt-1 text-sm ${
                        theme === 'dark' ? 'text-red-400' : 'text-red-600'
                      }`}>
                        {formErrors.skills}
                      </p>
                    )}
                  </>
                ) : (
                  <p className={`px-4 py-2 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'
                  }`}>
                    {profile?.skills?.length ? profile.skills.join(', ') : 'Not provided'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Resume Section */}
          <div className={`p-6 rounded-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white border border-gray-200'
          }`}>
            <h2 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Resume
            </h2>
            
            <div>
              <label htmlFor="resumeUrl" className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Resume URL *
              </label>
              {isEditing ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      id="resumeUrl"
                      name="resumeUrl"
                      required
                      value={formData.resumeUrl || ''}
                      onChange={handleInputChange}
                      placeholder="https://drive.google.com/your-resume.pdf"
                      className={`flex-1 px-4 py-2 rounded-lg border ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-primary ${
                        formErrors.resumeUrl ? 'border-red-500' : ''
                      }`}
                    />
                    {formData.resumeUrl && (
                      <button
                        type="button"
                        onClick={handleRemoveResume}
                        className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                        title="Remove resume URL"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                  {formErrors.resumeUrl ? (
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-red-400' : 'text-red-600'
                    }`}>
                      {formErrors.resumeUrl}
                    </p>
                  ) : (
                    <p className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Enter a valid URL (http:// or https://)
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  {profile?.resumeUrl ? (
                    <a 
                      href={profile.resumeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      <ExternalLink size={16} />
                      View Resume
                    </a>
                  ) : (
                    <p className={`px-4 py-2 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-50 text-gray-600'
                    }`}>
                      No resume URL provided
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          {isEditing && (
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    {isCreating ? 'Creating...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    {isCreating ? 'Create Profile' : 'Save Changes'}
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default AccountSettingsPage;