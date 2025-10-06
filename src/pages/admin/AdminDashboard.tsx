// import React, { useState, useEffect } from 'react';
// import {
//   Users, Calendar, DollarSign, Briefcase,
//   FolderKanban, GraduationCap, TrendingUp,
//   Activity, Eye, EyeOff, Building2, Target,
//   Award, BookOpen, Rocket, UserCheck, AlertCircle,
//   RefreshCw, Download
// } from 'lucide-react';
// import { api } from '@/services/api';

// // Define types for our data
// interface DashboardSummary {
//   totalUsers: number;
//   totalMemberships: number;
//   activeWebinars: number;
//   totalCourses: number;
//   totalPayments: number;
//   startups: number;
//   projects: number;
//   internships: number;
//   userGrowthRate: string;
//   membershipGrowthRate: string;
//   webinarGrowthRate: string;
//   courseGrowthRate: string;
// }

// interface UserGrowthData {
//   month: string;
//   users: number;
// }

// interface MembershipDistribution {
//   type: string;
//   count: number;
// }

// interface ChartData {
//   userGrowth: UserGrowthData[];
//   membershipDistribution: MembershipDistribution[];
// }

// interface DashboardData {
//   summary: DashboardSummary;
//   chartData: ChartData;
// }

// interface HiddenStates {
//   payments: boolean;
//   memberships: boolean;
//   users: boolean;
// }

// export default function AdminDashboard() {
//   const [hiddenStates, setHiddenStates] = useState<HiddenStates>({
//     payments: false,
//     memberships: false,
//     users: false
//   });

//   const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [lastUpdated, setLastUpdated] = useState(new Date());

//   const fetchDashboardData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await api.get('/dashboard/summary');
//       // Assuming your api.get returns the data directly, if it returns response.data, adjust accordingly
//       const data = response.data || response;
//       setDashboardData(data);
//       setLastUpdated(new Date());
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard data';
//       setError(errorMessage);
//       console.error('Error fetching dashboard data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//     const interval = setInterval(fetchDashboardData, 300000); // Refresh every 5 minutes
//     return () => clearInterval(interval);
//   }, []);

//   const toggleVisibility = (cardType: keyof HiddenStates) => {
//     setHiddenStates(prev => ({
//       ...prev,
//       [cardType]: !prev[cardType]
//     }));
//   };

//   const formatValue = (value: number | undefined, isHidden: boolean): string => {
//     if (isHidden) return '****';
//     if (value === undefined || value === null) return '0';
//     return value.toLocaleString();
//   };

//   const handleExportReport = async () => {
//     try {
//       const response = await api.get('/dashboard/export-report', {
//         responseType: 'blob' // Important for file downloads
//       });

//       const blob = new Blob([response.data], { type: 'application/pdf' });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `ESIS-Report-${new Date().toISOString().split('T')[0]}.pdf`;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       console.error('Error exporting report:', err);
//       alert('Failed to export report. Please try again.');
//     }
//   };

