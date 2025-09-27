import { ChevronDown, ChevronUp, Loader2, Ticket as TicketIcon, User2 } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
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
    clearApplicants,
  } = useWebinarStore();
  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({}); // track expanded rows
  const [sort, setSort] = useState<'latest' | 'oldest'>('latest');

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
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white">Confirmed</Badge>;
      case 'Rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'Applied':
      default:
        return <Badge variant="secondary">Applied</Badge>;
    }
  };

  // Build question map (id -> text) for nicer answer labels
  const questionMap = useMemo(() => {
    const map: Record<string, string> = {};
    webinar?.questions?.forEach(q => { map[q.id] = q.question; });
    return map;
  }, [webinar?.questions]);

  const sortedApplicants = useMemo(() => {
    const arr = [...(webinarApplicants || [])];
    return arr.sort((a,b) => {
      const da = new Date(a.createdAt || 0).getTime();
      const db = new Date(b.createdAt || 0).getTime();
      return sort === 'latest' ? db - da : da - db;
    });
  }, [webinarApplicants, sort]);

  if (!webinar) return null;

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
            <>
            <div className="flex items-center justify-between mb-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">Total:</span>
                <span>{webinarApplicants.length}</span>
                <span className="hidden md:inline text-muted-foreground">(Confirmed {webinarApplicants.filter(a => mapStatus(a.status)==='Confirmed').length})</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant={sort==='latest'? 'default':'secondary'} size="sm" onClick={()=>setSort('latest')}>Latest</Button>
                <Button variant={sort==='oldest'? 'default':'secondary'} size="sm" onClick={()=>setSort('oldest')}>Oldest</Button>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead>Ticket</TableHead>
                  <TableHead className="text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedApplicants.map((app: WebinarApplication) => {
                  const mapped = mapStatus(app.status);
                  const ticketObj = Array.isArray(app.ticket) ? app.ticket[0] : app.ticket || null;
                  const hasTicket = !!ticketObj;
                  const name = app.user?.profile?.firstName || app.user?.profile?.lastName ? `${app.user?.profile?.firstName||''} ${app.user?.profile?.lastName||''}`.trim() : undefined;
                  return (
                    <React.Fragment key={app.id}>
                      <TableRow className={hasTicket ? 'border-l-4 border-l-emerald-500' : ''}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col gap-0.5">
                            <span className="inline-flex items-center gap-1"><User2 className="w-4 h-4"/>{name || app.user?.email || app.userId}</span>
                            {app.user?.email && name && <span className="text-xs text-muted-foreground">{app.user?.email}</span>}
                          </div>
                        </TableCell>
                        <TableCell>{renderStatusBadge(mapped)}</TableCell>
                        <TableCell>{app.createdAt ? new Date(app.createdAt).toLocaleDateString() : '—'}</TableCell>
                        <TableCell>
                          {hasTicket ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                              <TicketIcon className="w-4 h-4"/> Issued
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="ghost" onClick={() => toggleExpand(app.id.toString())} className="flex items-center gap-1">
                            {expanded[app.id] ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
                            {expanded[app.id] ? 'Hide' : 'Info'}
                          </Button>
                        </TableCell>
                      </TableRow>
                      {expanded[app.id] && (
                        <TableRow>
                          <TableCell colSpan={5} className="bg-muted/40 dark:bg-gray-800">
                            <div className="p-3 space-y-2 text-sm">
                              <div className="grid gap-2 md:grid-cols-3">
                                <div><span className="font-medium">User ID:</span> {app.userId}</div>
                                <div><span className="font-medium">Email:</span> {app.user?.email || 'N/A'}</div>
                                {ticketObj && <div><span className="font-medium">Ticket Code:</span> {ticketObj.code}</div>}
                              </div>
                              {app.answers && Object.keys(app.answers).length > 0 && (
                                <div>
                                  <span className="font-medium">Answers:</span>
                                  <ul className="list-disc list-inside mt-1 space-y-0.5">
                                    {Object.entries(app.answers).map(([q, a]) => {
                                      const label = questionMap[q] || questionMap[q.toLowerCase()] || q;
                                      return (
                                        <li key={q}>
                                          <strong>{label}:</strong> {Array.isArray(a) ? a.join(', ') : a}
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </div>
                              )}
                              {!app.answers || Object.keys(app.answers).length === 0 && (
                                <div className="text-xs text-muted-foreground">No questionnaire answers submitted.</div>
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
