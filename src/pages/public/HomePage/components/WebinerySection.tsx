import React, { useState, useEffect } from 'react';
import { AnimatedSection, StaggeredContainer } from './AnimatedComponents';

// Types (you might want to move these to a shared types file)
interface Webinar {
    id: number;
    title: string;
    slug: string;
    description: string;
    schedule: string;
    capacity: number;
    price: number;
    requiresPayment: boolean;
    location: string;
    speaker: string;
    image: string | null;
    duration: number;
    status: string;
    isPublished: boolean;
    availableSpots: number;
    _count: {
        tickets: number;
    };
}

interface WebinarApiResponse {
    success: boolean;
    data: Webinar[];
}

interface WebinarySectionProps {
    api: any; // You might want to type this properly
}

const WebinarySection: React.FC<WebinarySectionProps> = ({ api }) => {
    const [webinars, setWebinars] = useState<Webinar[]>([]);
    const [webinarsLoading, setWebinarsLoading] = useState(true);
    const [webinarIndex, setWebinarIndex] = useState(0);

    // Fetch Webinars
    useEffect(() => {
        const fetchWebinars = async () => {
            try {
                setWebinarsLoading(true);
                const result = await api.get('/public/webinars') as { data: WebinarApiResponse };
                if (result.data.success) {
                    setWebinars(result.data.data || []);
                } else {
                    setWebinars([]);
                }
            } catch (err) {
                console.error('Error fetching webinars:', err);
                setWebinars([]);
            } finally {
                setWebinarsLoading(false);
            }
        };
        fetchWebinars();
    }, [api]);

    // Webinar carousel
    const nextWebinarSlide = () => {
        setWebinarIndex((prev) => (prev + 1) % webinars.length);
    };

    const prevWebinarSlide = () => {
        setWebinarIndex((prev) => (prev - 1 + webinars.length) % webinars.length);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const generatePlaceholderImage = (title: string, index: number, colors: string[]) => {
        const color = colors[index % colors.length];
        return `https://via.placeholder.com/400x300/${color}/FFFFFF?text=${encodeURIComponent(title.substring(0, 15))}`;
    };

    const getVisibleWebinars = () => {
        if (webinars.length === 0) return [];
        if (webinars.length === 1) return [webinars[0]];
        if (webinars.length === 2) return [webinars[webinarIndex], webinars[(webinarIndex + 1) % webinars.length]];

        const prev = (webinarIndex - 1 + webinars.length) % webinars.length;
        const current = webinarIndex;
        const next = (webinarIndex + 1) % webinars.length;

        return [webinars[prev], webinars[current], webinars[next]];
    };

    const getImageUrl = (imagePath: string | undefined | null, fallbackTitle: string, index: number) => {
        if (!imagePath) {
            return generatePlaceholderImage(fallbackTitle, index, ['F59E0B', '1E293B', '7C3AED', '0EA5E9']);
        }
        if (imagePath.startsWith('http')) return imagePath;
        const baseUrl = `http://localhost:3000`;
        return `${baseUrl}/public/${imagePath}`;
    };

    const webinarGradients = ["from-orange-400 via-orange-500 to-yellow-500", "from-slate-900 via-slate-800 to-blue-900", "from-purple-900 via-pink-900 to-red-900"];
    const webinarIcons = ["💡", "🔗", "</>"];

    const renderWebinars = () => {
        if (webinarsLoading) {
            return (
                <AnimatedSection className="text-center py-12 transition-all duration-500 ease-out">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Webinars and Seminars</h2>
                    <p className="text-gray-600">Loading webinars...</p>
                </AnimatedSection>
            );
        }

        if (webinars.length === 0) {
            return (
                <AnimatedSection className="text-center py-12 transition-all duration-500 ease-out">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Webinars and Seminars</h2>
                    <p className="text-gray-600">No webinars available at the moment.</p>
                </AnimatedSection>
            );
        }

        const visibleWebinars = getVisibleWebinars();

        return (
            <AnimatedSection className="flex flex-col lg:flex-row gap-8 sm:gap-12 items-start lg:items-center transition-all duration-1000 ease-out">
                <div className="lg:w-1/3 w-full">
                    <AnimatedSection animationType="fadeInUp" className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                        Webinars<br className="hidden sm:block" />and Seminars
                    </AnimatedSection>
                    <AnimatedSection animationType="fadeInUp" delay={0.2} className="text-gray-600 mb-8 text-base sm:text-lg leading-relaxed">
                        Join our latest sessions to explore new insights, trends and hands-on knowledge from industry experts.
                    </AnimatedSection>

                    {webinars.length > 1 && (
                        <AnimatedSection className="flex items-center gap-4 transition-all duration-300 ease-out">
                            <button
                                onClick={prevWebinarSlide}
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-600 hover:text-blue-600 transition-all duration-300 ease-out transform hover:scale-110"
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <span className="text-gray-600 font-medium text-sm sm:text-base">
                                {webinarIndex + 1} / {webinars.length}
                            </span>
                            <button
                                onClick={nextWebinarSlide}
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-600 hover:text-blue-600 transition-all duration-300 ease-out transform hover:scale-110"
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </AnimatedSection>
                    )}
                </div>

                <div className="lg:w-2/3 w-full overflow-hidden transition-all duration-1000 ease-out">
                    <StaggeredContainer className="flex flex-col sm:flex-row gap-4 sm:gap-6 py-5 px-4 justify-center items-end lg:items-end" staggerDelay={0.1}>
                        {visibleWebinars.map((webinar, idx) => {
                            const gradient = webinarGradients[webinar.id % webinarGradients.length];
                            const icon = webinarIcons[webinar.id % webinarIcons.length];
                            const imageUrl = getImageUrl(webinar.image, webinar.title, webinar.id);
                            const registeredCount = webinar.capacity - webinar.availableSpots;

                            const isCenter = visibleWebinars.length === 3 ? idx === 1 : false;
                            const cardHeight = isCenter ? 'h-80 sm:h-96' : 'h-72 sm:h-80';
                            const marginBottom = isCenter ? 'mb-0' : 'sm:mb-4';

                            return (
                                <AnimatedSection
                                    key={webinar.id}
                                    className={`relative rounded-2xl overflow-hidden group cursor-pointer transition-all duration-700 ease-out hover:scale-105 w-full sm:w-auto flex-1 max-w-xs ${cardHeight} ${marginBottom}`}
                                >
                                    <div className="absolute inset-0 transition-all duration-700 ease-out">
                                        <img
                                            src={imageUrl}
                                            alt={webinar.title}
                                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                        />
                                        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90 transition-opacity duration-700 ease-out`}></div>
                                    </div>
                                    <div className="relative h-full p-4 sm:p-6 flex flex-col text-white transition-all duration-500 ease-out">
                                        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 text-3xl sm:text-4xl opacity-80 transition-all duration-500 ease-out">{icon}</div>
                                        <div className="flex-grow">
                                            <h3 className="text-base sm:text-lg font-bold mb-3 pr-10 sm:pr-12 leading-tight line-clamp-2 transition-all duration-500 ease-out">
                                                {webinar.title}
                                            </h3>
                                            <p className="text-xs sm:text-sm opacity-90 mb-1 transition-all duration-500 ease-out">⭐ {webinar.speaker}</p>
                                            <p className="text-xs opacity-80 mb-1 transition-all duration-500 ease-out">
                                                📅 {formatDate(webinar.schedule)} | {formatTime(webinar.schedule)}
                                            </p>
                                            <p className="text-xs opacity-80 mb-1 transition-all duration-500 ease-out">👥 {registeredCount} registered</p>
                                            <p className="text-xs opacity-80 transition-all duration-500 ease-out">{webinar.location} • {webinar.duration} min</p>
                                        </div>
                                        <button className="bg-white/20 backdrop-blur-sm text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm font-semibold hover:bg-white/30 transition-all duration-500 ease-out border border-white/30 w-full mt-4 transform hover:scale-105">
                                            Register Now
                                        </button>
                                    </div>
                                </AnimatedSection>
                            );
                        })}
                    </StaggeredContainer>
                </div>
            </AnimatedSection>
        );
    };

    return (
        <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
                {renderWebinars()}
            </div>
        </section>
    );
};

export default WebinarySection;