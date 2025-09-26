import { api } from './api';

export interface User {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  profile?: {
    name: string;
    avatarUrl?: string;
  };
}

export interface UsersResponse {
  status: boolean;
  data: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  name?: string;
  isActive?: boolean;
}

export interface ChangeRoleData {
  role: string;
}

export interface UserResponse {
  status: boolean;
  message: string;
  data?: User;
}

export const userService = {
  getAllUsers: async (params: UserQueryParams = {}): Promise<UsersResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.name) queryParams.append('name', params.name);
    if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
    
    const queryString = queryParams.toString();
    const url = `/admin/get-user${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get<UsersResponse>(url);
    return response.data;
  },

  deactivateUser: async (id: string): Promise<UserResponse> => {
    const response = await api.patch<UserResponse>(`/admin/remove-user/${id}`);
    return response.data;
  },

  changeUserRole: async (id: string, role: string): Promise<UserResponse> => {
    const response = await api.patch<UserResponse>(`/admin/change-user-role/${id}`, { role });
    return response.data;
  },
};

export default userService;