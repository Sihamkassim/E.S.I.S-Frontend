export type ProjectStatus =
  | 'PENDING'
  | 'SUBMITTED'
  | 'APPROVED'
  | 'FEATURED'
  | 'REJECTED'
  | 'CHANGES_REQUESTED';

export interface ProjectTagRef { tag: { name: string; slug: string } }

export interface Project {
  id: number;
  userId?: number; // sometimes omitted in select
  title: string;
  slug: string;
  summary?: string;
  description?: string;
  teamName: string;
  teamMembers?: string;
  demoLink?: string;
  repoLink?: string;
  coverImage?: string;
  country?: string;
  stack?: string[];
  status: ProjectStatus;
  featuredAt?: string;
  submittedAt?: string;
  modNotes?: string;
  createdAt: string;
  updatedAt?: string;
  user: {
    id: number;
    profile: {
      name: string;
      avatarUrl?: string;
    };
  };
  tags: ProjectTagRef[];
  // media and flags can be added when needed
  media?: { id: number; url: string; type: string }[];
}

export interface ProjectMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}