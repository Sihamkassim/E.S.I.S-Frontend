import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useWebinarStore, Webinar, WebinarApplication } from '../../store/useWebinarstore';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface ViewApplicantsModalProps {
  webinar: Webinar | null;
  isOpen: boolean;
  onClose: () => void;
}

const ViewApplicantsModal: React.FC<ViewApplicantsModalProps> = ({ webinar, isOpen, onClose }) => {
  const { theme } = useTheme();
  const { 
    webinarApplicants, 
    error, 
    fetchApplicantsForWebinar,
    approveApplication,
    rejectApplication,
    clearApplicants,
  } = useWebinarStore();
  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({}); // track expanded rows

  const handleApprove = async (applicationId: string) => {
    setIsLoading(true);
    await approveApplication(applicationId);
    setIsLoading(false);
  };

  const handleReject = async (applicationId: string) => {
    setIsLoading(true);
    await rejectApplication(applicationId);
    setIsLoading(false);
  };

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    if (isOpen && webinar) {
      const loadApplicants = async () => {
        setIsLoading(true);
        await fetchApplicantsForWebinar(webinar.id.toString());
        setIsLoading(false);
      };
      loadApplicants();
    } else {
      clearApplicants();
      setExpanded({});
    }
  }, [isOpen, webinar, fetchApplicantsForWebinar, clearApplicants]);

  if (!webinar) return null;

  const renderStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Approved</Badge>;
      case 'rejected': return <Badge variant="destructive">Rejected</Badge>;
      case 'pending':
      default: return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl w-[90vw] rounded-lg">
        <DialogHeader>
          <DialogTitle>Applicants for "{webinar.title}"</DialogTitle>
          <DialogDescription>
            Here are the applicants for this webinar.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-[70vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <p className={`text-center ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
              Error: {error}
            </p>
          ) : (webinarApplicants || []).length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied On</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(webinarApplicants || []).map((app: WebinarApplication) => (
                  <React.Fragment key={app.id}>
                    <TableRow>
                      <TableCell className="font-medium">{app.userId}</TableCell>
                      <TableCell>{renderStatusBadge(app.status)}</TableCell>
                      <TableCell>{app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
                      <TableCell className="text-right flex gap-2 justify-end">
                        {app.status.toLowerCase() === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                              onClick={() => handleApprove(app.id)}
                              disabled={isLoading}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                              onClick={() => handleReject(app.id)}
                              disabled={isLoading}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => toggleExpand(app.id)}>
                          {expanded[app.id] ? "Hide Info" : "More Info"}
                        </Button>
                      </TableCell>
                    </TableRow>

                    {expanded[app.id] && (
  <TableRow>
    <TableCell colSpan={4} className="bg-gray-50 dark:bg-gray-800">
      <div className="p-2 space-y-1">
        <p><strong>User ID:</strong> {app.userId}</p>
        <p><strong>Email:</strong> {app.user?.email || 'N/A'}</p>
        {app.answers && Object.keys(app.answers).length > 0 && (
          <div>
            <strong>Answers:</strong>
            <ul className="list-disc list-inside">
              {Object.entries(app.answers).map(([q, a]) => (
                <li key={q}>
                  <strong>{q}:</strong> {Array.isArray(a) ? a.join(", ") : a}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </TableCell>
  </TableRow>
)}

                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No applicants yet.
            </p>
          )}
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewApplicantsModal;