//   if (loading && !dashboardData) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
//         <div className="text-center">
//           <RefreshCw className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
//           <p className="text-gray-600 text-lg font-medium">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error && !dashboardData) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
//         <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-red-100">
//           <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
//           <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Connection Error</h3>
//           <p className="text-gray-600 text-center mb-6">{error}</p>
//           <button
//             onClick={fetchDashboardData}
//             className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2"
//           >
//             <RefreshCw className="h-4 w-4" />
//             Retry Connection
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const summary = dashboardData?.summary || {
//     totalUsers: 0,
//     totalMemberships: 0,
//     activeWebinars: 0,
//     totalCourses: 0,
//     totalPayments: 0,
//     startups: 0,
//     projects: 0,
//     internships: 0,
//     userGrowthRate: '0',
//     membershipGrowthRate: '0',
//     webinarGrowthRate: '0',
//     courseGrowthRate: '0'
//   };

//   const chartData = dashboardData?.chartData || {
//     userGrowth: [],
//     membershipDistribution: []
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto space-y-8">
//         {/* Header */}
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//           <div>
//             <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
//               ESIS Dashboard
//             </h1>
//             <p className="text-gray-600 mt-1 font-medium">Ethiopian Startup Innovation System</p>
//             <p className="text-xs text-gray-500 mt-1">
//               Last updated: {lastUpdated.toLocaleTimeString()}
//             </p>
//           </div>
//           <div className="flex items-center gap-3">
//             <button
//               onClick={fetchDashboardData}
//               disabled={loading}
//               className="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm font-semibold hover:border-blue-400 hover:shadow-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
//             >
//               <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
//               Refresh
//             </button>
//             <button
//               onClick={handleExportReport}
//               className="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm font-semibold hover:border-purple-400 hover:shadow-lg transition-all duration-300 flex items-center gap-2"
//             >
//               <Download className="h-4 w-4" />
//               Export
//             </button>
//             <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300">
//               Add Member
//             </button>
//           </div>
//         </div>

//         {/* Primary Metrics */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {/* Total Users */}
//           <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-6 shadow-2xl hover:shadow-blue-500/50 transition-all duration-500 hover:scale-105 cursor-pointer">
//             <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//             <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-bl-full" />
//             <div className="relative z-10">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
//                   <Users className="h-7 w-7 text-white" />
//                 </div>
//                 <button
//                   onClick={() => toggleVisibility('users')}
//                   className="p-2 hover:bg-white/20 rounded-xl transition-colors"
//                 >
//                   {hiddenStates.users ? (
//                     <EyeOff className="h-5 w-5 text-white" />
//                   ) : (
//                     <Eye className="h-5 w-5 text-white" />
//                   )}
//                 </button>
//               </div>
//               <div className="text-4xl font-black text-white mb-2">
//                 {formatValue(summary.totalUsers, hiddenStates.users)}
//               </div>
//               <p className="text-blue-100 text-sm font-semibold mb-3">Total Users</p>
//               <div className="flex items-center text-sm text-blue-100 font-medium">
//                 <TrendingUp className="h-4 w-4 mr-1.5" />
//                 +{summary.userGrowthRate}% growth
//               </div>
//             </div>
//           </div>

//           {/* Memberships */}
//           <div className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-700 rounded-3xl p-6 shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 hover:scale-105 cursor-pointer">
//             <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//             <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-bl-full" />
//             <div className="relative z-10">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
//                   <UserCheck className="h-7 w-7 text-white" />
//                 </div>
//                 <button
//                   onClick={() => toggleVisibility('memberships')}
//                   className="p-2 hover:bg-white/20 rounded-xl transition-colors"
//                 >
//                   {hiddenStates.memberships ? (
//                     <EyeOff className="h-5 w-5 text-white" />
//                   ) : (
//                     <Eye className="h-5 w-5 text-white" />
//                   )}
//                 </button>
//               </div>
//               <div className="text-4xl font-black text-white mb-2">
//                 {formatValue(summary.totalMemberships, hiddenStates.memberships)}
//               </div>
//               <p className="text-purple-100 text-sm font-semibold mb-3">Active Memberships</p>
//               <div className="flex items-center text-sm text-purple-100 font-medium">
//                 <TrendingUp className="h-4 w-4 mr-1.5" />
//                 +{summary.membershipGrowthRate}% growth
//               </div>
//             </div>
//           </div>

//           {/* Webinars */}
//           <div className="group relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-700 rounded-3xl p-6 shadow-2xl hover:shadow-green-500/50 transition-all duration-500 hover:scale-105 cursor-pointer">
//             <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//             <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-bl-full" />
//             <div className="relative z-10">
//               <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 w-fit mb-4">
//                 <Calendar className="h-7 w-7 text-white" />
//               </div>
//               <div className="text-4xl font-black text-white mb-2">
//                 {summary.activeWebinars}
//               </div>
//               <p className="text-green-100 text-sm font-semibold mb-3">Active Webinars</p>
//               <div className="flex items-center text-sm text-green-100 font-medium">
//                 <TrendingUp className="h-4 w-4 mr-1.5" />
//                 +{summary.webinarGrowthRate}% growth
//               </div>
//             </div>
//           </div>

//           {/* Courses */}
//           <div className="group relative overflow-hidden bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-6 shadow-2xl hover:shadow-orange-500/50 transition-all duration-500 hover:scale-105 cursor-pointer">
//             <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//             <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-bl-full" />
//             <div className="relative z-10">
//               <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 w-fit mb-4">
//                 <BookOpen className="h-7 w-7 text-white" />
//               </div>
//               <div className="text-4xl font-black text-white mb-2">
//                 {summary.totalCourses}
//               </div>
//               <p className="text-orange-100 text-sm font-semibold mb-3">Total Courses</p>
//               <div className="flex items-center text-sm text-orange-100 font-medium">
//                 <TrendingUp className="h-4 w-4 mr-1.5" />
//                 +{summary.courseGrowthRate}% growth
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Secondary Metrics */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-cyan-100 hover:border-cyan-300 hover:scale-105">
//             <div className="flex items-center gap-4">
//               <div className="p-4 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-2xl shadow-lg">
//                 <Rocket className="h-7 w-7 text-white" />
//               </div>
//               <div>
//                 <div className="text-3xl font-black text-gray-900">
//                   {summary.startups}
//                 </div>
//                 <p className="text-sm text-gray-600 font-semibold">Registered Startups</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-pink-100 hover:border-pink-300 hover:scale-105">
//             <div className="flex items-center gap-4">
//               <div className="p-4 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl shadow-lg">
//                 <FolderKanban className="h-7 w-7 text-white" />
//               </div>
//               <div>
//                 <div className="text-3xl font-black text-gray-900">
//                   {summary.projects}
//                 </div>
//                 <p className="text-sm text-gray-600 font-semibold">Active Projects</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-indigo-100 hover:border-indigo-300 hover:scale-105">
//             <div className="flex items-center gap-4">
//               <div className="p-4 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl shadow-lg">
//                 <GraduationCap className="h-7 w-7 text-white" />
//               </div>
//               <div>
//                 <div className="text-3xl font-black text-gray-900">
//                   {summary.internships}
//                 </div>
//                 <p className="text-sm text-gray-600 font-semibold">Internships</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-teal-100 hover:border-teal-300 hover:scale-105">
//             <div className="flex items-center gap-4">
//               <div className="p-4 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl shadow-lg">
//                 <DollarSign className="h-7 w-7 text-white" />
//               </div>
//               <div className="flex-1">
//                 <div className="flex items-center justify-between">
//                   <div className="text-3xl font-black text-gray-900">
//                     ${formatValue(summary.totalPayments, hiddenStates.payments)}
//                   </div>
//                   <button
//                     onClick={() => toggleVisibility('payments')}
//                     className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
//                   >
//                     {hiddenStates.payments ? (
//                       <EyeOff className="h-4 w-4 text-gray-500" />
//                     ) : (
//                       <Eye className="h-4 w-4 text-gray-500" />
//                     )}
//                   </button>
//                 </div>
//                 <p className="text-sm text-gray-600 font-semibold">Revenue</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Charts Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* User Growth */}
//           <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border-2 border-blue-100">
//             <div className="flex items-center gap-3 mb-6">
//               <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl">
//                 <Activity className="h-6 w-6 text-white" />
//               </div>
//               <h3 className="text-xl font-black text-gray-900">User Growth Trend</h3>
//             </div>
//             <div className="space-y-4">
//               {chartData.userGrowth.slice(-5).map((item, index) => {
//                 const maxUsers = Math.max(...chartData.userGrowth.map(d => d.users));
//                 const width = maxUsers > 0 ? (item.users / maxUsers) * 100 : 0;
//                 return (
//                   <div key={index}>
//                     <div className="flex items-center justify-between text-sm mb-2">
//                       <span className="text-gray-700 font-bold">{item.month}</span>
//                       <span className="text-gray-900 font-black text-lg">{item.users.toLocaleString()}</span>
//                     </div>
//                     <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner">
//                       <div
//                         className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 rounded-full transition-all duration-700 shadow-lg"
//                         style={{ width: `${width}%` }}
//                       />
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Membership Distribution */}
//           <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border-2 border-purple-100">
//             <div className="flex items-center gap-3 mb-6">
//               <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl">
//                 <Award className="h-6 w-6 text-white" />
//               </div>
//               <h3 className="text-xl font-black text-gray-900">Membership Tiers</h3>
//             </div>
//             <div className="space-y-5">
//               {chartData.membershipDistribution.map((item, index) => {
//                 const colors = [
//                   'from-blue-500 to-blue-700',
//                   'from-purple-500 to-purple-700',
//                   'from-orange-500 to-orange-700'
//                 ];
//                 const bgColors = ['bg-blue-50', 'bg-purple-50', 'bg-orange-50'];
//                 const borderColors = ['border-blue-200', 'border-purple-200', 'border-orange-200'];

//                 const total = chartData.membershipDistribution.reduce((sum, d) => sum + d.count, 0);
//                 const percentage = total > 0 ? ((item.count / total) * 100) : 0;

//                 return (
//                   <div
//                     key={index}
//                     className={`${bgColors[index]} rounded-2xl p-5 border-2 ${borderColors[index]} shadow-md hover:shadow-xl transition-all duration-300`}
//                   >
//                     <div className="flex items-center justify-between mb-3">
//                       <span className="text-base font-black text-gray-800">{item.type}</span>
//                       <span className="text-lg font-black text-gray-900">{item.count.toLocaleString()}</span>
//                     </div>
//                     <div className="flex items-center gap-3">
//                       <div className="flex-1 bg-white rounded-full h-3 overflow-hidden shadow-inner">
//                         <div
//                           className={`h-full bg-gradient-to-r ${colors[index]} rounded-full transition-all duration-700 shadow-lg`}
//                           style={{ width: `${percentage}%` }}
//                         />
//                       </div>
//                       <span className="text-sm font-black text-gray-700 min-w-[45px] text-right">{percentage.toFixed(1)}%</span>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }