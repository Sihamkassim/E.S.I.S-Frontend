import { api } from './api';

// Transform database image path to full URL
const transformImageUrl = (imagePath: string | undefined): string | undefined => {
  if (!imagePath) return undefined;
  
  if (imagePath.startsWith('http')) return imagePath;
  
  if (imagePath.startsWith('/uploads/')) {
    return `http://localhost:3000${imagePath}`;
  }
  
  // If it's just a filename without path, construct the full URL
  return `http://localhost:3000/uploads/articles/${imagePath}`;
};

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

// Helper function to transform article data
const transformArticle = (article: any): Article => ({
  ...article,
  featuredImage: transformImageUrl(article.featuredImage),
  author: article.author ? {
    ...article.author,
    profile: article.author.profile ? {
      ...article.author.profile,
      avatarUrl: transformImageUrl(article.author.profile.avatarUrl)
    } : undefined
  } : undefined
});

// Helper function to transform article list
const transformArticleList = (articles: any[]): Article[] => 
  articles.map(article => transformArticle(article));

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
    
    // Transform the featuredImage URLs in the response
    return {
      ...response.data,
      data: transformArticleList(response.data.data)
    };
  },

  getArticleBySlug: async (slug: string): Promise<Article> => {
    const response = await api.get<Article>(`/public/articles/${slug}`);
    return transformArticle(response.data);
  },

  getRelatedArticles: async (articleId: number): Promise<Article[]> => {
    const response = await api.get<Article[]>(`/public/articles/${articleId}/related`);
    return transformArticleList(response.data);
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
    return transformArticle(response.data);
  },

  updateArticle: async (id: number, data: UpdateArticleData): Promise<Article> => {
    const formData = new FormData();
    
    // Append basic fields
    if (data.title !== undefined) formData.append('title', data.title);
    if (data.content !== undefined) formData.append('content', data.content);
    if (data.summary !== undefined) formData.append('summary', data.summary || '');
    if (data.categoryId !== undefined) formData.append('categoryId', data.categoryId?.toString() || '');
    
    // Handle tags
    if (data.tags !== undefined) {
      try {
        const allTags = await articleService.getTags();
        const tagIds = data.tags
          .map(tagName => {
            const foundTag = allTags.find(tag => 
              tag.name.toLowerCase() === tagName.toLowerCase()
            );
            return foundTag?.id || null;
          })
          .filter((id): id is number => id !== null);

        formData.append('tags', JSON.stringify(tagIds));
      } catch (error) {
        console.error('Error converting tags:', error);
        formData.append('tags', JSON.stringify([]));
      }
    }
    
    if (data.metaTitle !== undefined) formData.append('metaTitle', data.metaTitle || '');
    if (data.metaDescription !== undefined) formData.append('metaDescription', data.metaDescription || '');
    if (data.status !== undefined) formData.append('status', data.status);
    if (data.publishAt !== undefined) formData.append('publishAt', data.publishAt || '');
    
    if (data.featuredImage instanceof File) {
      formData.append('featuredImage', data.featuredImage);
    }

    const response = await api.patch<Article>(`/admin/articles/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return transformArticle(response.data);
  },

  publishArticle: async (id: number): Promise<Article> => {
    const response = await api.post<Article>(`/admin/articles/${id}/publish`);
    return transformArticle(response.data);
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
    
    // Transform the featuredImage URLs in the response
    return {
      ...response.data,
      data: transformArticleList(response.data.data)
    };
  },

  getTags: async (): Promise<Tag[]> => {
    try {
      const response = await api.get<TagsResponse>('/public/tags');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching tags:', error);
      return [];
    }
  },
};

export default articleService;