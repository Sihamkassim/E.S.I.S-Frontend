import { create } from "zustand";
import { webinarService } from "../services/webinarServices";

// Define the interfaces
export interface Webinar {
  id: number | string;
  title: string;
  description?: string | null; 
  schedule: string;
  image?: string | null;
  capacity?: number | null;
  price?: number | null;
  location?: string | null;
  speaker?: string | null;
  duration?: number | null;
  status?: string;
  faq?: string | null;
  refundPolicy?: string | null;
  requiresPayment?: boolean;
  availableSpots?: number | null;
  isPublished?: boolean;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
  _count?: { tickets: number };
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
  id: string | number;
  webinarId: string | number;
  userId?: string | number;
  status: string; // Applied | Approved | Rejected | Confirmed
  answers?: Record<string, string | string[]>;
  createdAt?: string;
  // Ticket relation (added by backend include) – optional
  ticket?: (
    | {
        id: string | number;
        code: string;
        issuedAt?: string;
      }
    | { id: string | number; code: string; issuedAt?: string }[]
  ) | null;
}

export interface Ticket {
  webinar: Webinar;
  code: string;
  webinarId: string | number;
  userId: string | number;
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
  applyForWebinar: (webinarId: string | number, answers: Record<string, string | string[]>) => Promise<{ id: string | number; webinarId: string | number; status: string; requiresPayment?: boolean; price?: number | null; ticket?: { id: number | string; code: string; qrCode?: string; issuedAt?: string }; availableSpots?: number | null; }>;
  getTicketForWebinar: (webinarId: string | number) => Ticket | undefined;
  initializeWebinarPayment?: (webinarId: string | number, amount: number) => Promise<any>;
  publishWebinar: (webinarId: string) => Promise<void>;
  unpublishWebinar: (webinarId: string) => Promise<void>;
  deleteWebinar: (webinarId: string | number) => Promise<void>;
  createWebinar: (formData: FormData) => Promise<Webinar>;
  updateWebinar: (webinarId: string, formData: FormData) => Promise<Webinar>;
  // Deprecated approval flow removed for webinars
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

  applyForWebinar: async (webinarId: string | number, answers: Record<string, string | string[]>) => {
    set({ loading: true, error: undefined });
    try {
      const resp = await webinarService.applyForWebinar(webinarId, answers);
      const data = resp?.data;
      const result = {
        id: data.id,
        webinarId: data.webinar_id,
        status: data.status,
        requiresPayment: data.requiresPayment,
        price: data.price,
        ticket: data.ticket,
        availableSpots: data.availableSpots,
      };
      // If a ticket was issued (free webinar path) push into userTickets list with minimal webinar info
      if (data.ticket) {
        set(state => {
          const exists = state.userTickets.some(t => t.code === data.ticket!.code);
          if (exists) return {};
          return {
            userTickets: [
              ...state.userTickets,
              {
                code: data.ticket!.code,
                webinarId: webinarId,
                userId: 0 as any, // unknown; backend can add with future response shape
                createdAt: data.ticket!.issuedAt || new Date().toISOString(),
                webinar: state.upcomingWebinars.find(w => w.id.toString() === webinarId.toString()) || { id: webinarId, title: '' } as any,
              },
            ],
          };
        });
      }
      return result;
    } catch (err: unknown) {
      set({ error: (err as Error).message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  getTicketForWebinar: (webinarId: string | number) => {
    return get().userTickets.find(t => t.webinarId.toString() === webinarId.toString());
  },

  initializeWebinarPayment: async (webinarId: string | number, amount: number) => {
    set({ loading: true, error: undefined });
    try {
      return await webinarService.initializeWebinarPayment(webinarId, amount);
    } catch (err: unknown) {
      set({ error: (err as Error).message });
      throw err;
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

  deleteWebinar: async (webinarId: string | number) => {
    // optimistic removal
    const idStr = webinarId.toString();
    const prev = get().adminWebinars;
    const filtered = prev.filter(w => w.id.toString() !== idStr);
    set({ adminWebinars: filtered });
    try {
      await webinarService.deleteWebinar(webinarId);
    } catch (err: unknown) {
      // rollback
      set({ adminWebinars: prev, error: (err as Error).message });
      throw err;
    }
  },

  // approveApplication / rejectApplication removed – no manual moderation for webinars now
}));