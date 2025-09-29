import React from 'react';
import { Calendar, MapPin, Building, DollarSign, Users, Globe } from 'lucide-react';
import { InternshipPosition } from '../../services/internshipCreationService';
import { useTheme } from '../../hooks/useTheme';
import { Link } from 'react-router-dom';

interface AdminInternshipCardProps {
  internship: InternshipPosition;
  onEdit: () => void;
  onDelete: () => void;
  onPublish: () => void;
  onClose: () => void;
}

export const AdminInternshipCard: React.FC<AdminInternshipCardProps> = ({
  internship,
  onEdit,
  onDelete,
  onPublish,
  onClose
}) => {
  const { theme } = useTheme();

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Flexible';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    
    switch (status) {
      case 'PUBLISHED':
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
      case 'DRAFT':
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
      case 'CLOSED':
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
      case 'ARCHIVED':
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200`;
    }
  };

  const applicationsCount = internship.applications?.length || 0;

  return (
    <div className={`rounded-lg border ${
      theme === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    } shadow-sm hover:shadow-md transition-shadow`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between mb-2">
          <Link 
            to={`/dashboard/admin-internships/${internship.id}`}
            className={`font-semibold line-clamp-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {internship.title}
          </Link>
          <span className={getStatusBadge(internship.status)}>
            {internship.status}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-sm mb-2">
          <Building size={14} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
            {internship.department}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <MapPin size={14} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
            {internship.isRemote ? 'Remote' : internship.location}
          </span>
          {internship.isRemote && <Globe size={12} className="text-blue-500" />}
        </div>
      </div>

      {/* Details */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Calendar size={14} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
              {formatDate(internship.startDate)} - {formatDate(internship.endDate)}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <DollarSign size={14} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
              {internship.isPaid 
                ? internship.stipendAmount 
                  ? `$${internship.stipendAmount}` 
                  : 'Paid'
                : 'Unpaid'
              }
            </span>
          </div>
        </div>

        {internship.maxApplicants && (
          <div className="flex items-center gap-2 text-sm">
            <Users size={14} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
              {applicationsCount} / {internship.maxApplicants} applicants
            </span>
          </div>
        )}

        <p className={`text-sm line-clamp-3 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {internship.description}
        </p>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-2">
        <Link
          to={`/dashboard/admin-internships/${internship.id}/edit`}
          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Edit
        </Link>
        
        {internship.status === 'DRAFT' && (
          <button
            onClick={onPublish}
            className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Publish
          </button>
        )}
        
        {internship.status === 'PUBLISHED' && (
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
          >
            Close
          </button>
        )}
        
        <button
          onClick={onDelete}
          className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors ml-auto"
        >
          Delete
        </button>
      </div>
    </div>
  );
};