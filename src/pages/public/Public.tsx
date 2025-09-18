import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import WebinarCard from "../../components/webinar/WebinarCard";
import { useTheme } from "../../hooks/useTheme";
import { useWebinarStore } from "../../store/useWebinarstore";

export const PublicPage: React.FC = () => {
  const { upcomingWebinars, fetchUpcomingWebinars, loading, error } = useWebinarStore();
  const { theme } = useTheme();

  // State for pagination
  const [currentPage, setCurrentPage] = useState(0);
  const webinarsPerPage = 3;

  // NEW state for hover effect
  const [hoveredWebinarId, setHoveredWebinarId] = useState<string | null>(null);

  useEffect(() => {
    fetchUpcomingWebinars();
  }, [fetchUpcomingWebinars]);

  // Memoized calculations for pagination
  const paginatedWebinars = useMemo(() => {
    const startIndex = currentPage * webinarsPerPage;
    const endIndex = startIndex + webinarsPerPage;
    return upcomingWebinars.slice(startIndex, endIndex);
  }, [currentPage, upcomingWebinars]);

  const totalPages = Math.ceil(upcomingWebinars.length / webinarsPerPage);

  // Pagination handlers
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  return (
    <Layout>
      <div className={`${theme === 'dark' ? 'text-white' : 'text-text-primary'}`}>
        {/* Hero Section */}
        <section className="relative">
          <div
            className={`py-20 px-8 rounded-lg ${
              theme === "dark"
                ? "bg-gradient-radial from-blue-900 via-gray-900 to-black"
                : "bg-gradient-radial from-blue-200/60 via-white to-white"
            }`}
          >
            <div className="max-w-3xl mx-auto text-center">
              <h1
                className={`text-4xl md:text-5xl font-bold mb-4 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                E.S.I.S Community
              </h1>
              <h2
                className={`text-3xl md:text-4xl font-bold mb-6 ${
                  theme === "dark" ? "text-blue-300" : "text-blue-700"
                }`}
              >
                Building Future Innovation
              </h2>
              <p
                className={`text-xl mb-8 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Join a network of learners, innovators, and professionals driving change
                with technology.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/register"
                  className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-md shadow-md transition duration-200"
                >
                  Register Now
                </Link>
                <Link
                  to="/programs"
                  className="px-6 py-3 bg-blue-700 hover:bg-blue-600 text-white rounded-md shadow-md transition duration-200"
                >
                  Explore Programs
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Webinars Section */}
        <section className={`py-16 px-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="container mx-auto flex flex-col md:flex-row items-center gap-10">
            {/* Left side text and NEW pagination controls */}
            <div className="md:w-1/3 text-center md:text-left">
              <div className="inline-block mb-4">
                <div className={`h-1 w-16 rounded-full bg-secondary-alt mx-auto md:mx-0`} />
              </div>
              <h2 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-text-primary'}`}>
                Upcoming Webinars
              </h2>
              <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-text-secondary'}`}>
                Join our upcoming webinars led by industry experts to expand your knowledge and network with peers.
              </p>

              {/* MOVED & UPDATED Navigation Arrows */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <button 
                    onClick={handlePrevPage}
                    disabled={currentPage === 0}
                    className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full p-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-800 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <span className="text-sm font-medium">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <button 
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages - 1}
                    className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full p-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-800 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Right side - webinars grid */}
            <div className="md:w-2/3">
              {loading ? (
                <p>Loading webinars...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedWebinars.map((webinar) => (
                    <div
                      key={webinar.id}
                      className={`
                        relative
                        transform transition-all duration-300 ease-in-out
                        hover:scale-105 hover:z-10
                      `}
                      onMouseEnter={() => setHoveredWebinarId(webinar.id.toString())}
                      onMouseLeave={() => setHoveredWebinarId(null)}
                    >
                      <WebinarCard webinar={webinar} showDescription={hoveredWebinarId === webinar.id.toString()} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};