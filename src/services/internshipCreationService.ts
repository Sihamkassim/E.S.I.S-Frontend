import { api } from './api';

export interface InternshipPosition {
  id: number;
  title: string;
  description: string;
  department: string;
  location: string;
  requirements: string;
  responsibilities: string;
  startDate?: string;
  endDate?: string;
  isRemote: boolean;
  isPaid: boolean;
  stipendAmount?: number;
  maxApplicants?: number;
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
  applications?: Array<{
    id: number;
    status: string;
  }>;
}

export interface InternshipListResponse {
  data: InternshipPosition[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface CreateInternshipData {
  title: string;
  description: string;
  department: string;
  location: string;
  requirements: string;
  responsibilities: string;
  startDate?: string;
  endDate?: string;
  isRemote: boolean;
  isPaid: boolean;
  stipendAmount?: number;
  maxApplicants?: number;
  status?: 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';
}

export interface UpdateInternshipData {
  title?: string;
  description?: string;
  department?: string;
  location?: string;
  requirements?: string;
  responsibilities?: string;
  startDate?: string;
  endDate?: string;
  isRemote?: boolean;
  isPaid?: boolean;
  stipendAmount?: number;
  maxApplicants?: number;
  status?: 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';
}

export interface InternshipFilters {
  status?: string;
  department?: string;
  location?: string;
  page?: number;
  limit?: number;
}

// Helper function to transform internship data
const transformInternship = (internship: any): InternshipPosition => ({
  ...internship,
  startDate: internship.startDate ? new Date(internship.startDate).toISOString() : undefined,
  endDate: internship.endDate ? new Date(internship.endDate).toISOString() : undefined,
  createdAt: new Date(internship.createdAt).toISOString(),
  updatedAt: new Date(internship.updatedAt).toISOString(),
});

// Helper function to transform internship list
const transformInternshipList = (internships: any[]): InternshipPosition[] => 
  internships.map(internship => transformInternship(internship));

export const internshipCreationService = {
  // Public endpoints
  getInternships: async (filters: InternshipFilters = {}): Promise<InternshipPosition[]> => {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.department) params.append('department', filters.department);
    if (filters.location) params.append('location', filters.location);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await api.get<InternshipPosition[]>(`/public/internship-positions?${params.toString()}`);
    return transformInternshipList(response.data);
  },

  getInternshipById: async (id: number): Promise<InternshipPosition> => {
    const response = await api.get<InternshipPosition>(`/public/internship-positions/${id}`);
    return transformInternship(response.data);
  },

  // Admin endpoints
  createInternship: async (data: CreateInternshipData): Promise<InternshipPosition> => {
    const response = await api.post<InternshipPosition>('/admin/internship-positions', data);
    return transformInternship(response.data);
  },

  updateInternship: async (id: number, data: UpdateInternshipData): Promise<InternshipPosition> => {
    const response = await api.patch<InternshipPosition>(`/admin/internship-positions/${id}`, data);
    return transformInternship(response.data);
  },

  publishInternship: async (id: number): Promise<InternshipPosition> => {
    const response = await api.post<InternshipPosition>(`/admin/internship-positions/${id}/publish`);
    return transformInternship(response.data);
  },

  closeInternship: async (id: number): Promise<InternshipPosition> => {
    const response = await api.post<InternshipPosition>(`/admin/internship-positions/${id}/close`);
    return transformInternship(response.data);
  },

  deleteInternship: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/admin/internship-positions/${id}`);
    return response.data;
  },

  // Admin-only internship list with all statuses
   getAdminInternships: async (filters: InternshipFilters = {}): Promise<InternshipListResponse> => {
    try {
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.department) params.append('department', filters.department);
      if (filters.location) params.append('location', filters.location);
      if (filters.page) params.append('page', filters.page?.toString() || '1');
      if (filters.limit) params.append('limit', filters.limit?.toString() || '10');

      const response = await api.get<any>(`/admin/internship-positions?${params.toString()}`);
      
      // Add defensive checks for the response structure
      if (!response.data) {
        console.warn('No data in API response');
        return {
          data: [],
          meta: {
            total: 0,
            page: filters.page || 1,
            limit: filters.limit || 10,
            pages: 0
          }
        };
      }

      // Handle different possible response structures
      let internshipsData: any[] = [];
      let metaData = {
        total: 0,
        page: filters.page || 1,
        limit: filters.limit || 10,
        pages: 0
      };

      // Case 1: Standard structure with data and meta
      if (response.data.data && Array.isArray(response.data.data)) {
        internshipsData = response.data.data;
        metaData = {
          total: response.data.meta?.total || 0,
          page: response.data.meta?.page || filters.page || 1,
          limit: response.data.meta?.limit || filters.limit || 10,
          pages: response.data.meta?.pages || 0
        };
      } 
      // Case 2: Direct array response
      else if (Array.isArray(response.data)) {
        internshipsData = response.data;
        metaData = {
          total: response.data.length,
          page: filters.page || 1,
          limit: filters.limit || 10,
          pages: Math.ceil(response.data.length / (filters.limit || 10))
        };
      }
      // Case 3: Object with different structure
      else if (typeof response.data === 'object') {
        // Try to find an array in the response
        const arrayKey = Object.keys(response.data).find(key => Array.isArray(response.data[key]));
        if (arrayKey) {
          internshipsData = response.data[arrayKey];
          metaData = {
            total: response.data.total || response.data.count || internshipsData.length,
            page: response.data.page || filters.page || 1,
            limit: response.data.limit || filters.limit || 10,
            pages: response.data.pages || Math.ceil((response.data.total || internshipsData.length) / (filters.limit || 10))
          };
        }
      }

      console.log('API Response:', response.data); // Debug log
      console.log('Transformed internships:', internshipsData); // Debug log
      console.log('Meta data:', metaData); // Debug log

      return {
        data: transformInternshipList(internshipsData),
        meta: metaData
      };
      
    } catch (error) {
      console.error('Error in getAdminInternships:', error);
      // Return empty response on error
      return {
        data: [],
        meta: {
          total: 0,
          page: filters.page || 1,
          limit: filters.limit || 10,
          pages: 0
        }
      };
    }
  },

  // Get internship with applications (admin only)
  getInternshipWithApplications: async (id: number): Promise<InternshipPosition> => {
    const response = await api.get<InternshipPosition>(`/admin/internship-positions/${id}/applications`);
    return transformInternship(response.data);
  },
};

export default internshipCreationService;