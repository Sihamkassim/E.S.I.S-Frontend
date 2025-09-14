import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './dashboard/DashboardLayout';
import DashboardHome from './dashboard/DashboardHome';
import InternshipsList from './dashboard/internships/InternshipsList';
import ApplyForm from './dashboard/internships/ApplyForm';
import MyApplications from './dashboard/internships/MyApplications';
import StartupForm from './dashboard/startups/StartupForm';
import MyStartups from './dashboard/startups/MyStartups';
import WebinarsList from './dashboard/webinars/WebinarsList';
import WebinarApplication from './dashboard/webinars/WebinarApplication';
import MyWebinars from './dashboard/webinars/MyWebinars';
import MembershipManagement from './dashboard/membership/MembershipManagement';
import Invoices from './dashboard/membership/Invoices';
import ProjectsList from './dashboard/projects/ProjectsList';
import SubmitProject from './dashboard/projects/SubmitProject';
import SupportTickets from './dashboard/support/SupportTickets';
import SupportTicketDetail from './dashboard/support/SupportTicketDetail';
import StartupDirectory from './dashboard/startups/StartupDirectory';
import StartupDetail from './dashboard/startups/StartupDetail';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          
          {/* Internships Routes */}
          <Route path="internships" element={<InternshipsList />} />
          <Route path="internships/apply/:id" element={<ApplyForm />} />
          <Route path="internships/my" element={<MyApplications />} />
          
          {/* Startups Routes */}
          <Route path="startups" element={<MyStartups />} />
          <Route path="startups/submit" element={<StartupForm />} />
          <Route path="startups/my" element={<MyStartups />} />
          <Route path="startups/directory" element={<StartupDirectory />} />
          <Route path="startups/:id" element={<StartupDetail />} />
          
          {/* Webinars Routes */}
          <Route path="webinars" element={<WebinarsList />} />
          <Route path="webinars/apply/:id" element={<WebinarApplication />} />
          <Route path="webinars/my" element={<MyWebinars />} />
          
          {/* Membership Routes */}
          <Route path="membership" element={<MembershipManagement />} />
          <Route path="membership/invoices" element={<Invoices />} />
          
          {/* Projects Routes */}
          <Route path="projects" element={<ProjectsList />} />
          <Route path="projects/submit" element={<SubmitProject />} />
          
          {/* Support Routes */}
          <Route path="support" element={<SupportTickets />} />
          <Route path="support/:id" element={<SupportTicketDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}