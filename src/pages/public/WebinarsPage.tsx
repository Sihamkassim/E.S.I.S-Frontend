import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import { Spinner } from "../../components/Spinner";
import WebinarCard from "../../components/webinar/WebinarCard";
import { useTheme } from "../../hooks/useTheme";
import { useWebinarStore } from "../../store/useWebinarstore";

export const WebinarsPage: React.FC = () => {
  const { upcomingWebinars, fetchUpcomingWebinars, loading, error } = useWebinarStore();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUpcomingWebinars();
  }, [fetchUpcomingWebinars]);

  const filteredWebinars = React.useMemo(() => {
    if (!Array.isArray(upcomingWebinars) || upcomingWebinars.length === 0) {
      return [];
    }
    return upcomingWebinars.filter(
      (webinar) =>
        webinar.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        webinar.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        webinar.speaker?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, upcomingWebinars]);

  return (
    <Layout>
      <div className={`container mx-auto px-4 py-12 md:py-16 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
        
        {/* --- Hero Section --- */}
        <section className={`mb-16 rounded-3xl overflow-hidden shadow-2xl shadow-primary/20 ${
          theme === "dark"
            ? "bg-gradient-to-br from-gray-900 via-primary-dark to-gray-900"
            : "bg-gradient-to-br from-blue-50 via-primary-light to-blue-50"
        }`}>
          {/* CHANGED: Reduced vertical padding from py-20 to py-16 */}
          <div className="py-16 px-6 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-white">
              Upcoming Webinars
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-white/90">
              Join our expert-led sessions and enhance your skills with our interactive webinars designed for tech enthusiasts.
            </p>
            
            {/* --- Search Bar --- */}
            <div className="relative max-w-xl mx-auto mt-8">
              <input
                type="text"
                placeholder="Search by title, description, or speaker..."
                className="w-full py-4 px-6 pr-14 rounded-full bg-white/10 backdrop-blur-md 
                  border border-white/20 text-white placeholder-white/70 focus:outline-none 
                  focus:ring-2 focus:ring-white/50 transition-all duration-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-5 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white/70"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* --- Webinars Grid Section --- */}
        <section className="mb-16">
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <Spinner />
            </div>
          ) : error ? (
            <div className="bg-red-500/10 text-red-600 dark:text-red-400 p-6 rounded-2xl text-center shadow-lg">
              <p className="font-semibold">Error loading webinars: {error}</p>
              <button 
                onClick={() => fetchUpcomingWebinars()} 
                className="mt-4 px-5 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300"
              >
                Try Again
              </button>
            </div>
          ) : filteredWebinars.length === 0 ? (
            <div className="text-center py-24">
              <div className="mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-20 w-20 mx-auto ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold">
                {searchQuery ? "No Matching Webinars Found" : "No Upcoming Webinars"}
              </h3>
              <p className={`mt-3 max-w-md mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {searchQuery 
                  ? "Try adjusting your search query or check back later for new events." 
                  : "We're busy planning more great content. Check back soon!"}
              </p>
            </div>
          ) : (
            // CHANGED: Reduced gap between cards from gap-8 to gap-6
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWebinars.map((webinar) => (
                <WebinarCard key={webinar.id} webinar={webinar} />
              ))}
            </div>
          )}
        </section>
        
        {/* --- Newsletter Sign-up Section --- */}
        <section className={`py-16 px-6 rounded-3xl shadow-xl ${
          theme === "dark" 
            ? "bg-gray-800 border border-gray-700" 
            : "bg-gray-100 border border-gray-200"
        }`}>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Never Miss a Webinar
            </h2>
            <p className={`mb-8 max-w-xl mx-auto ${theme === 'dark' ? "text-gray-300" : "text-gray-600"}`}>
              Subscribe to our newsletter and be the first to know about our upcoming events, workshops, and exclusive content.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className={`flex-1 px-5 py-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                }`}
              />
              <button type="submit" className="px-8 py-3 bg-secondary hover:bg-secondary-dark text-white font-semibold rounded-full transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default WebinarsPage;