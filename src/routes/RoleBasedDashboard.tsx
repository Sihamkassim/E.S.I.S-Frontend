import React from 'react';
import UserDashboard from '@/pages/portal/UserDashboard';
import { useAuthStore } from '@/store/authStore';
import AdminDashboard from '@/pages/portal/DashboardPage';

const RoleBasedDashboard = () => {
    const { user } = useAuthStore(); // example: { role: 'ADMIN' } or { role: 'USER' }

    if (!user) return <div>Loading...</div>;

    if (user.role === 'ADMIN') return <AdminDashboard />;
    if (user.role === 'USER') return <UserDashboard />;

    return <div>Access Denied</div>;
};

export default RoleBasedDashboard;
