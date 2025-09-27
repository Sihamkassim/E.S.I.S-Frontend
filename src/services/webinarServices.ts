import { api } from "./api";

// --------------------
// Interfaces
// --------------------
export interface Webinar {
  id: string | number;
  title: string;
  description?: string;
  schedule: string;
  capacity?: number | null;
  price?: number | null;
  location?: string | null;
  speaker?: string | null;
  image?: string | null;
  duration?: number | null;
  isPublished?: boolean;
  requiresPayment?: boolean;
  availableSpots?: number | null;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WebinarApplication {
  id: string | number;
  webinarId: string | number;
  userId?: string | number;
  status: "Applied" | "Approved" | "Rejected" | "Confirmed";
  createdAt?: string;
  requiresPayment?: boolean;
  price?: number | null;
}

export interface Ticket {
  webinar: Webinar;
  code: string;
  webinarId: string | number;
  userId: string | number;
  createdAt: string;
}

interface ApplyForWebinarResponse {
  success: boolean;
  message: string;
  data: {
    id: number | string;
    webinar_id: number | string;
    status: string;
    requiresPayment?: boolean;
    price?: number | null;
    ticket?: { id: number | string; code: string; qrCode?: string; issuedAt?: string };
    availableSpots?: number | null;
  };
}

interface InitializePaymentResponse {
  status: string;
  message: string;
  data: {
    checkout_url?: string; // Chapa usually returns this
    [key: string]: any;
  };
}

// --------------------
// Service
// --------------------
export const webinarService = {
  // ---------- Public ----------
  getUpcomingWebinars: async (): Promise<Webinar[]> => {
    const res = await api.get("/public/webinars");
    const payload = res.data;
    const webinars = payload?.data ?? payload; // support either wrapped or direct
    if (!Array.isArray(webinars)) throw new Error("Expected an array of webinars");
    return webinars;
  },

  getWebinarById: async (id: string): Promise<Webinar> => {
    const res = await api.get(`/public/webinars/${id}`);
    const payload = res.data;
    return payload?.data ?? payload; // unwrap if necessary
  },

  getTicketByCode: async (code: string): Promise<Ticket> => {
    const res = await api.get(`/public/tickets/${code}`);
    const payload = res.data;
    return payload?.data ?? payload;
  },

  // ---------- User ----------
  applyForWebinar: async (
    webinarId: string | number,
    answers: Record<string, string | string[]>
  ): Promise<ApplyForWebinarResponse> => {
    const res = await api.post("/user/webinar-applications", {
      webinar_id: webinarId,
      answers,
    });
    return res.data;
  },

  checkoutWebinarApplication: async (id: string | number) => {
    const res = await api.post(`/user/webinar-applications/${id}/checkout`);
    return res.data;
  },
  // Deprecated confirm removed – payment handled via payment controller

  initializeWebinarPayment: async (
    webinarId: string | number,
    amount: number
  ): Promise<InitializePaymentResponse> => {
    const res = await api.post("/payment/initialize", {
      type: "webinar",
      webinarId: typeof webinarId === 'string' ? Number(webinarId) : webinarId,
      amount,
    });
    return res.data;
  },

  getUserTickets: async (): Promise<Ticket[]> => {
    const res = await api.get("/user/tickets/me");
    const payload = res.data;
    return payload?.data ?? payload;
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

  deleteWebinar: async (id: string | number): Promise<{ success: boolean; message: string }> => {
    const res = await api.delete(`/admin/webinars/${id}`);
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
