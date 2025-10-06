import React, { useState, useEffect } from 'react';
import {
    Users, Calendar, DollarSign, FolderKanban, GraduationCap,
    TrendingUp, Award, BookOpen, Rocket, UserCheck, AlertCircle,
    RefreshCw, CheckCircle, Clock, XCircle, Activity
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { api } from '@/services/api';

const COLORS = {
    primary: ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'],
    status: {
        active: '#10B981',
        pending: '#F59E0B',
        rejected: '#EF4444',
        completed: '#3B82F6'
    }
};

interface UserDashboardData {
    overview: {
        totalProjects: number;
        activeProjects: number;
        totalApplications: number;
        acceptedApplications: number;
        totalPayments: number;
        activeMemberships: number;
        upcomingWebinars: number;
        completedWebinars: number;
    };
    projects: {
        status: string;
        count: number;
    }[];
    applications: {
        type: string;
        status: string;
        count: number;
    }[];
    recentActivities: {
        id: number;
        type: string;
        title: string;
        date: string;
        status: string;
    }[];
    monthlyActivity: {
        month: string;
        projects: number;
        applications: number;
    }[];
}

export default function UserDashboard() {
    const [dashboardData, setDashboardData] = useState<UserDashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/user/get-data');
            setDashboardData(response.data);
            setLastUpdated(new Date());
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 300000);
        return () => clearInterval(interval);
    }, []);

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
            case 'approved':
            case 'completed':
                return <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />;
            case 'pending':
            case 'applied':
                return <Clock className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />;
            case 'rejected':
                return <XCircle className="h-4 w-4 text-red-500 dark:text-red-400" />;
            default:
                return <Activity className="h-4 w-4 text-blue-500 dark:text-blue-400" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
            case 'approved':
            case 'completed':
                return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
            case 'pending':
            case 'applied':
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
            case 'rejected':
                return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
            default:
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
        }
    };

    if (loading && !dashboardData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="text-center">
                    <RefreshCw className="h-12 w-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (error && !dashboardData) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-900">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 max-w-md w-full">
                    <AlertCircle className="h-12 w-12 text-red-500 dark:text-red-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 text-center">Connection Error</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-center mb-6">{error}</p>
                    <button
                        onClick={fetchDashboardData}
                        className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Retry Connection
                    </button>
                </div>
            </div>
        );
    }

    const overview = dashboardData?.overview || {};

    return (
        <div className="min-h-screen p-3 sm:p-6 lg:p-8 bg-slate-50 dark:bg-slate-900">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
                            My Dashboard
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">Welcome back! Here's your activity overview</p>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                            Last updated: {lastUpdated.toLocaleTimeString()}
                        </p>
                    </div>
                    <button
                        onClick={fetchDashboardData}
                        disabled={loading}
                        className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2 disabled:opacity-50 text-slate-900 dark:text-white"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        <span>Refresh</span>
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Projects Card */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                                <FolderKanban className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            {overview.totalProjects || 0}
                        </div>
                        <p className="text-base text-slate-600 dark:text-slate-400 mb-3">My Projects</p>
                        <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            {overview.activeProjects || 0} Active
                        </div>
                    </div>

                    {/* Applications Card */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-3 bg-purple-50 dark:bg-purple-900 rounded-lg">
                                <GraduationCap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            {overview.totalApplications || 0}
                        </div>
                        <p className="text-base text-slate-600 dark:text-slate-400 mb-3">Applications</p>
                        <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            {overview.acceptedApplications || 0} Accepted
                        </div>
                    </div>

                    {/* Webinars Card */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-3 bg-green-50 dark:bg-green-900 rounded-lg">
                                <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            {overview.upcomingWebinars || 0}
                        </div>
                        <p className="text-base text-slate-600 dark:text-slate-400 mb-3">Upcoming Webinars</p>
                        <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            {overview.completedWebinars || 0} Completed
                        </div>
                    </div>

                    {/* Membership Card */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-900 rounded-lg">
                                <UserCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            {overview.activeMemberships || 0}
                        </div>
                        <p className="text-base text-slate-600 dark:text-slate-400 mb-3">Active Membership</p>
                        <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Active
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Monthly Activity Chart */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-md border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                                <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Monthly Activity</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={dashboardData?.monthlyActivity || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                <XAxis dataKey="month" stroke="#64748B" style={{ fontSize: '12px' }} />
                                <YAxis stroke="#64748B" style={{ fontSize: '12px' }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#FFF',
                                        border: '1px solid #E2E8F0',
                                        borderRadius: '8px',
                                        fontSize: '12px'
                                    }}
                                />
                                <Legend />
                                <Bar dataKey="projects" fill="#3B82F6" name="Projects" radius={[8, 8, 0, 0]} />
                                <Bar dataKey="applications" fill="#8B5CF6" name="Applications" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Project Status Distribution */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-md border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-3 bg-purple-50 dark:bg-purple-900 rounded-lg">
                                <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Project Status</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={dashboardData?.projects || []}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ status, percent }: any) => `${status}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="count"
                                >
                                    {(dashboardData?.projects || []).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS.primary[index % COLORS.primary.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#FFF',
                                        border: '1px solid #E2E8F0',
                                        borderRadius: '8px',
                                        fontSize: '12px'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-md border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900 rounded-lg">
                            <Activity className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Activities</h3>
                    </div>
                    <div className="space-y-4">
                        {(dashboardData?.recentActivities || []).map((activity) => (
                            <div
                                key={activity.id}
                                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    {getStatusIcon(activity.status)}
                                    <div>
                                        <h4 className="font-semibold text-slate-900 dark:text-white">{activity.title}</h4>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">{activity.type}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                                        {activity.status}
                                    </span>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{new Date(activity.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                        {(!dashboardData?.recentActivities || dashboardData.recentActivities.length === 0) && (
                            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                                No recent activities to display
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}