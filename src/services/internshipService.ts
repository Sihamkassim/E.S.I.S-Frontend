import { api } from "./api";

export interface Internship {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  location: string;
  type: 'FULL_TIME' | 'PART_TIME' | 'REMOTE';
  duration: string;
  stipend: number;
  deadline: string;
  status: 'OPEN' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
}

export interface InternshipApplication {
  id: string;
  internshipId: string;
  userId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  resumeUrl: string;
  coverLetter: string;
  createdAt: string;
}

export const internshipService = {
  // Get all available internships
  getInternships: async (): Promise<Internship[]> => {
    const res = await api.get('/internships');
    return res.data;
  },

  // Get user's applied internships
  getUserApplications: async (): Promise<InternshipApplication[]> => {
    const res = await api.get('/internships/applications');
    return res.data;
  },

  // Apply for an internship
  applyForInternship: async (
    internshipId: string, 
    data: { resumeUrl: string; coverLetter: string }
  ): Promise<InternshipApplication> => {
    const res = await api.post(`/internships/${internshipId}/apply`, data);
    return res.data;
  },

  // Get internship details
  getInternshipById: async (id: string): Promise<Internship> => {
    const res = await api.get(`/internships/${id}`);
    return res.data;
  }
};