import { Loader2 } from 'lucide-react';
import React, { useEffect, useMemo } from 'react';
import WebinarCard from '../../components/webinar/WebinarCard';
import { useTheme } from '../../hooks/useTheme';
import { useWebinarStore, Webinar } from '../../store/useWebinarstore';

const UserWebinars: React.FC = () => {
  const { theme } = useTheme();
  const { 
    upcomingWebinars, 
    userTickets,
    loading, 
    error, 
    fetchUpcomingWebinars,
    fetchUserTickets,
  } = useWebinarStore();

  const [activeTab, setActiveTab] = React.useState('upcoming');
  const [searchQuery, setSearchQuery] = React.useState('');

  useEffect(() => {
    if (activeTab === 'upcoming') {
      // fetch both so we can show View Ticket button inline
      fetchUpcomingWebinars();
      fetchUserTickets();
    } else if (activeTab === 'registered') {
      fetchUserTickets();
    } else if (activeTab === 'past') {
      fetchUpcomingWebinars(); // reuse to keep list fresh
      fetchUserTickets();
    }
  }, [activeTab, fetchUpcomingWebinars, fetchUserTickets]);

  const registeredWebinars = useMemo(() => {
    return userTickets.map(ticket => ticket.webinar).filter(Boolean) as Webinar[];
  }, [userTickets]);

  const pastWebinars = useMemo(() => {
    return upcomingWebinars.filter(webinar => new Date(webinar.schedule) < new Date());
  }, [upcomingWebinars]);

  const webinarsToDisplay = useMemo(() => {
    let webinars: Webinar[] = [];
    if (activeTab === 'upcoming') {
      webinars = upcomingWebinars.filter(webinar => new Date(webinar.schedule) >= new Date());
    } else if (activeTab === 'registered') {
      webinars = registeredWebinars;
    } else if (activeTab === 'past') {
      webinars = pastWebinars;
    }
    
    return webinars.filter(webinar => 
      webinar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (webinar.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );
  }, [activeTab, upcomingWebinars, registeredWebinars, pastWebinars, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className={`text-lg ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className={`text-2xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Webinars
          </h1>
          <p className={`mt-1 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Browse and register for tech sessions
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search webinars..."
            className={`px-4 py-2 rounded-lg border ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700 text-gray-200' 
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-primary`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'upcoming'
                ? 'border-primary text-primary'
                : `border-transparent ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  } hover:text-gray-700 dark:hover:text-gray-300`
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('registered')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'registered'
                ? 'border-primary text-primary'
                : `border-transparent ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  } hover:text-gray-700 dark:hover:text-gray-300`
            }`}
          >
            Registered
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'past'
                ? 'border-primary text-primary'
                : `border-transparent ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  } hover:text-gray-700 dark:hover:text-gray-300`
            }`}
          >
            Past Webinars
          </button>
        </nav>
      </div>

      {/* Webinars Grid */}
      {webinarsToDisplay.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
          {webinarsToDisplay.map((webinar) => (
              <div key={webinar.id} className="flex justify-center">
                <WebinarCard 
                  webinar={webinar} 
                />
              </div>
            ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className={`text-lg ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {searchQuery ? 'No webinars found matching your search.' : `No ${activeTab} webinars available.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default UserWebinars;