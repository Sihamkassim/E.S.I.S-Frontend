import { create } from 'zustand';
import { ApplicationUpdatePayload, DraftApplicationCreatePayload, InternshipApplication, InternshipPosition, internshipService } from '../services/internshipService';

interface InternshipState {
  positions: InternshipPosition[];
  applications: InternshipApplication[];
  loadingPositions: boolean;
  loadingApplications: boolean;
  error?: string;
  fetchPositions: () => Promise<void>;
  fetchApplications: () => Promise<void>;
  createDraft: (payload: DraftApplicationCreatePayload) => Promise<InternshipApplication | undefined>;
  updateApplication: (id: number, payload: ApplicationUpdatePayload) => Promise<InternshipApplication | undefined>;
  submitApplication: (id: number) => Promise<InternshipApplication | undefined>;
}

export const useInternshipStore = create<InternshipState>((set, get) => ({
  positions: [],
  applications: [],
  loadingPositions: false,
  loadingApplications: false,
  error: undefined,
  fetchPositions: async () => {
    set({ loadingPositions: true, error: undefined });
    try {
      const data = await internshipService.getPositions();
      set({ positions: data, loadingPositions: false });
    } catch (e: any) {
      const message = e?.response?.status === 404 ? 'No internship positions found.' : (e.message || 'Failed to load positions');
      set({ error: message, loadingPositions: false });
    }
  },
  fetchApplications: async () => {
    set({ loadingApplications: true, error: undefined });
    try {
      const data = await internshipService.getMyApplications();
      set({ applications: data, loadingApplications: false });
    } catch (e: any) {
      const message = e?.response?.status === 404 ? 'No applications yet.' : (e.message || 'Failed to load applications');
      set({ error: message, loadingApplications: false });
    }
  },
  createDraft: async (payload) => {
    try {
      const draft = await internshipService.createDraft(payload);
      set({ applications: [draft, ...get().applications] });
      return draft;
    } catch (e: any) {
      set({ error: e.message || 'Failed to create draft' });
    }
  },
  updateApplication: async (id, payload) => {
    try {
      const updated = await internshipService.updateApplication(id, payload);
      set({ applications: get().applications.map(a => a.id === id ? updated : a) });
      return updated;
    } catch (e: any) {
      set({ error: e.message || 'Failed to update application' });
    }
  },
  submitApplication: async (id) => {
    try {
      const submitted = await internshipService.submitApplication(id);
      set({ applications: get().applications.map(a => a.id === id ? submitted : a) });
      return submitted;
    } catch (e: any) {
      set({ error: e.message || 'Failed to submit application' });
    }
  }
}));
