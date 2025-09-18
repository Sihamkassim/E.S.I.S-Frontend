import { api } from "./api";

// --------------------
// Interfaces
// --------------------
export interface Webinar {
  id: string;
  title: string;
  description?: string;
  schedule: string;
  capacity?: number;
  price?: number;
  location?: string;
  speaker?: string;
  image?: string;
  duration?: number;
  published?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WebinarApplication {
  id: string;
  webinarId: string;
  userId: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
}

export interface Ticket {
  webinar: Webinar;
  code: string;
  webinarId: string;
  userId: string;
  createdAt: string;
}

// --------------------
// Service
// --------------------
export const webinarService = {
  // ---------- Public ----------
  getUpcomingWebinars: async (): Promise<Webinar[]> => {
    const res = await api.get("/public/webinars");
    
    if (!res.data || !res.data.data) {
      throw new Error('Invalid API response format');
    }
    
    const webinars = res.data.data;
    if (!Array.isArray(webinars)) {
      throw new Error('Expected an array of webinars');
    }
    
    return webinars;
  },

  getWebinarById: async (id: string): Promise<Webinar> => {
    const res = await api.get(`/public/webinars/${id}`);
    return res.data;
  },

  getTicketByCode: async (code: string): Promise<Ticket> => {
    const res = await api.get(`/public/tickets/${code}`);
    return res.data;
  },

  // ---------- User ----------
  applyForWebinar: async (webinarId: string, answers: Record<string, string | string[]>) => {
    const res = await api.post("/user/webinar-applications", {
      webinar_id: webinarId,
      answers,
    });
    return res.data;
  },

  checkoutWebinarApplication: async (id: string) => {
    const res = await api.post(`/user/webinar-applications/${id}/checkout`);
    return res.data;
  },

  confirmWebinarPayment: async (id: string) => {
    const res = await api.post(`/user/webinar-applications/${id}/confirm`);
    return res.data;
  },

  getUserTickets: async (): Promise<Ticket[]> => {
    const res = await api.get("/user/tickets/me");
    return res.data.data;
  },

  // ---------- Admin ----------
  getAdminWebinars: async (): Promise<Webinar[]> => {
    const res = await api.get("/admin/webinars");
    return res.data.data;
  },

  createWebinar: async (formData: FormData): Promise<Webinar> => {
    const res = await api.post("/admin/webinars", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  updateWebinar: async (id: string, formData: FormData): Promise<Webinar> => {
    const res = await api.patch(`/admin/webinars/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  publishWebinar: async (id: string, publish: boolean): Promise<Webinar> => {
    const res = await api.post(`/admin/webinars/${id}/publish`, { publish });
    return res.data;
  },

  getWebinarApplications: async (webinarId?: string): Promise<WebinarApplication[]> => {
    const res = await api.get("/admin/webinar-applications", {
      params: webinarId ? { webinar_id: webinarId } : {},
    });
    return res.data.data;
  },

  approveApplication: async (applicationId: string): Promise<void> => {
    const res = await api.post(`/admin/webinar-applications/${applicationId}/approve`);
    return res.data;
  },

  rejectApplication: async (applicationId: string): Promise<void> => {
    const res = await api.post(`/admin/webinar-applications/${applicationId}/reject`);
    return res.data;
  },
};
