import { ChevronDown, ChevronUp, Loader2, Ticket as TicketIcon, User2 } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useWebinarStore, Webinar, WebinarApplication } from '../../store/useWebinarstore';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { api } from '@/services/api';

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
    clearApplicants,
  } = useWebinarStore();
  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [sort, setSort] = useState<'latest' | 'oldest'>('latest');
  const [updatingStatus, setUpdatingStatus] = useState<Record<string, boolean>>({});

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

  // Map legacy statuses to simplified set
  const mapStatus = (status: string) => {
    const lower = status.toLowerCase();
    if (['approved', 'confirmed', 'paid'].includes(lower)) return 'Confirmed';
    if (['rejected', 'cancelled'].includes(lower)) return 'Rejected';
    return 'Applied';
  };

  const renderStatusBadge = (status: string) => {
    const mapped = mapStatus(status);
    switch (mapped) {
      case 'Confirmed':
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0">Confirmed</Badge>;
      case 'Rejected':
        return <Badge variant="destructive" className="border-0">Rejected</Badge>;
      case 'Applied':
      default:
        return <Badge variant="secondary" className="border-0">Applied</Badge>;
    }
  };

  // Handle status update
  const handleStatusUpdate = async (applicationId: string, newStatus: 'Approved' | 'Rejected') => {
    setUpdatingStatus(prev => ({ ...prev, [applicationId]: true }));

    try {
      const result = await api.patch(`/admin/update-webinar-status/${webinar?.id}`, { newStatus })
      if (webinar) {
        await fetchApplicantsForWebinar(webinar.id.toString());
      }
    } catch (error) {
      console.error('Failed to update application status:', error);
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [applicationId]: false }));
    }
  };

  // Parse answers from the nested structure
  const parseAnswers = (answers: any) => {
    if (!answers) return [];

    return Object.entries(answers).map(([key, value]: [string, any]) => {
      // Handle both nested structure and simple structure
      if (value && typeof value === 'object' && 'question' in value && 'answer' in value) {
        return {
          question: value.question,
          answer: value.answer,
          type: value.type || 'text'
        };
      } else {
        // Fallback for simple key-value structure
        return {
          question: key,
          answer: value,
          type: 'text'
        };
      }
    });
  };

  const sortedApplicants = useMemo(() => {
    const arr = [...(webinarApplicants || [])];
    return arr.sort((a, b) => {
      const da = new Date(a.createdAt || 0).getTime();
      const db = new Date(b.createdAt || 0).getTime();
      return sort === 'latest' ? db - da : da - db;
    });
  }, [webinarApplicants, sort]);

  if (!webinar) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl w-[95vw] rounded-lg bg-background text-foreground border border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Applicants for "{webinar.title}"</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Manage applications and review questionnaire answers
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
            <>
              <div className="flex items-center justify-between mb-4 text-sm">
                <div className="flex items-center gap-2 text-foreground">
                  <span className="font-medium">Total:</span>
                  <span>{webinarApplicants.length}</span>
                  <span className="hidden md:inline text-muted-foreground">
                    (Confirmed: {webinarApplicants.filter(a => mapStatus(a.status) === 'Confirmed').length})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={sort === 'latest' ? 'default' : 'secondary'}
                    size="sm"
                    onClick={() => setSort('latest')}
                  >
                    Latest
                  </Button>
                  <Button
                    variant={sort === 'oldest' ? 'default' : 'secondary'}
                    size="sm"
                    onClick={() => setSort('oldest')}
                  >
                    Oldest
                  </Button>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-foreground font-medium">User</TableHead>
                    <TableHead className="text-foreground font-medium">Status</TableHead>
                    <TableHead className="text-foreground font-medium">Applied</TableHead>
                    <TableHead className="text-foreground font-medium">Ticket</TableHead>
                    <TableHead className="text-right text-foreground font-medium">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedApplicants.map((app: WebinarApplication) => {
                    const currentStatus = mapStatus(app.status);
                    const ticketObj = Array.isArray(app.ticket) ? app.ticket[0] : app.ticket || null;
                    const hasTicket = !!ticketObj;
                    const name = app.user?.profile?.firstName || app.user?.profile?.lastName
                      ? `${app.user?.profile?.firstName || ''} ${app.user?.profile?.lastName || ''}`.trim()
                      : app.user?.profile?.name || undefined;

                    const answers = parseAnswers(app.answers);

                    return (
                      <React.Fragment key={app.id}>
                        <TableRow
                          className={`
                            border-border 
                            hover:bg-muted/50 
                            transition-colors
                            ${hasTicket ? 'border-l-4 border-l-emerald-500 dark:border-l-emerald-400' : ''}
                          `}
                        >
                          <TableCell className="font-medium text-foreground">
                            <div className="flex flex-col gap-0.5">
                              <span className="inline-flex items-center gap-1">
                                <User2 className="w-4 h-4 text-muted-foreground" />
                                {name || app.user?.email || app.userId}
                              </span>
                              {app.user?.email && name && (
                                <span className="text-xs text-muted-foreground">{app.user?.email}</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{renderStatusBadge(currentStatus)}</TableCell>
                          <TableCell className="text-foreground">
                            {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : '—'}
                          </TableCell>
                          <TableCell>
                            {hasTicket ? (
                              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                                <TicketIcon className="w-4 h-4" /> Issued
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              {currentStatus === 'Applied' && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="default"
                                    disabled={updatingStatus[app.id]}
                                    onClick={() => handleStatusUpdate(app.id.toString(), 'Approved')}
                                    className="h-8 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white border-0"
                                  >
                                    {updatingStatus[app.id] ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                      'Accept'
                                    )}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    disabled={updatingStatus[app.id]}
                                    onClick={() => handleStatusUpdate(app.id.toString(), 'Rejected')}
                                    className="h-8 px-3 text-xs border-0"
                                  >
                                    {updatingStatus[app.id] ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                      'Reject'
                                    )}
                                  </Button>
                                </>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleExpand(app.id.toString())}
                                className="flex items-center gap-1 h-8 text-foreground hover:bg-muted"
                              >
                                {expanded[app.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                {expanded[app.id] ? 'Hide' : 'Details'}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        {expanded[app.id] && (
                          <TableRow>
                            <TableCell colSpan={5} className="bg-muted/40 dark:bg-muted/20 p-0 border-border">
                              <div className="p-4 space-y-4">
                                {/* User Information */}
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                  <div>
                                    <span className="font-medium text-sm text-foreground">User ID:</span>
                                    <p className="text-sm mt-1 text-foreground">{app.userId}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium text-sm text-foreground">Email:</span>
                                    <p className="text-sm mt-1 text-foreground">{app.user?.email || 'N/A'}</p>
                                  </div>
                                  {ticketObj && (
                                    <div>
                                      <span className="font-medium text-sm text-foreground">Ticket Code:</span>
                                      <p className="text-sm mt-1 font-mono text-foreground">{ticketObj.code}</p>
                                    </div>
                                  )}
                                  {app.user?.profile?.phone && (
                                    <div>
                                      <span className="font-medium text-sm text-foreground">Phone:</span>
                                      <p className="text-sm mt-1 text-foreground">{app.user.profile?.phone}</p>
                                    </div>
                                  )}
                                </div>

                                {/* Questionnaire Answers */}
                                {answers.length > 0 ? (
                                  <div>
                                    <h4 className="font-medium text-sm mb-3 text-foreground">Questionnaire Answers:</h4>
                                    <div className="space-y-3">
                                      {answers.map((item, index) => (
                                        <div
                                          key={index}
                                          className="border border-border rounded-lg p-3 bg-background dark:bg-card hover:bg-muted/30 transition-colors"
                                        >
                                          <div className="font-medium text-sm mb-1 text-foreground">
                                            {item.question || `Question ${index + 1}`}
                                          </div>
                                          <div className="text-sm text-muted-foreground">
                                            {item.type === 'multiple-choice' ? (
                                              <span className="bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                                {item.answer}
                                              </span>
                                            ) : (
                                              <span className="text-foreground/80">{item.answer}</span>
                                            )}
                                          </div>
                                          {item.type && (
                                            <div className="text-xs text-muted-foreground mt-1">
                                              Type: {item.type}
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-center text-muted-foreground text-sm py-4">
                                    No questionnaire answers submitted.
                                  </div>
                                )}

                                {/* Status Actions */}
                                {currentStatus !== 'Applied' && (
                                  <div className="flex items-center gap-2 pt-2">
                                    <span className="font-medium text-sm text-foreground">Update Status:</span>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      disabled={updatingStatus[app.id] || currentStatus === 'Confirmed'}
                                      onClick={() => handleStatusUpdate(app.id.toString(), 'Approved')}
                                      className="h-7 px-2 text-xs border-border text-foreground hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:text-emerald-700 dark:hover:text-emerald-300"
                                    >
                                      {updatingStatus[app.id] ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                      ) : (
                                        'Accept'
                                      )}
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      disabled={updatingStatus[app.id] || currentStatus === 'Rejected'}
                                      onClick={() => handleStatusUpdate(app.id.toString(), 'Rejected')}
                                      className="h-7 px-2 text-xs border-border text-foreground hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-700 dark:hover:text-red-300"
                                    >
                                      {updatingStatus[app.id] ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                      ) : (
                                        'Reject'
                                      )}
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No applicants yet.
            </p>
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={onClose}
            variant="outline"
            className="border-border text-foreground hover:bg-muted"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewApplicantsModal;