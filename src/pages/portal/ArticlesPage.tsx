import { useState, useEffect } from "react";
import { ArticleCard } from "../../components/articles/ArticleCard";
import {
  articleService,
  Article,
  // Category,
  Tag,
} from "../../services/articleService";

interface FilterState {
  search: string;
  category: string;
  tag: string;
  date: string;
  page: number;
  limit: number;
}

export const ArticlesPage = () => {
  // State
  const [articles, setArticles] = useState<Article[]>([]);
  // const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination & totals
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "",
    tag: "",
    date: "",
    page: 1,
    limit: 9,
  });

  // Fetch articles from API
  const fetchArticles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, meta } = await articleService.getArticles({
        category: filters.category || undefined,
        tag: filters.tag || undefined,
        page: filters.page,
        limit: filters.limit,
        status: "PUBLISHED", // only show published articles
      });

      // If client-side date or search is applied, filter here
      let filtered = [...data];

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filtered = filtered.filter(
          (a) =>
            a.title.toLowerCase().includes(searchTerm) ||
            (a.summary && a.summary.toLowerCase().includes(searchTerm))
        );
      }

      if (filters.date) {
        const filterDate = new Date(filters.date).toDateString();
        filtered = filtered.filter((a) => {
          const articleDate = new Date(a.publishedAt || a.createdAt).toDateString();
          return articleDate === filterDate;
        });
      }

      setArticles(filtered);
      setTotal(meta.total);
      setTotalPages(meta.pages);
    } catch (err) {
      console.error("Error fetching articles:", err);
      setError("Failed to load articles. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories & tags
  const fetchFiltersData = async () => {
    try {
      const [tagsData] = await Promise.all([
        // articleService.getCategories(),
        articleService.getTags(),
      ]);
      // setCategories(categoriesData);
      setTags(tagsData);
    } catch (err) {
      console.error("Error fetching filter data:", err);
    }
  };

  // Filter change handler
  const handleFilterChange = (key: keyof FilterState, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      ...(key !== "page" && { page: 1 }), // reset to page 1 when filters change
    }));
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      search: "",
      category: "",
      tag: "",
      date: "",
      page: 1,
      limit: 9,
    });
  };

  // Pagination range
  const getPaginationRange = () => {
    const currentPage = filters.page;
    const delta = 2;
    const range: (number | string)[] = [];

    if (currentPage > delta + 1) {
      range.push(1);
      if (currentPage > delta + 2) range.push("...");
    }

    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(totalPages, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage < totalPages - delta) {
      if (currentPage < totalPages - delta - 1) range.push("...");
      range.push(totalPages);
    }

    return range;
  };

  // Effects
  useEffect(() => {
    fetchFiltersData();
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [filters]);

  // --- UI states ---
  if (isLoading && articles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-white/80">
        Loading articles...
      </div>
    );
  }

  if (error && articles.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 dark:text-red-300 mb-4">{error}</p>
        <button
          onClick={fetchArticles}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 transition-colors duration-300">
      <div className="container mx-auto px-4">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Tech Updates
          </h1>
          <p className="text-gray-600 dark:text-white/70">
            Archive of all daily tech articles and updates
          </p>
        </header>

        {/* Filters */}
        <div className="bg-white dark:bg-white/10 p-6 rounded-xl border border-gray-200 dark:border-white/20 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Search..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-white/5 border dark:border-white/20"
            />

            {/* Category */}
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-white/5 border dark:border-white/20"
            >
              <option value="">All Categories</option>
              {/* {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))} */}
            </select>

            {/* Tag */}
            <select
              value={filters.tag}
              onChange={(e) => handleFilterChange("tag", e.target.value)}
              className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-white/5 border dark:border-white/20"
            >
              <option value="">All Tags</option>
              {tags.map((t) => (
                <option key={t.id} value={t.slug}>
                  {t.name}
                </option>
              ))}
            </select>

            {/* Date */}
            <input
              type="date"
              value={filters.date}
              onChange={(e) => handleFilterChange("date", e.target.value)}
              className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-white/5 border dark:border-white/20 [color-scheme:light-dark]"
            />
          </div>

          {/* Reset */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-gray-200 dark:bg-white/10 rounded-lg hover:bg-gray-300 dark:hover:bg-white/20"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-white/70">
            Showing {(filters.page - 1) * filters.limit + 1}–
            {Math.min(filters.page * filters.limit, total)} of {total} articles
          </p>
        </div>

        {/* Articles */}
        {articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex gap-2">
                  <button
                    disabled={filters.page === 1}
                    onClick={() => handleFilterChange("page", filters.page - 1)}
                    className="px-4 py-2 rounded-lg border disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {getPaginationRange().map((p, i) =>
                    p === "..." ? (
                      <span key={i} className="px-3 py-2">
                        ...
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => handleFilterChange("page", p as number)}
                        className={`px-4 py-2 rounded-lg border ${
                          filters.page === p
                            ? "bg-blue-600 text-white"
                            : "bg-white dark:bg-white/10"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                  <button
                    disabled={filters.page === totalPages}
                    onClick={() => handleFilterChange("page", filters.page + 1)}
                    className="px-4 py-2 rounded-lg border disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-white/70">
              No articles found.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesPage;