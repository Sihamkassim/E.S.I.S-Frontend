import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatedSection, StaggeredContainer } from './AnimatedComponents';

// Types (you might want to move these to a shared types file)
interface Tag {
    tag: {
        name: string;
        slug: string;
    };
}

interface Category {
    name: string;
    slug: string;
}

interface AuthorProfile {
    name: string;
    avatarUrl: string;
}

interface Author {
    id: number;
    profile: AuthorProfile;
}

interface Article {
    id: number;
    title: string;
    slug: string;
    summary: string;
    featuredImage: string;
    publishedAt: string;
    createdAt: string;
    category: Category;
    author: Author;
    tags: Tag[];
    content?: string;
}

interface ArticleApiResponse {
    data: Article[];
    meta: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

interface TechSectionProps {
    api: any; // You might want to type this properly
}

const TechSection: React.FC<TechSectionProps> = ({ api }) => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [articlesLoading, setArticlesLoading] = useState(true);
    const [expandedArticleId, setExpandedArticleId] = useState<number | null>(null);

    const articleScrollRef = useRef<HTMLDivElement>(null);
    const [isManualScrolling, setIsManualScrolling] = useState(false);
    const scrollIntervalRef = useRef<number | null>(null);
    const firstSetWidthRef = useRef<number>(0);

