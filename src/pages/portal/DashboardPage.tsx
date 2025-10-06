import React, { useState, useEffect } from 'react';
import {
  Users, Calendar, DollarSign, FolderKanban, GraduationCap,
  TrendingUp, Eye, EyeOff, Building2, Award, BookOpen,
  Rocket, UserCheck, AlertCircle, RefreshCw, Download
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { api } from '@/services/api';

const COLORS = {
  primary: ['#3B82F6', '#8B5CF6', '#EC4899'],
  gradient: ['#0EA5E9', '#8B5CF6', '#EC4899', '#F59E0B']
};

interface HiddenStates {
  payments: boolean;
  memberships: boolean;
  users: boolean;
}

interface Summary {
  totalUsers?: number;
  userGrowthRate?: number;
  totalMemberships?: number;
  membershipGrowthRate?: number;
  activeWebinars?: number;
  webinarGrowthRate?: number;
  totalPayments?: number;
  startups?: number;
  projects?: number;
  internships?: number;
  totalCourses?: number;
}

interface ChartDataPoint {
  month?: string;
  users?: number;
}

interface MembershipDistribution {
  type: string;
  count: number;
}

interface ChartData {
  userGrowth?: ChartDataPoint[];
  membershipDistribution?: MembershipDistribution[];
}

interface DashboardData {
  summary?: Summary;
  chartData?: ChartData;
}

export default function AdminDashboard() {
  const [hiddenStates, setHiddenStates] = useState<HiddenStates>({
    payments: false,
    memberships: false,
    users: false
  });

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/dashboard/summary');
      if (!response.data) throw new Error('Failed to fetch dashboard data');
      const data = response.data;
      setDashboardData(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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

  const toggleVisibility = (cardType: keyof HiddenStates) => {
    setHiddenStates(prev => ({ ...prev, [cardType]: !prev[cardType] }));
  };

  const formatValue = (value: number | undefined, isHidden: boolean): string => {
    if (isHidden) return '****';
    return value?.toLocaleString() || '0';
  };

  const handleExportReport = async () => {
    try {
      const response = await api.get('/dashboard/export');
      // Handle the export response - adjust based on your API's response format
      console.log('Export initiated:', response);
    } catch (err) {
      console.error('Error exporting report:', err);
    }
  };

  if (loading && !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 text-lg font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2 text-center">Connection Error</h3>
          <p className="text-slate-600 text-center mb-6">{error}</p>
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

  const summary: Summary = dashboardData?.summary || {};
  const chartData: ChartData = dashboardData?.chartData || {};

  return (
    <div className="min-h-screen p-3 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">
              ESIS Dashboard
            </h1>
            <p className="text-slate-600 mt-1">Ethiopian Startup Innovation System</p>
            <p className="text-xs text-slate-500 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={handleExportReport}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Users Card */}
          <div className="bg-white rounded-xl p-8 shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <button onClick={() => toggleVisibility('users')} className="p-1.5 hover:bg-slate-100 rounded">
                {hiddenStates.users ? <EyeOff className="h-5 w-5 text-slate-400" /> : <Eye className="h-5 w-5 text-slate-400" />}
              </button>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">
              {formatValue(summary.totalUsers, hiddenStates.users)}
            </div>
            <p className="text-base text-slate-600 mb-3">Total Users</p>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              +{summary.userGrowthRate || 0}%
            </div>
          </div>

          {/* Memberships Card */}
          <div className="bg-white rounded-xl p-8 shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-purple-50 rounded-lg">
                <UserCheck className="h-6 w-6 text-purple-600" />
              </div>
              <button onClick={() => toggleVisibility('memberships')} className="p-1.5 hover:bg-slate-100 rounded">
                {hiddenStates.memberships ? <EyeOff className="h-5 w-5 text-slate-400" /> : <Eye className="h-5 w-5 text-slate-400" />}
              </button>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">
              {formatValue(summary.totalMemberships, hiddenStates.memberships)}
            </div>
            <p className="text-base text-slate-600 mb-3">Memberships</p>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              +{summary.membershipGrowthRate || 0}%
            </div>
          </div>

          {/* Webinars Card */}
          <div className="bg-white rounded-xl p-8 shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-green-50 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">
              {summary.activeWebinars || 0}
            </div>
            <p className="text-base text-slate-600 mb-3">Active Webinars</p>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              +{summary.webinarGrowthRate || 0}%
            </div>
          </div>

          {/* Revenue Card */}
          <div className="bg-white rounded-xl p-8 shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-emerald-50 rounded-lg">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
              <button onClick={() => toggleVisibility('payments')} className="p-1.5 hover:bg-slate-100 rounded">
                {hiddenStates.payments ? <EyeOff className="h-5 w-5 text-slate-400" /> : <Eye className="h-5 w-5 text-slate-400" />}
              </button>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">
              ${formatValue(summary.totalPayments, hiddenStates.payments)}
            </div>
            <p className="text-base text-slate-600 mb-3">Total Revenue</p>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              +18.2%
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-cyan-50 rounded-lg">
                <Rocket className="h-6 w-6 text-cyan-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{summary.startups || 0}</div>
                <p className="text-sm text-slate-600">Startups</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-pink-50 rounded-lg">
                <FolderKanban className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{summary.projects || 0}</div>
                <p className="text-sm text-slate-600">Projects</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-50 rounded-lg">
                <GraduationCap className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{summary.internships || 0}</div>
                <p className="text-sm text-slate-600">Internships</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-50 rounded-lg">
                <BookOpen className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{summary.totalCourses || 0}</div>
                <p className="text-sm text-slate-600">Courses</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth Chart */}
          <div className="bg-white rounded-xl p-8 shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-3 bg-blue-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">User Growth</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData.userGrowth || []}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Membership Distribution */}
          <div className="bg-white rounded-xl p-8 shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-3 bg-purple-50 rounded-lg">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Membership Distribution</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.membershipDistribution || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percent }: { type: string; percent: number }) => `${type}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {(chartData.membershipDistribution || []).map((entry, index) => (
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

        {/* Revenue Overview */}
        <div className="bg-white rounded-xl p-8 shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2 mb-8">
            <div className="p-3 bg-emerald-50 rounded-lg">
              <Building2 className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Revenue Overview</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl text-white shadow-md">
              <div className="flex items-center justify-between mb-3">
                <DollarSign className="h-7 w-7" />
                <button onClick={() => toggleVisibility('payments')} className="p-2 hover:bg-white/20 rounded">
                  {hiddenStates.payments ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <div className="text-4xl font-bold mb-2">
                ${formatValue(summary.totalPayments, hiddenStates.payments)}
              </div>
              <p className="text-emerald-100 text-base">Total Revenue</p>
            </div>

            <div className="p-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white shadow-md">
              <UserCheck className="h-7 w-7 mb-3" />
              <div className="text-4xl font-bold mb-2">
                {formatValue(summary.totalMemberships, hiddenStates.memberships)}
              </div>
              <p className="text-blue-100 text-base">Active Members</p>
            </div>

            <div className="p-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl text-white shadow-md">
              <TrendingUp className="h-7 w-7 mb-3" />
              <div className="text-4xl font-bold mb-2">24.5%</div>
              <p className="text-purple-100 text-base">Growth Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}