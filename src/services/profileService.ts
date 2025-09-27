// services/profileService.ts
import { api } from './api';

export interface Profile {
  id: string;
  userId: string;
  name: string;
  education?: string;
  phone?: string;
  avatarUrl?: string;
  resumeUrl?: string;
  skills?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProfileData {
  name: string;
  education?: string;
  phone?: string;
  resumeUrl?: string;
  skills?: string[];
}

export interface UpdateProfileData {
  name?: string;
  education?: string;
  phone?: string;
  resumeUrl?: string;
  skills?: string[];
}

export interface ProfileResponse {
  message: string;
  profile: Profile;
}

export interface ValidationError {
  code: string;
  format?: string;
  path: string[];
  message: string;
}

export interface ApiErrorResponse {
  message: string;
  error: string | ValidationError[];
}

// URL validation
const isValidUrl = (url: string): boolean => {
  if (!url.trim()) return true; // Empty is valid (optional field)
  
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
};

// Format skills array properly for FormData
const formatSkills = (skills?: string[]): string[] => {
  if (!skills) return [];
  return skills
    .filter(skill => skill.trim() !== '')
    .map(skill => skill.trim());
};

// Transform database url to api url
const transformAvatarUrl = (avatarUrl: string | undefined): string => {
  if (!avatarUrl) return '';
  
  if (avatarUrl.startsWith('http')) return avatarUrl;
  
  if (avatarUrl.startsWith('/uploads/')) {
    return `http://localhost:3000${avatarUrl}`;
  }
  
  return avatarUrl;
};

export const profileService = {
  upsertProfile: async (data: CreateProfileData | UpdateProfileData, avatarFile?: File): Promise<ProfileResponse> => {
    // Validate required fields
    if (!data.name?.trim()) {
      throw new Error('Name is required');
    }

    // Validate resume URL format
    if (data.resumeUrl && data.resumeUrl.trim() !== '' && !isValidUrl(data.resumeUrl)) {
      throw new Error('Please enter a valid URL for your resume (e.g., https://example.com/resume.pdf)');
    }

    const formData = new FormData();
    
    // Append basic fields
    if (data.name) formData.append('name', data.name.trim());
    if (data.education) formData.append('education', data.education.trim());
    if (data.phone) formData.append('phone', data.phone.trim());
    if (data.resumeUrl) formData.append('resumeUrl', data.resumeUrl.trim());

    // Append skills as individual array entries
    const formattedSkills = formatSkills(data.skills);
    formattedSkills.forEach(skill => {
      formData.append('skills[]', skill);
    });

    if (avatarFile) {
      // Validate avatar file type and size
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(avatarFile.type)) {
        throw new Error('Please upload a valid image file (JPG, PNG, or GIF)');
      }

      if (avatarFile.size > maxSize) {
        throw new Error('Image size must be less than 5MB');
      }

      formData.append('avatar', avatarFile);
    }

    try {
      const response = await api.post<ProfileResponse>('/user/set-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      // Handle validation errors from server
      if (error.response?.data?.error) {
        const serverError = error.response.data.error;
        
        if (typeof serverError === 'string') {
          try {
            const parsedError = JSON.parse(serverError) as ValidationError[];
            if (Array.isArray(parsedError)) {
              const validationMessages = parsedError.map(err => 
                `${err.path.join('.')}: ${err.message}`
              ).join(', ');
              throw new Error(`Validation failed: ${validationMessages}`);
            }
          } catch {
            // If parsing fails, use the original error message
            throw new Error(serverError || 'Server validation error');
          }
        }
      }
      
      throw new Error(error.response?.data?.message || error.message || 'Failed to update profile');
    }
  },

  // Get user profile
  getProfile: async (): Promise<Profile | null> => {
    try {
      const response = await api.get<Profile>('/user/get-profile');
      if (response.data) {
        return {
          ...response.data,
          avatarUrl: transformAvatarUrl(response.data.avatarUrl),
        }
      }
      return null;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch profile');
    }
  },
};