import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { internshipCreationService, InternshipPosition } from '../../services/internshipCreationService';
import { Spinner } from '../../components/Spinner';

export const AdminInternshipPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [internship, setInternship] = useState<InternshipPosition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const fetchInternship = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const internshipId = parseInt(id);
        const internshipData = await internshipCreationService.getInternshipById(internshipId);
        setInternship(internshipData);
        setError(null);
      } catch (err) {
        setError('Internship position not found');
        console.error('Error fetching internship:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInternship();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: { color: 'bg-gray-500 text-white', label: 'Draft' },
      PUBLISHED: { color: 'bg-green-500 text-white', label: 'Published' },
      CLOSED: { color: 'bg-red-500 text-white', label: 'Closed' },
      ARCHIVED: { color: 'bg-purple-500 text-white', label: 'Archived' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const handlePublish = async () => {
    if (!internship) return;
    
    try {
      setIsActionLoading(true);
      setActionMessage(null);
      const updatedInternship = await internshipCreationService.publishInternship(internship.id);
      setInternship(updatedInternship);
      setActionMessage({ type: 'success', message: 'Internship published successfully!' });
    } catch (err) {
      setActionMessage({ type: 'error', message: 'Failed to publish internship' });
      console.error('Error publishing internship:', err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleClose = async () => {
    if (!internship) return;
    
    try {
      setIsActionLoading(true);
      setActionMessage(null);
      const updatedInternship = await internshipCreationService.closeInternship(internship.id);
      setInternship(updatedInternship);
      setActionMessage({ type: 'success', message: 'Internship closed successfully!' });
    } catch (err) {
      setActionMessage({ type: 'error', message: 'Failed to close internship' });
      console.error('Error closing internship:', err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!internship) return;
    
    if (!window.confirm('Are you sure you want to delete this internship? This action cannot be undone.')) {
      return;
    }

    try {
      setIsActionLoading(true);
      setActionMessage(null);
      await internshipCreationService.deleteInternship(internship.id);
      setActionMessage({ type: 'success', message: 'Internship deleted successfully!' });
      
      // Redirect to internships list after a short delay
      setTimeout(() => {
        navigate('/dashboard/admin-internships');
      }, 1500);
    } catch (err) {
      setActionMessage({ type: 'error', message: 'Failed to delete internship' });
      console.error('Error deleting internship:', err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleEdit = () => {
    if (!internship) return;
    navigate(`/dashboard/admin-internships/${internship.id}/edit`);
  };

  // Clear action message after 5 seconds
  useEffect(() => {
    if (actionMessage) {
      const timer = setTimeout(() => {
        setActionMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [actionMessage]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !internship) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Internship Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {error || 'The internship position you are looking for does not exist.'}
          </p>
          <Link
            to="/dashboard/admin-internships"
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            Back to Internships
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Action Message */}
        {actionMessage && (
          <div className={`mb-6 p-4 rounded-md ${
            actionMessage.type === 'success' 
              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
          }`}>
            {actionMessage.message}
          </div>
        )}

        {/* Back Button */}
        <div className='mb-8'>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-4 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            ← Back to Internships
          </button>
        </div>

        {/* Internship Header */}
        <header className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              {internship.title}
            </h1>
            {getStatusBadge(internship.status)}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300 mb-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Department:</span>
                <span>{internship.department}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Location:</span>
                <span>{internship.location}</span>
                {internship.isRemote && (
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                    Remote
                  </span>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Compensation:</span>
                <span>
                  {internship.isPaid 
                    ? internship.stipendAmount 
                      ? `$${internship.stipendAmount}/month` 
                      : 'Paid (Amount not specified)'
                    : 'Unpaid'
                  }
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Max Applicants:</span>
                <span>{internship.maxApplicants || 'Not specified'}</span>
              </div>
            </div>
          </div>

          {/* Date Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300 border-t dark:border-gray-700 pt-4">
            <div>
              <span className="font-semibold">Start Date:</span>{' '}
              {internship.startDate ? formatDate(internship.startDate) : 'To be determined'}
            </div>
            <div>
              <span className="font-semibold">End Date:</span>{' '}
              {internship.endDate ? formatDate(internship.endDate) : 'To be determined'}
            </div>
          </div>
        </header>

        {/* Admin Action Buttons */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Admin Actions</h2>
          <div className="flex flex-wrap gap-4">
            {/* Edit Button - Always visible */}
            <button
              onClick={handleEdit}
              disabled={isActionLoading}
              className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Edit Internship
            </button>

            {/* Publish Button - Only for DRAFT status */}
            {internship.status === 'DRAFT' && (
              <button
                onClick={handlePublish}
                disabled={isActionLoading}
                className="px-6 py-3 bg-green-600 dark:bg-green-500 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isActionLoading ? 'Publishing...' : 'Publish Internship'}
              </button>
            )}

            {/* Close Button - Only for PUBLISHED status */}
            {internship.status === 'PUBLISHED' && (
              <button
                onClick={handleClose}
                disabled={isActionLoading}
                className="px-6 py-3 bg-orange-600 dark:bg-orange-500 text-white rounded-md hover:bg-orange-700 dark:hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isActionLoading ? 'Closing...' : 'Close Internship'}
              </button>
            )}

            {/* Delete Button - Always visible but with warning for published/closed internships */}
            <button
              onClick={handleDelete}
              disabled={isActionLoading}
              className={`px-6 py-3 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                internship.status === 'PUBLISHED' || internship.status === 'CLOSED'
                  ? 'bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-600'
                  : 'bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-600'
              }`}
            >
              {isActionLoading ? 'Deleting...' : 'Delete Internship'}
            </button>
          </div>
          
          {/* Warning for deleting published/closed internships */}
          {(internship.status === 'PUBLISHED' || internship.status === 'CLOSED') && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-3">
              Warning: This internship is {internship.status.toLowerCase()}. Deleting it may affect existing applications.
            </p>
          )}
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Description */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Position Description</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {internship.description}
              </p>
            </div>
          </section>

          {/* Responsibilities */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Key Responsibilities</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {internship.responsibilities}
              </p>
            </div>
          </section>

          {/* Requirements */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Requirements</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {internship.requirements}
              </p>
            </div>
          </section>

          {/* Application Information */}
          {internship.applications && internship.applications.length > 0 && (
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Applications ({internship.applications.length})
              </h2>
              <div className="space-y-2">
                {internship.applications.map((application) => (
                  <div key={application.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="text-gray-700 dark:text-gray-300">Application #{application.id}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      application.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      application.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      application.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {application.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Metadata */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Position Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
              <div>
                <span className="font-semibold">Created:</span>{' '}
                {formatDate(internship.createdAt)}
              </div>
              <div>
                <span className="font-semibold">Last Updated:</span>{' '}
                {formatDate(internship.updatedAt)}
              </div>
              <div>
                <span className="font-semibold">Position ID:</span>{' '}
                {internship.id}
              </div>
              <div>
                <span className="font-semibold">Status:</span>{' '}
                {internship.status}
              </div>
            </div>
          </section>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-wrap gap-4 mt-8">
          <Link
            to="/dashboard/admin-internships"
            className="px-6 py-3 bg-gray-600 dark:bg-gray-700 text-white rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          >
            View All Internships
          </Link>
        </div>
      </div>
    </div>
  );
};