    // Fetch Articles
    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setArticlesLoading(true);
                const result = await api.get('/public/articles');
                setArticles(result.data.data || []);
            } catch (err) {
                console.error('Error fetching articles:', err);
                setArticles([]);
            } finally {
                setArticlesLoading(false);
            }
        };
        fetchArticles();
    }, [api]);

    // Calculate first set width for infinite scroll when not expanded (desktop only)
    useEffect(() => {
        if (articleScrollRef.current && articles.length > 0 && expandedArticleId === null) {
            const timeoutId = setTimeout(() => {
                const scrollContainer = articleScrollRef.current?.querySelector('div[style*="max-content"]') as HTMLDivElement;
                if (scrollContainer) {
                    firstSetWidthRef.current = scrollContainer.offsetWidth / 2;
                }
            }, 100);
            return () => clearTimeout(timeoutId);
        } else if (expandedArticleId !== null) {
            firstSetWidthRef.current = 0;
        }
    }, [articles, expandedArticleId]);

    // Snap to loop for infinite scroll
    const snapToLoop = useCallback(() => {
        if (!articleScrollRef.current || firstSetWidthRef.current === 0) return;
        const container = articleScrollRef.current;
        let sl = container.scrollLeft;
        const max = firstSetWidthRef.current;
        if (sl >= max) {
            container.scrollLeft = sl % max;
        } else if (sl < 0) {
            container.scrollLeft = max + (sl % max);
        }
    }, []);

    // Auto-scroll articles horizontally with infinite loop - only on desktop
    useEffect(() => {
        if (articles.length === 0 || expandedArticleId !== null || isManualScrolling || firstSetWidthRef.current === 0 || window.innerWidth < 1024) return;

        const startAutoScroll = () => {
            if (scrollIntervalRef.current) return;

            const animate = () => {
                if (articleScrollRef.current && expandedArticleId === null && !isManualScrolling && firstSetWidthRef.current > 0 && window.innerWidth >= 1024) {
                    const container = articleScrollRef.current;
                    const delta = 0.5;
                    const max = firstSetWidthRef.current;
                    container.scrollLeft = (container.scrollLeft + delta) % max;
                }
                scrollIntervalRef.current = window.requestAnimationFrame(animate);
            };

            scrollIntervalRef.current = window.requestAnimationFrame(animate);
        };

        const stopAutoScroll = () => {
            if (scrollIntervalRef.current) {
                window.cancelAnimationFrame(scrollIntervalRef.current);
                scrollIntervalRef.current = null;
            }
        };

        startAutoScroll();

        return () => stopAutoScroll();
    }, [articles.length, expandedArticleId, isManualScrolling, firstSetWidthRef.current]);

    const scrollArticles = (direction: 'left' | 'right') => {
        if (articleScrollRef.current) {
            const container = articleScrollRef.current;
            const scrollAmount = 336;

            setIsManualScrolling(true);

            const currentScroll = container.scrollLeft;
            const targetScroll = direction === 'left'
                ? currentScroll - scrollAmount
                : currentScroll + scrollAmount;

            container.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });

            setTimeout(() => {
                setIsManualScrolling(false);
                if (firstSetWidthRef.current > 0) {
                    container.scrollLeft = targetScroll % firstSetWidthRef.current;
                }
            }, 800);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const generatePlaceholderImage = (title: string, index: number, colors: string[]) => {
        const color = colors[index % colors.length];
        return `https://via.placeholder.com/400x300/${color}/FFFFFF?text=${encodeURIComponent(title.substring(0, 15))}`;
    };

    const handleArticleClick = (articleId: number) => {
        setExpandedArticleId(expandedArticleId === articleId ? null : articleId);
        if (articleScrollRef.current) {
            articleScrollRef.current.scrollLeft = 0;
        }
    };

    const getImageUrl = (imagePath: string | undefined | null, fallbackTitle: string, index: number) => {
        if (!imagePath) {
            return generatePlaceholderImage(fallbackTitle, index, ['F59E0B', '1E293B', '7C3AED', '0EA5E9']);
        }
        if (imagePath.startsWith('http')) return imagePath;
        const baseUrl = `http://localhost:3000`;
        return `${baseUrl}${imagePath}`;
    };

    const displayArticles = expandedArticleId === null ? [...articles, ...articles] : articles;
    const isDesktop = typeof window !== 'undefined' ? window.innerWidth >= 1024 : false;

    const isExpandedArticle = (articleId: number) => expandedArticleId === articleId;

    const renderArticleCard = (article: Article, index: number) => {
        const imageUrl = getImageUrl(article.featuredImage, article.title, article.id);
        const isExpanded = isExpandedArticle(article.id);

        return (
            <AnimatedSection
                key={`${article.id}-${index}`}
                className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-700 ease-out overflow-hidden group cursor-pointer ${isExpanded ? 'w-full col-span-full lg:w-[640px]' : 'w-full lg:w-80 lg:flex-shrink-0'
                    }`}
            >
                <div className={`relative overflow-hidden ${isExpanded ? 'h-64' : 'h-48 sm:h-56'}`}>
                    <img
                        src={imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500 ease-out"></div>
                </div>
                <div className="p-4 sm:p-5">
                    <h4 className="font-bold text-gray-900 mb-2 text-base sm:text-lg group-hover:text-blue-600 transition-colors duration-500 ease-out">
                        {article.title}
                    </h4>

                    {!isExpanded ? (
                        <>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.summary}</p>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleArticleClick(article.id);
                                }}
                                className="text-blue-600 text-sm font-semibold hover:text-blue-800 transition-colors duration-300 ease-out flex items-center gap-1 group/btn"
                            >
                                read more
                                <span className="inline-block group-hover/btn:translate-x-1 transition-transform duration-300 ease-out">→</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 flex-wrap">
                                <span className="font-medium">{article.author.profile.name}</span>
                                <span>•</span>
                                <span>{formatDate(article.publishedAt)}</span>
                                <span>•</span>
                                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                                    {article.category.name}
                                </span>
                            </div>
                            <p className="text-gray-700 text-base leading-relaxed mb-4">
                                {article.summary}
                            </p>
                            {article.content && (
                                <div className="text-gray-600 leading-relaxed mb-4 max-h-60 overflow-y-auto">
                                    {article.content}
                                </div>
                            )}
                            {article.tags.length > 0 && (
                                <div className="mb-4 flex flex-wrap gap-2">
                                    {article.tags.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs transition-all duration-300 ease-out hover:bg-gray-200"
                                        >
                                            #{tag.tag.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleArticleClick(article.id);
                                }}
                                className="text-blue-600 text-sm font-semibold hover:text-blue-800 transition-colors duration-300 ease-out flex items-center gap-1 group/btn"
                            >
                                show less
                                <span className="inline-block group-hover/btn:-translate-x-1 transition-transform duration-300 ease-out">←</span>
                            </button>
                        </>
                    )}
                </div>
            </AnimatedSection>
        );
    };

    const renderArticles = () => {
        if (articlesLoading) {
            return (
                <AnimatedSection className="text-center py-12 transition-all duration-500 ease-out">
                    <p className="text-gray-600">Loading articles...</p>
                </AnimatedSection>
            );
        }

        if (articles.length === 0) {
            return (
                <AnimatedSection className="text-center py-12 transition-all duration-500 ease-out">
                    <p className="text-gray-600">No articles available at the moment.</p>
                </AnimatedSection>
            );
        }

        if (expandedArticleId !== null) {
            return (
                <AnimatedSection className="grid grid-cols-1 gap-6 transition-all duration-1000 ease-out">
                    {articles.map((article) => {
                        if (!isExpandedArticle(article.id)) return null;
                        return renderArticleCard(article, article.id);
                    })}
                </AnimatedSection>
            );
        }

        return (
            <AnimatedSection className={`relative group/carousel transition-all duration-1000 ease-out ${isDesktop ? 'block' : 'grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6'}`}>
                {isDesktop && (
                    <>
                        {/* Left blur gradient */}
                        <div className="absolute left-0 top-0 bottom-6 w-24 bg-gradient-to-r from-gray-50 via-gray-50/80 to-transparent z-10 pointer-events-none"></div>

                        {/* Right blur gradient */}
                        <div className="absolute right-0 top-0 bottom-6 w-24 bg-gradient-to-l from-gray-50 via-gray-50/80 to-transparent z-10 pointer-events-none"></div>

                        <button
                            onClick={() => scrollArticles('left')}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 ease-out opacity-0 group-hover/carousel:opacity-100 hover:scale-110"
                        >
                            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={() => scrollArticles('right')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 ease-out opacity-0 group-hover/carousel:opacity-100 hover:scale-110"
                        >
                            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}
                <div
                    ref={articleScrollRef}
                    onScroll={isDesktop ? snapToLoop : undefined}
                    onWheel={isDesktop ? (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (articleScrollRef.current) {
                            articleScrollRef.current.scrollLeft += e.deltaY;
                        }
                    } : undefined}
                    className={`${isDesktop ? 'flex gap-6 overflow-x-auto pb-6 scrollbar-hide' : ''}`}
                    style={isDesktop ? {
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        scrollBehavior: 'smooth'
                    } : {}}
                >
                    <StaggeredContainer className={`${isDesktop ? 'flex gap-6' : 'grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6'}`} staggerDelay={0.1}>
                        {displayArticles.map((article, index) => renderArticleCard(article, index))}
                    </StaggeredContainer>
                </div>
            </AnimatedSection>
        );
    }


    return (
        <section className="py-8 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 my-10">
            <div className="max-w-7xl mx-auto">
                <AnimatedSection className="text-center mb-8 sm:mb-12">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 transition-all duration-500 ease-out">
                        Stay ahead with the latest Tech news
                    </h2>
                    <p className="text-gray-600 max-w-3xl mx-auto text-base sm:text-lg transition-all duration-500 ease-out">
                        Your daily dose of updates, insights, and tools to keep you informed, connected, and ahead in the tech world.
                    </p>
                </AnimatedSection>

                <div className='h-[200px]'>
                    <AnimatedSection className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8 transition-all py-8 duration-500 ease-out">
                        Featured Today
                    </AnimatedSection>
                </div>

                {renderArticles()}
            </div>
        </section>
    );
};

export default TechSection;