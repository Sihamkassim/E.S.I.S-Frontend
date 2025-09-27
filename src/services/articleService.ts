import { api } from './api';

// http://localhost:3000/uploads/projects/temp/1758697312044-91897894-Screenshot_2024-10-30_070213.png 

export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  featuredImage?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  metaTitle?: string;
  metaDescription?: string;
  categoryId?: number;
  authorId: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  author?: {
    id: string;
    profile?: {
      name: string;
      avatarUrl?: string;
    };
  };
  tags?: Array<{
    tag: {
      id: number;
      name: string;
      slug: string;
    };
  }>;
}

export interface ArticleListResponse {
  data: Article[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface CreateArticleData {
  title: string;
  content: string;
  summary?: string;
  categoryId?: number;
  categoryName?: string;
  tags?: string[];
  featuredImage?: File;
  metaTitle?: string;
  metaDescription?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';
  publishAt?: string;
}

export interface UpdateArticleData {
  title?: string;
  content?: string;
  summary?: string;
  categoryId?: number;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';
  publishAt?: string;
  featuredImage?: File;
}

export interface ArticleFilters {
  tag?: string;
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  articleCount: number;
}

export interface TagsResponse {
  data: Tag[];
}

export const articleService = {
  // Public endpoints
  getArticles: async (filters: ArticleFilters = {}): Promise<ArticleListResponse> => {
    const params = new URLSearchParams();
    
    if (filters.tag) params.append('tag', filters.tag);
    if (filters.category) params.append('category', filters.category);
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await api.get<ArticleListResponse>(`/public/articles?${params.toString()}`);
    return response.data;
  },

  getArticleBySlug: async (slug: string): Promise<Article> => {
    const response = await api.get<Article>(`/public/articles/${slug}`);
    return response.data;
  },

  getRelatedArticles: async (articleId: number): Promise<Article[]> => {
    const response = await api.get<Article[]>(`/public/articles/${articleId}/related`);
    return response.data;
  },

  // Admin endpoints
  createArticle: async (data: CreateArticleData): Promise<Article> => {
    const formData = new FormData();
    
    // Append basic fields
    formData.append('title', data.title);
    formData.append('content', data.content);
    if (data.summary) formData.append('summary', data.summary);
    if (data.categoryId) formData.append('categoryId', data.categoryId.toString());
    if (data.categoryName) formData.append('categoryName', data.categoryName);
    if (data.tags) formData.append('tags', JSON.stringify(data.tags));
    if (data.metaTitle) formData.append('metaTitle', data.metaTitle);
    if (data.metaDescription) formData.append('metaDescription', data.metaDescription);
    if (data.status) formData.append('status', data.status);
    if (data.publishAt) formData.append('publishAt', data.publishAt);
    
    // Append file if provided
    if (data.featuredImage) {
      formData.append('featuredImage', data.featuredImage);
    }

    const response = await api.post<Article>('/admin/articles', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateArticle: async (id: number, data: UpdateArticleData): Promise<Article> => {
  const formData = new FormData();
  
  // Append basic fields
  if (data.title !== undefined) formData.append('title', data.title);
  if (data.content !== undefined) formData.append('content', data.content);
  if (data.summary !== undefined) formData.append('summary', data.summary || '');
  if (data.categoryId !== undefined) formData.append('categoryId', data.categoryId?.toString() || '');
  
  // Handle tags conversion from names to IDs
  if (data.tags !== undefined) {
    try {
      // Get all available tags first
      const allTags = await articleService.getTags();
      
      // Convert tag names to tag IDs
      const tagIds = data.tags
        .map(tagName => {
          const foundTag = allTags.find(tag => 
            tag.name.toLowerCase() === tagName.toLowerCase()
          );
          return foundTag?.id || null;
        })
        .filter((id): id is number => id !== null);

      console.log('Tag conversion:', {
        inputTags: data.tags,
        outputTagIds: tagIds,
        availableTags: allTags.map(t => ({ id: t.id, name: t.name }))
      });

      // Send tag IDs to backend
      formData.append('tags', JSON.stringify(tagIds));
    } catch (error) {
      console.error('Error converting tags:', error);
      // Fallback: send empty array if tag conversion fails
      formData.append('tags', JSON.stringify([]));
    }
  }
  
  if (data.metaTitle !== undefined) formData.append('metaTitle', data.metaTitle || '');
  if (data.metaDescription !== undefined) formData.append('metaDescription', data.metaDescription || '');
  if (data.status !== undefined) formData.append('status', data.status);
  if (data.publishAt !== undefined) formData.append('publishAt', data.publishAt || '');
  
  if (data.featuredImage) {
    formData.append('featuredImage', data.featuredImage);
  }

  const response = await api.patch<Article>(`/admin/articles/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
},

  publishArticle: async (id: number): Promise<Article> => {
    const response = await api.post<Article>(`/admin/articles/${id}/publish`);
    return response.data;
  },

  deleteArticle: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/admin/articles/${id}`);
    return response.data;
  },

  // Admin-only article list with status filtering
  getAdminArticles: async (filters: ArticleFilters = {}): Promise<ArticleListResponse> => {
    const params = new URLSearchParams();
    
    if (filters.tag) params.append('tag', filters.tag);
    if (filters.category) params.append('category', filters.category);
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await api.get<ArticleListResponse>(`/admin/articles?${params.toString()}`);
    return response.data;
  },

  getTags: async (): Promise<Tag[]> => {
    try {
      const response = await api.get<TagsResponse>('/public/tags');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching tags:', error);
      return []; // Return empty array if fetch fails
    }
  },
};

export default articleService;