import { Loader2, Search, Shield, ShieldAlert, User, UserCheck, UserX } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { User as UserType, userService, UserQueryParams } from '../../services/userService';

const UsersPage: React.FC = () => {
  const { theme } = useTheme();
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, pagination.limit, debouncedSearch]); 

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params: UserQueryParams = {
        page: pagination.page,
        limit: pagination.limit,
        name: debouncedSearch || undefined,
      };

      const response = await userService.getAllUsers(params);
      setUsers(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.pagination.total,
        totalPages: response.pagination.totalPages
      }));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Disable logging in of user
  const handleDeactivate = async (user: UserType) => {
    if (window.confirm(`Are you sure you want to deactivate "${user.profile?.name || user.email}"? This will prevent them from logging in and accessing the system.`)) {
      try {
        setActionLoading(user.id);
        await userService.deactivateUser(user.id);
        
        // Update the user's status locally without refetching
        setUsers(prevUsers => 
          prevUsers.map(u => 
            u.id === user.id ? { ...u, isActive: false } : u
          )
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to deactivate user');
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleRoleChange = async (user: UserType, newRole: string) => {
    if (window.confirm(`Change ${user.profile?.name || user.email}'s role to ${newRole}?`)) {
      try {
        setActionLoading(user.id);
        await userService.changeUserRole(user.id, newRole);
        
        // Update the user's role locally without refetching
        setUsers(prevUsers => 
          prevUsers.map(u => 
            u.id === user.id ? { ...u, role: newRole } : u
          )
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to change user role');
      } finally {
        setActionLoading(null);
      }
    }
  };

  // Filter users client-side based on active tab
  const filteredUsers = useMemo(() => {
    let filtered = users;

    // Apply tab filter
    if (activeTab === 'active') {
      filtered = filtered.filter(user => user.isActive);
    } else if (activeTab === 'inactive') {
      filtered = filtered.filter(user => !user.isActive);
    }

    // Apply search filter (additional client-side filtering)
    if (searchQuery) {
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.profile?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [users, activeTab, searchQuery]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Shield className="w-4 h-4 text-red-500" />;
      case 'REVIEWER':
        return <ShieldAlert className="w-4 h-4 text-orange-500" />;
      default:
        return <User className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? 
      <UserCheck className="w-4 h-4 text-green-500" /> : 
      <UserX className="w-4 h-4 text-gray-400" />;
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  if (loading && users.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className={`text-2xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Manage Users
          </h1>
          <p className={`mt-1 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Manage user accounts, roles, and access permissions.
          </p>
        </div>
        <div className={`text-sm px-3 py-1 rounded ${
          theme === 'dark' ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-50 text-blue-600'
        }`}>
          Total Users: {pagination.total}
        </div>
      </div>

      {/* Search and Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700 text-gray-200' 
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-primary`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8" aria-label="Tabs">
            {[
              { key: 'all' as const, label: 'All Users', count: users.length },
              { key: 'active' as const, label: 'Active', count: users.filter(u => u.isActive).length },
              { key: 'inactive' as const, label: 'Inactive', count: users.filter(u => !u.isActive).length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.key
                    ? 'border-primary text-primary'
                    : `border-transparent ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} hover:text-gray-700 dark:hover:text-gray-300`
                }`}
              >
                {tab.label}
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.key
                    ? 'bg-primary/20 text-primary'
                    : theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Error Message */}
      {/* {error && (
        <div className={`p-4 rounded-lg ${
          theme === 'dark' ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-600'
        }`}>
          Error: {error}
        </div>
      )} */}

      {/* Users Table */}
      <div className={`rounded-lg border ${
        theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <th className="text-left py-3 px-4 font-medium text-sm">User</th>
                <th className="text-left py-3 px-4 font-medium text-sm">Role</th>
                <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
                <th className="text-left py-3 px-4 font-medium text-sm">Joined</th>
                <th className="text-left py-3 px-4 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr 
                    key={user.id} 
                    className={`border-b ${
                      theme === 'dark' ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                        }`}>
                          <User className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <p className={`font-medium ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {user.profile?.name || 'No name'}
                          </p>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getRoleIcon(user.role)}
                        <span className={`capitalize ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {user.role.toLowerCase()}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(user.isActive)}
                        <span className={`capitalize ${
                          user.isActive 
                            ? (theme === 'dark' ? 'text-green-400' : 'text-green-600')
                            : (theme === 'dark' ? 'text-gray-400' : 'text-gray-500')
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user, e.target.value)}
                          disabled={actionLoading === user.id}
                          className={`text-sm rounded border ${
                            theme === 'dark' 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          } px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary`}
                        >
                          <option value="USER">User</option>
                          <option value="REVIEWER">Reviewer</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                        
                        {user.isActive && (
                          <button
                            onClick={() => handleDeactivate(user)}
                            disabled={actionLoading === user.id}
                            className={`px-3 py-1 rounded text-sm font-medium ${
                              theme === 'dark'
                                ? 'bg-red-900/20 text-red-400 hover:bg-red-900/30'
                                : 'bg-red-50 text-red-600 hover:bg-red-100'
                            } disabled:opacity-50 flex items-center gap-1`}
                          >
                            {actionLoading === user.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : null}
                            Deactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center">
                    <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className={`text-lg ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {loading ? 'Loading users...' : 
                       searchQuery 
                        ? 'No users found matching your search.'
                        : `No users found in "${activeTab}" tab.`}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredUsers.length > 0 && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} users
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className={`px-3 py-1 rounded border ${
                theme === 'dark'
                  ? 'border-gray-600 text-gray-300 disabled:text-gray-600'
                  : 'border-gray-300 text-gray-700 disabled:text-gray-400'
              } disabled:border-gray-300 dark:disabled:border-gray-700`}
            >
              Previous
            </button>
            <span className={`px-3 py-1 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className={`px-3 py-1 rounded border ${
                theme === 'dark'
                  ? 'border-gray-600 text-gray-300 disabled:text-gray-600'
                  : 'border-gray-300 text-gray-700 disabled:text-gray-400'
              } disabled:border-gray-300 dark:disabled:border-gray-700`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;