// This service maps the backend internship endpoints.
// Backend user routes reference (see Server/src/routes/userRoute.ts):
// - GET /internship-positions (public)
// - GET /internship-positions/:id (public)
// - GET /internship-applications/me (auth)
// - POST /internship-applications { internshipId? } -> creates Draft
// - PATCH /internship-applications/:id -> update Draft fields
// - POST /internship-applications/:id/submit -> finalize Draft (status -> Submitted)
// - GET /internship-applications/:id/status -> light status fetch
// NOTE: Some JSON fields (personal, education) are stored as stringified JSON in backend; handled in ApplicationForm.
// If backend introduces more statuses (InReview, Interview ...), they will appear as raw strings and still be displayed.
import { api } from "./api";

// Backend enums inferred
export type InternshipStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';
export type ApplicationStatus = 'Draft' | 'Submitted' | 'InReview' | 'Interview' | 'Accepted' | 'Rejected'; // extend when backend adds

export interface InternshipPosition {
  id: number;
  title: string;
  description?: string;
  department?: string;
  location?: string;
  requirements?: string; // stored as text
  responsibilities?: string;
  startDate?: string | null;
  endDate?: string | null;
  isRemote: boolean;
  isPaid: boolean;
  stipendAmount?: number | null;
  maxApplicants?: number | null;
  status: InternshipStatus;
  createdAt: string;
  updatedAt: string;
  // derived helper (frontend only)
  applicationsCount?: number;
}

export interface InternshipApplication {
  id: number;
  userId: number;
  internshipId?: number | null;
  resume?: string | null;
  skills?: string | null; // backend keeps as string
  motivation?: string | null;
  status: ApplicationStatus | string; // keep string fallback
  score?: number | null;
  notes?: string | null;
  education?: string | null; // JSON string
  personal?: string | null;  // JSON string
  availability?: string | null;
  createdAt: string;
  internship?: Pick<InternshipPosition, 'id' | 'title' | 'department' | 'location' | 'startDate' | 'endDate' | 'isRemote' | 'isPaid'>;
}

// Payloads
export interface DraftApplicationCreatePayload { internshipId?: number; }
export interface ApplicationUpdatePayload {
  personal?: any; // will be stringified in backend
  education?: any;
  skills?: string; // plain string or comma list
  availability?: string;
  resume_url?: string;
  motivation?: string;
}

export const internshipService = {
  // Public: list published internship positions
  getPositions: async (): Promise<InternshipPosition[]> => {
    const res = await api.get('/public/internship-positions');
    return res.data;
  },

  getPositionById: async (id: number): Promise<InternshipPosition & { applications: { id: number; status: string }[] }> => {
    const res = await api.get(`/public/internship-positions/${id}`);
    return res.data;
  },

  // Applications for current user
  getMyApplications: async (): Promise<InternshipApplication[]> => {
    const res = await api.get('/user/internship-applications/me');
    return res.data;
  },

  createDraft: async (payload: DraftApplicationCreatePayload): Promise<InternshipApplication> => {
    const res = await api.post('/user/internship-applications', payload);
    return res.data;
  },

  updateApplication: async (id: number, payload: ApplicationUpdatePayload): Promise<InternshipApplication> => {
    const res = await api.patch(`/user/internship-applications/${id}`, payload);
    return res.data;
  },

  submitApplication: async (id: number): Promise<InternshipApplication> => {
    const res = await api.post(`/user/internship-applications/${id}/submit`);
    return res.data;
  },

  getApplicationStatus: async (id: number): Promise<{ id: number; status: string; createdAt: string; }> => {
    const res = await api.get(`/user/internship-applications/${id}/status`);
    return res.data;
  },

  // Convenience: fetch positions + my applications and mark linked
  getPositionsWithMyApps: async () => {
    const [positions, apps] = await Promise.all([
      internshipService.getPositions(),
      internshipService.getMyApplications().catch(()=>[]) // swallow if unauthorized
    ]);
    return { positions, apps };
  }
};