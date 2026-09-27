import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  InputBase,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Avatar,
} from '@mui/material';
import {
  Users as UsersIcon,
  Search,
  UserCheck,
  UserX,
  Trash2,
  ShieldCheck,
  User as UserIcon,
  RefreshCw,
} from 'lucide-react';
import apiClient from '../api/axios';
import { User } from '../types';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Delete modal state
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const fetchUsers = useCallback(async (searchQuery: string = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<never, User[]>('/users', {
        params: searchQuery ? { search: searchQuery } : {},
      });
      setUsers(response);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load user accounts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, fetchUsers]);

  const handleToggleStatus = async (user: User) => {
    setActionLoading(user.id);
    try {
      const updatedUser = await apiClient.patch<never, User>(`/users/${user.id}/status`, {
        is_active: !user.is_active,
      });
      setUsers((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to update user status.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setActionLoading(userToDelete.id);
    try {
      await apiClient.delete(`/users/${userToDelete.id}`);
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setUserToDelete(null);
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to delete user.');
    } finally {
      setActionLoading(null);
    }
  };

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.is_active).length;
  const adminCount = users.filter((u) => u.role === 'ADMIN').length;
  const userCount = users.filter((u) => u.role === 'USER').length;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#17313B', letterSpacing: '-0.02em' }}>
            User Management
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
            System Administrator Control • Role Access & User Status
          </Typography>
        </Box>
        <Button
          onClick={() => fetchUsers(search)}
          startIcon={<RefreshCw size={18} />}
          sx={{
            px: 2.5,
            py: 1,
            borderRadius: '14px',
            bgcolor: 'rgba(255, 255, 255, 0.4)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            color: '#0F766E',
            fontWeight: 600,
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.7)' },
          }}
        >
          Refresh List
        </Button>
      </Box>

      {/* Metrics Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2.5 }}>
        <Card className="glass-card">
          <CardContent sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: '16px', bgcolor: 'rgba(15, 118, 110, 0.1)', color: '#0F766E' }}>
              <UsersIcon size={24} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                TOTAL REGISTERED
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#17313B' }}>
                {totalUsers}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: '16px', bgcolor: 'rgba(34, 197, 94, 0.1)', color: '#16A34A' }}>
              <UserCheck size={24} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                ACTIVE ACCOUNTS
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#16A34A' }}>
                {activeUsers}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: '16px', bgcolor: 'rgba(15, 118, 110, 0.15)', color: '#0F766E' }}>
              <ShieldCheck size={24} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                ADMINISTRATORS
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F766E' }}>
                {adminCount}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: '16px', bgcolor: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' }}>
              <UserIcon size={24} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                REGULAR USERS
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#2563EB' }}>
                {userCount}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Main Glass Table Container */}
      <Card className="glass-card">
        <CardContent sx={{ p: 3 }}>
          {/* Search bar */}
          <Box sx={{ mb: 3, display: 'flex', gap: 2, maxWidth: 450 }}>
            <Box className="glass-input" sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1, width: '100%' }}>
              <Search size={18} color="#64748B" />
              <InputBase
                placeholder="Search user by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ ml: 1.5, flexGrow: 1, fontSize: '0.9rem', color: '#17313B' }}
              />
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '14px' }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress sx={{ color: '#0F766E' }} />
            </Box>
          ) : (
            <TableContainer sx={{ borderRadius: '16px', overflow: 'hidden' }}>
              <Table>
                <TableHead sx={{ bgcolor: 'rgba(255, 255, 255, 0.5)' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: '#17313B' }}>User Profile</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#17313B' }}>Email Address</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#17313B' }}>Assigned Role</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#17313B' }}>Account Status</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#17313B' }}>Registered Date</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: '#17313B' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4, color: '#64748B' }}>
                        No user accounts found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((u) => {
                      const isAdmin = u.role === 'ADMIN';
                      const initials = u.full_name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2);

                      return (
                        <TableRow key={u.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar
                                sx={{
                                  width: 38,
                                  height: 38,
                                  bgcolor: isAdmin ? '#0F766E' : '#2563EB',
                                  fontSize: '0.85rem',
                                  fontWeight: 700,
                                }}
                              >
                                {initials}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#17313B' }}>
                                  {u.full_name}
                                </Typography>
                                {isAdmin && (
                                  <Typography variant="caption" sx={{ color: '#0F766E', fontWeight: 600 }}>
                                    System Admin
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: '#475569', fontWeight: 500 }}>{u.email}</TableCell>
                          <TableCell>
                            {isAdmin ? (
                              <Chip
                                label="ADMIN"
                                size="small"
                                sx={{
                                  bgcolor: 'rgba(15, 118, 110, 0.12)',
                                  color: '#0F766E',
                                  fontWeight: 700,
                                  fontSize: '0.725rem',
                                  border: '1px solid rgba(15, 118, 110, 0.25)',
                                }}
                              />
                            ) : (
                              <Chip
                                label="USER"
                                size="small"
                                sx={{
                                  bgcolor: 'rgba(37, 99, 235, 0.12)',
                                  color: '#2563EB',
                                  fontWeight: 700,
                                  fontSize: '0.725rem',
                                  border: '1px solid rgba(37, 99, 235, 0.25)',
                                }}
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            {u.is_active ? (
                              <Chip
                                label="Active"
                                size="small"
                                sx={{
                                  bgcolor: 'rgba(34, 197, 94, 0.12)',
                                  color: '#16A34A',
                                  fontWeight: 600,
                                  fontSize: '0.725rem',
                                  border: '1px solid rgba(34, 197, 94, 0.25)',
                                }}
                              />
                            ) : (
                              <Chip
                                label="Disabled"
                                size="small"
                                sx={{
                                  bgcolor: 'rgba(239, 68, 68, 0.12)',
                                  color: '#DC2626',
                                  fontWeight: 600,
                                  fontSize: '0.725rem',
                                  border: '1px solid rgba(239, 68, 68, 0.25)',
                                }}
                              />
                            )}
                          </TableCell>
                          <TableCell sx={{ color: '#64748B', fontSize: '0.85rem' }}>
                            {new Date(u.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                              <Tooltip title={u.is_active ? 'Disable User' : 'Enable User'}>
                                <span>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleToggleStatus(u)}
                                    disabled={actionLoading === u.id}
                                    sx={{
                                      color: u.is_active ? '#DC2626' : '#16A34A',
                                      bgcolor: u.is_active ? 'rgba(239, 68, 68, 0.08)' : 'rgba(34, 197, 94, 0.08)',
                                      '&:hover': {
                                        bgcolor: u.is_active ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                                      },
                                    }}
                                  >
                                    {u.is_active ? <UserX size={17} /> : <UserCheck size={17} />}
                                  </IconButton>
                                </span>
                              </Tooltip>

                              <Tooltip title="Delete Account">
                                <span>
                                  <IconButton
                                    size="small"
                                    onClick={() => setUserToDelete(u)}
                                    disabled={actionLoading === u.id}
                                    sx={{
                                      color: '#DC2626',
                                      bgcolor: 'rgba(239, 68, 68, 0.08)',
                                      '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.15)' },
                                    }}
                                  >
                                    <Trash2 size={17} />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        PaperProps={{
          sx: {
            borderRadius: '24px',
            p: 1,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            maxWidth: 420,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#17313B' }}>Confirm User Deletion</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            Are you sure you want to delete the account for{' '}
            <strong style={{ color: '#17313B' }}>{userToDelete?.full_name}</strong> ({userToDelete?.email})? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setUserToDelete(null)} sx={{ borderRadius: '12px', color: '#64748B' }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteUser}
            variant="contained"
            color="error"
            disabled={actionLoading === userToDelete?.id}
            sx={{ borderRadius: '12px', px: 3 }}
          >
            Delete User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
