import { create } from "zustand";
import { webinarService } from "../services/webinarServices";

// Define the interfaces
export interface Webinar {
  id: number | string;
  title: string;
  description?: string; 
  schedule: string;
  image?: string;
  capacity?: number;
  price?: number | null;
  location?: string;
  speaker?: string;
  duration?: number;
  status?: string;
  faq?: string | null;
  refundPolicy?: string | null;
  _count?: {
    tickets: number;
  };
  availableSpots?: number;
  isPublished?: boolean;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
  questions?: WebinarQuestion[];
}

export interface WebinarQuestion {
  id: string;
  question: string;
  type: 'text' | 'textarea' | 'multiple-choice' | 'checkbox' | 'radio' | 'select';
  options?: string[];
  webinarId: string;
  required?: boolean;
}

export interface WebinarApplication {
  user?: {
    email: string;
    profile?: {
      avatar?: string;
      firstName?: string;
      lastName?: string;
    }
  };
  id: string;
  webinarId: string;
  userId: string;
  status: string;
  answers?: Record<string, string | string[]>;
  createdAt?: string;
}

export interface Ticket {
  webinar: Webinar;
  code: string;
  webinarId: string;
  userId: string;
  createdAt: string;
}

// Zustand store state
interface WebinarState {
  upcomingWebinars: Webinar[];
  adminWebinars: Webinar[];
  webinarApplications: WebinarApplication[];
  userTickets: Ticket[];
  selectedWebinar?: Webinar;
  webinarApplicants: WebinarApplication[];
  loading: boolean;
  error?: string;

  // Actions
  fetchUpcomingWebinars: () => Promise<void>;
  fetchAdminWebinars: () => Promise<void>;
  fetchWebinarApplications: () => Promise<void>;
  fetchApplicantsForWebinar: (webinarId: string) => Promise<void>;
  fetchUserTickets: () => Promise<void>;
  fetchWebinarById: (id: string) => Promise<void>;
  applyForWebinar: (webinarId: string, answers: Record<string, string | string[]>) => Promise<void>;
  publishWebinar: (webinarId: string) => Promise<void>;
  unpublishWebinar: (webinarId: string) => Promise<void>;
  createWebinar: (formData: FormData) => Promise<Webinar>;
  updateWebinar: (webinarId: string, formData: FormData) => Promise<Webinar>;
  approveApplication: (applicationId: string) => Promise<void>;
  rejectApplication: (applicationId: string) => Promise<void>;
  clearApplicants: () => void;
}

// Store implementation with persistence
export const useWebinarStore = create<WebinarState>((set, get) => ({
  upcomingWebinars: [],
  adminWebinars: [],
  webinarApplications: [],
  userTickets: [],
  selectedWebinar: undefined,
  webinarApplicants: [],
  loading: false,
  error: undefined,

  fetchUpcomingWebinars: async () => {
    set({ loading: true, error: undefined });
    try {
      const webinars: Webinar[] = await webinarService.getUpcomingWebinars();
      if (!Array.isArray(webinars)) {
        throw new Error('Invalid response format: expected an array of webinars');
      }
      set({ upcomingWebinars: webinars });
    } catch (err: unknown) {
      set({ error: (err as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  fetchAdminWebinars: async () => {
    set({ loading: true, error: undefined });
    try {
      const webinars: Webinar[] = await webinarService.getAdminWebinars();
      set({ adminWebinars: webinars });
    } catch (err: unknown) {
      set({ error: (err as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  fetchApplicantsForWebinar: async (webinarId: string) => {
    // No longer sets global loading state
    try {
      const applications: WebinarApplication[] = await webinarService.getWebinarApplications(webinarId);
      set({ webinarApplicants: applications, error: undefined });
    } catch (err: unknown) {
      set({ error: (err as Error).message });
    }
  },

  fetchWebinarApplications: async () => {
    set({ loading: true, error: undefined });
    try {
      const applications: WebinarApplication[] = await webinarService.getWebinarApplications();
      set({ webinarApplications: applications });
    } catch (err: unknown) {
      set({ error: (err as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  fetchUserTickets: async () => {
    set({ loading: true, error: undefined });
    try {
      const tickets: Ticket[] = await webinarService.getUserTickets();
      set({ userTickets: tickets });
    } catch (err: unknown) {
      set({ error: (err as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  fetchWebinarById: async (id: string) => {
    set({ loading: true, error: undefined });
    try {
      const webinar: Webinar = await webinarService.getWebinarById(id);
      set({ selectedWebinar: webinar });
    } catch (err: unknown) {
      set({ error: (err as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  applyForWebinar: async (webinarId: string, answers: Record<string, string | string[]>) => {
    set({ loading: true, error: undefined });
    try {
      await webinarService.applyForWebinar(webinarId, answers);
    } catch (err: unknown) {
      set({ error: (err as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  updateWebinar: async (webinarId: string, formData: FormData) => {
    set({ loading: true, error: undefined });
    try {
      const updatedWebinar = await webinarService.updateWebinar(webinarId, formData);
      set((state) => {
        const newAdminWebinars = state.adminWebinars.map((w) =>
          w.id.toString() === webinarId ? { ...w, ...updatedWebinar } : w
        );
        return { adminWebinars: newAdminWebinars };
      });
      return updatedWebinar;
    } catch (err: unknown) {
      set({ error: (err as Error).message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  createWebinar: async (formData: FormData) => {
    set({ loading: true, error: undefined });
    try {
      const newWebinar = await webinarService.createWebinar(formData);
      set((state) => ({
        adminWebinars: [...state.adminWebinars, newWebinar],
      }));
      return newWebinar;
    } catch (err: unknown) {
      set({ error: (err as Error).message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  clearApplicants: () => {
    set({ webinarApplicants: [] });
  },

  publishWebinar: async (webinarId: string) => {
    set({ loading: true, error: undefined });
    try {
      await webinarService.publishWebinar(webinarId, true);
      const currentWebinars = get().adminWebinars;
      const updatedWebinars = currentWebinars.map(w => 
        w.id.toString() === webinarId ? { ...w, isPublished: true } : w
      );
      set({ adminWebinars: updatedWebinars });
    } catch (err: unknown) {
      set({ error: (err as Error).message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  unpublishWebinar: async (webinarId: string) => {
    set({ loading: true, error: undefined });
    try {
      await webinarService.publishWebinar(webinarId, false);
      const currentWebinars = get().adminWebinars;
      const updatedWebinars = currentWebinars.map(w => 
        w.id.toString() === webinarId ? { ...w, isPublished: false } : w
      );
      set({ adminWebinars: updatedWebinars });
    } catch (err: unknown) {
      set({ error: (err as Error).message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  approveApplication: async (applicationId: string) => {
    set({ loading: true, error: undefined });
    try {
      await webinarService.approveApplication(applicationId);
      set((state) => ({
        webinarApplicants: state.webinarApplicants.map((app) =>
          app.id === applicationId ? { ...app, status: 'Approved' } : app
        ),
      }));
    } catch (err: unknown) {
      set({ error: (err as Error).message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  rejectApplication: async (applicationId: string) => {
    set({ loading: true, error: undefined });
    try {
      await webinarService.rejectApplication(applicationId);
      set((state) => ({
        webinarApplicants: state.webinarApplicants.map((app) =>
          app.id === applicationId ? { ...app, status: 'Rejected' } : app
        ),
      }));
    } catch (err: unknown) {
      set({ error: (err as Error).message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));