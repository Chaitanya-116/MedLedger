import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  IconButton,
  Avatar,
  Badge as MuiBadge,
  Tooltip,
  InputBase,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  useMediaQuery,
} from '@mui/material';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  BarChart3,
  Settings,
  Search,
  Bell,
  Menu,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
  Users,
  LogOut,
  AlertTriangle,
  Receipt,
  ClockAlert,
  PackageCheck,
  TrendingUp,
  X,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MobileBottomNav } from '../components/layout/MobileBottomNav';
import { NotificationSheet, Notification, PRIORITY_DOT } from '../components/notifications';

const DESKTOP_DRAWER_WIDTH = 270;
const COLLAPSED_DRAWER_WIDTH = 88;

// ─── Notification Mock Data ─────────────────────────────────────────────────

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    icon: AlertTriangle,
    iconColor: '#EF4444',
    iconBg: 'rgba(239,68,68,0.12)',
    title: 'Paracetamol 500mg is running low.',
    description: 'Remaining stock is only 12 strips. Please restock soon.',
    time: '10 minutes ago',
    priority: 'high',
    read: false,
  },
  {
    id: 2,
    icon: Receipt,
    iconColor: '#22C55E',
    iconBg: 'rgba(34,197,94,0.12)',
    title: 'New Sale Completed.',
    description: 'Invoice #INV-1024 generated successfully. Amount: ₹540.00',
    time: '30 minutes ago',
    priority: 'success',
    read: false,
  },
  {
    id: 3,
    icon: ClockAlert,
    iconColor: '#F59E0B',
    iconBg: 'rgba(245,158,11,0.12)',
    title: 'Medicine Expiring Soon.',
    description: 'Crocin 650 (Batch C24) expires in 15 days.',
    time: 'Today • 11:45 AM',
    priority: 'warning',
    read: false,
  },
  {
    id: 4,
    icon: PackageCheck,
    iconColor: '#3B82F6',
    iconBg: 'rgba(59,130,246,0.12)',
    title: 'Inventory Updated.',
    description: 'M. Srinivasa Rao updated Amoxicillin stock from 45 → 70 strips.',
    time: 'Today • 11:20 AM',
    priority: 'info',
    read: false,
  },
  {
    id: 5,
    icon: TrendingUp,
    iconColor: '#8B5CF6',
    iconBg: 'rgba(139,92,246,0.12)',
    title: "Today's Sales Summary.",
    description: "Today's pharmacy sales crossed ₹18,450.00.",
    time: 'Today • 8:00 PM',
    priority: 'success',
    read: false,
  },
];

// ─── Notification Card ────────────────────────────────────────────────────────

const NotificationCard: React.FC<{ notif: Notification }> = ({ notif }) => {
  const Icon = notif.icon;
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        p: 2,
        borderRadius: '18px',
        background: notif.read
          ? 'rgba(255, 255, 255, 0.75)'
          : 'rgba(255, 255, 255, 0.90)',
        border: notif.read
          ? '1px solid rgba(255, 255, 255, 0.5)'
          : '1px solid rgba(15, 118, 110, 0.2)',
        boxShadow: '0 4px 14px rgba(15, 118, 110, 0.06)',
        opacity: notif.read ? 0.75 : 1,
        transition: 'all 180ms ease',
        cursor: 'default',
        '&:hover': {
          transform: 'translateY(-1px)',
          background: 'rgba(255, 255, 255, 0.98)',
          boxShadow: '0 6px 18px rgba(15, 118, 110, 0.10)',
          opacity: 1,
        },
      }}
    >
      {/* Icon */}
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '12px',
          bgcolor: notif.iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={18} color={notif.iconColor} />
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 0.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: '#17313B', fontSize: '0.85rem', lineHeight: 1.3 }}>
            {notif.title}
          </Typography>
          {/* Priority dot */}
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: PRIORITY_DOT[notif.priority],
              flexShrink: 0,
              mt: 0.5,
              boxShadow: `0 0 6px ${PRIORITY_DOT[notif.priority]}80`,
            }}
          />
        </Box>
        <Typography variant="caption" sx={{ color: '#475569', lineHeight: 1.4, display: 'block', mt: 0.4 }}>
          {notif.description}
        </Typography>
        <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.725rem', display: 'block', mt: 0.5, fontWeight: 500 }}>
          {notif.time}
        </Typography>
      </Box>
    </Box>
  );
};

// ─── Main Layout ──────────────────────────────────────────────────────────────

export const MainLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Notification state
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [viewAllOpen, setViewAllOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const isDesktop = useMediaQuery('(min-width: 1024px)', { noSsr: true });

  // Close dropdown when clicking outside (desktop only)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    if (notifOpen && isDesktop) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notifOpen, isDesktop]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isAdmin = user?.role === 'ADMIN';

  // Base navigation items
  const baseNavItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Inventory', icon: Package, path: '/inventory' },
    { label: 'Sales', icon: ShoppingBag, path: '/sales' },
    { label: 'Analytics', icon: BarChart3, path: '/analytics' },
  ];

  // Admin-only navigation items
  const adminNavItems = [
    { label: 'User Management', icon: Users, path: '/users' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  const navItems = isAdmin ? [...baseNavItems, ...adminNavItems] : baseNavItems;

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const sidebarWidth = isCollapsed ? COLLAPSED_DRAWER_WIDTH : DESKTOP_DRAWER_WIDTH;

  const initials = user?.full_name
    ? user.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'ML';

  const drawerContent = (
    <Box
      className="glass-sidebar"
      sx={{
        height: 'calc(100vh - 32px)',
        m: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: isCollapsed ? 1.5 : 2.5,
        transition: 'all 300ms ease',
        overflow: 'hidden',
      }}
    >
      {/* Top Header */}
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            mb: 4,
            px: isCollapsed ? 0 : 1,
          }}
        >
          <Box
            onClick={() => navigate('/dashboard')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #0F766E 0%, #115E59 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 8px 20px rgba(15, 118, 110, 0.25)',
                flexShrink: 0,
              }}
            >
              <ShieldCheck size={24} />
            </Box>
            {!isCollapsed && (
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    lineHeight: 1.1,
                    color: '#0F766E',
                    letterSpacing: '-0.02em',
                  }}
                >
                  MedLedger
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500 }}>
                  Pharmacy SaaS v1.0
                </Typography>
              </Box>
            )}
          </Box>

          <IconButton
            onClick={() => setIsCollapsed(!isCollapsed)}
            size="small"
            sx={{
              display: { xs: 'none', md: 'flex' },
              color: '#64748B',
              bgcolor: 'rgba(255, 255, 255, 0.4)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.6)' },
            }}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </IconButton>
        </Box>

        {/* Navigation Items */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Tooltip key={item.label} title={isCollapsed ? item.label : ''} placement="right">
                <Box
                  onClick={() => {
                    navigate(item.path);
                    setMobileOpen(false);
                  }}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    gap: 1.75,
                    px: isCollapsed ? 1.5 : 2,
                    py: 1.5,
                    borderRadius: '999px',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(15, 118, 110, 0.15) 0%, rgba(15, 118, 110, 0.08) 100%)'
                      : 'transparent',
                    border: isActive ? '1px solid rgba(15, 118, 110, 0.25)' : '1px solid transparent',
                    backdropFilter: isActive ? 'blur(12px)' : 'none',
                    color: isActive ? '#0F766E' : '#64748B',
                    fontWeight: isActive ? 600 : 500,
                    '&:hover': {
                      background: isActive
                        ? 'linear-gradient(135deg, rgba(15, 118, 110, 0.20) 0%, rgba(15, 118, 110, 0.12) 100%)'
                        : 'rgba(255, 255, 255, 0.4)',
                      color: '#0F766E',
                      transform: 'translateX(2px)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isActive ? '#0F766E' : 'rgba(255, 255, 255, 0.4)',
                      color: isActive ? '#FFFFFF' : '#64748B',
                      boxShadow: isActive ? '0 0 15px rgba(15, 118, 110, 0.3)' : 'none',
                      transition: 'all 200ms ease',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={19} />
                  </Box>
                  {!isCollapsed && (
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '0.925rem',
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? '#0F766E' : '#17313B',
                      }}
                    >
                      {item.label}
                    </Typography>
                  )}
                </Box>
              </Tooltip>
            );
          })}
        </Box>
      </Box>

      {/* Bottom Profile & Role Footer */}
      <Box
        sx={{
          p: isCollapsed ? 1 : 1.5,
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.35)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.45)',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ position: 'relative', flexShrink: 0 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: isAdmin ? '#0F766E' : '#2563EB',
                fontWeight: 700,
                fontSize: '0.9rem',
                boxShadow: isAdmin
                  ? '0 4px 12px rgba(15, 118, 110, 0.3)'
                  : '0 4px 12px rgba(37, 99, 235, 0.3)',
              }}
            >
              {initials}
            </Avatar>
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: '#22C55E',
                border: '2px solid #FFFFFF',
                boxShadow: '0 0 8px rgba(34, 197, 94, 0.6)',
              }}
            />
          </Box>
          {!isCollapsed && (
            <Box sx={{ overflow: 'hidden', flexGrow: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#17313B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.full_name || 'Staff User'}
              </Typography>

              {/* Role Badge: ADMIN -> Emerald badge, USER -> Blue badge */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.25 }}>
                {isAdmin ? (
                  <Chip
                    label="ADMIN"
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      bgcolor: 'rgba(16, 185, 129, 0.15)',
                      color: '#059669',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      '& .MuiChip-label': { px: 1 },
                    }}
                  />
                ) : (
                  <Chip
                    label="USER"
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      bgcolor: 'rgba(37, 99, 235, 0.15)',
                      color: '#2563EB',
                      border: '1px solid rgba(37, 99, 235, 0.3)',
                      '& .MuiChip-label': { px: 1 },
                    }}
                  />
                )}
              </Box>
            </Box>
          )}
        </Box>

        {/* Logout Action Button */}
        {!isCollapsed && (
          <Box
            onClick={logout}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              py: 0.75,
              borderRadius: '12px',
              bgcolor: 'rgba(239, 68, 68, 0.08)',
              color: '#DC2626',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.825rem',
              transition: 'all 200ms ease',
              '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.16)' },
            }}
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: 'transparent' }}>
      {/* Desktop Floating Sidebar Container */}
      <Box
        component="nav"
        sx={{
          width: { md: sidebarWidth + 32 },
          flexShrink: { md: 0 },
          transition: 'width 300ms ease',
        }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DESKTOP_DRAWER_WIDTH + 32,
              bgcolor: 'transparent',
              border: 'none',
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop Fixed Floating Sidebar */}
        <Box
          sx={{
            display: { xs: 'none', md: 'block' },
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            width: sidebarWidth + 32,
            transition: 'width 300ms ease',
            zIndex: 1200,
          }}
        >
          {drawerContent}
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          width: { md: `calc(100% - ${sidebarWidth + 32}px)` },
          transition: 'all 300ms ease',
          // Clearance for the mobile bottom navigation (<640px only)
          '@media (max-width: 639.95px)': {
            paddingBottom: 'calc(92px + env(safe-area-inset-bottom, 0px))',
          },
        }}
      >
        {/* Floating Top Navbar */}
        <Box
          className="glass-navbar"
          sx={{
            p: 1.5,
            px: { xs: 2, md: 3 },
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            position: 'relative',
            zIndex: 9999,
            overflow: 'visible',
          }}
        >
          {/* Left section: Mobile Toggle + Search Bar */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1, maxWidth: 500 }}>
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                display: { md: 'none' },
                color: '#17313B',
                bgcolor: 'rgba(255, 255, 255, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
              }}
            >
              <Menu size={20} />
            </IconButton>

            <Box
              className="glass-input"
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 2,
                py: 0.75,
                width: '100%',
                gap: 1.5,
              }}
            >
              <Search size={18} color="#64748B" />
              <InputBase
                placeholder="Search medicines, orders, customers..."
                sx={{
                  flexGrow: 1,
                  fontSize: '0.9rem',
                  color: '#17313B',
                  '& input::placeholder': { color: '#94A3B8', opacity: 1 },
                }}
              />
            </Box>
          </Box>

          {/* Right section: Store & Date + Action Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            <Box
              sx={{
                display: { xs: 'none', lg: 'flex' },
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 0.75,
                borderRadius: '16px',
                bgcolor: 'rgba(255, 255, 255, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
              }}
            >
              <Building2 size={16} color="#0F766E" />
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#17313B' }}>
                Main Branch
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                •
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500 }}>
                {currentDate}
              </Typography>
            </Box>

            {/* ── Notification Bell with Dropdown ─────────────────────────── */}
            <Box ref={notifRef} sx={{ position: 'relative', zIndex: 9999 }}>
              <Tooltip title="Notifications">
                <IconButton
                  id="notification-bell-btn"
                  onClick={() => setNotifOpen((prev) => !prev)}
                  sx={{
                    bgcolor: notifOpen ? 'rgba(15,118,110,0.12)' : 'rgba(255, 255, 255, 0.4)',
                    backdropFilter: 'blur(12px)',
                    border: notifOpen ? '1px solid rgba(15,118,110,0.3)' : '1px solid rgba(255, 255, 255, 0.5)',
                    color: notifOpen ? '#0F766E' : '#17313B',
                    transition: 'all 200ms ease',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.6)' },
                  }}
                >
                  <MuiBadge
                    badgeContent={unreadCount}
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': {
                        fontSize: '0.6rem',
                        minWidth: 16,
                        height: 16,
                        fontWeight: 800,
                      },
                    }}
                  >
                    <Bell size={19} />
                  </MuiBadge>
                </IconButton>
              </Tooltip>

              {/* Glassmorphism Floating Notification Popup (Desktop >=1024px) */}
              {isDesktop && notifOpen && (
                <Box
                  id="notification-dropdown"
                  sx={{
                    position: 'fixed',
                    top: { xs: 'auto', sm: '78px' },
                    bottom: { xs: 16, sm: 'auto' },
                    right: { xs: 16, sm: '24px' },
                    left: { xs: 16, sm: 'auto' },
                    width: { xs: 'calc(100vw - 32px)', sm: 380 },
                    maxWidth: 380,
                    maxHeight: 500,
                    zIndex: 9999,
                    borderRadius: '24px',
                    background: 'rgba(255, 255, 255, 0.96)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255, 255, 255, 0.7)',
                    boxShadow: '0 20px 60px rgba(15, 118, 110, 0.18)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    animation: 'notifPopIn 180ms ease-out forwards',
                    '@keyframes notifPopIn': {
                      from: { opacity: 0, transform: 'scale(0.96)' },
                      to: { opacity: 1, transform: 'scale(1)' },
                    },
                  }}
                >
                  {/* Dropdown Header */}
                  <Box
                    sx={{
                      px: 2.5,
                      pt: 2.5,
                      pb: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid rgba(15, 118, 110, 0.12)',
                      flexShrink: 0,
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#17313B', lineHeight: 1.2 }}>
                        Notifications
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500 }}>
                        {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {unreadCount > 0 && (
                        <Box
                          id="mark-all-read-btn"
                          onClick={handleMarkAllRead}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            px: 1.25,
                            py: 0.5,
                            borderRadius: '10px',
                            bgcolor: 'rgba(15,118,110,0.1)',
                            color: '#0F766E',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 150ms ease',
                            '&:hover': { bgcolor: 'rgba(15,118,110,0.18)' },
                          }}
                        >
                          <Check size={12} />
                          Mark All Read
                        </Box>
                      )}
                      <IconButton
                        size="small"
                        onClick={() => setNotifOpen(false)}
                        sx={{ color: '#64748B', p: 0.5 }}
                      >
                        <X size={16} />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Notification Cards list */}
                  <Box
                    sx={{
                      flexGrow: 1,
                      overflowY: 'auto',
                      px: 2,
                      py: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1.5,
                      '&::-webkit-scrollbar': { width: 4 },
                      '&::-webkit-scrollbar-track': { background: 'transparent' },
                      '&::-webkit-scrollbar-thumb': {
                        background: 'rgba(15,118,110,0.25)',
                        borderRadius: 4,
                      },
                    }}
                  >
                    {notifications.map((notif) => (
                      <NotificationCard key={notif.id} notif={notif} />
                    ))}
                  </Box>

                  {/* Footer */}
                  <Box
                    sx={{
                      px: 2,
                      py: 1.5,
                      borderTop: '1px solid rgba(15, 118, 110, 0.12)',
                      display: 'flex',
                      justify: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Box
                      id="view-all-notifications-btn"
                      onClick={() => {
                        setNotifOpen(false);
                        setViewAllOpen(true);
                      }}
                      sx={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: '#0F766E',
                        cursor: 'pointer',
                        py: 0.5,
                        px: 2,
                        borderRadius: '10px',
                        transition: 'all 150ms ease',
                        '&:hover': { bgcolor: 'rgba(15,118,110,0.08)' },
                      }}
                    >
                      View All Notifications →
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
            {/* ── End Notification Bell ─────────────────────────────────── */}

            {/* Profile Dropdown Chip */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
                p: 0.5,
                pr: { xs: 0.5, sm: 1.5 },
                borderRadius: '999px',
                bgcolor: 'rgba(255, 255, 255, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
              }}
            >
              <Avatar
                sx={{
                  width: 34,
                  height: 34,
                  bgcolor: isAdmin ? '#0F766E' : '#2563EB',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                }}
              >
                {initials}
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem', lineHeight: 1.1 }}>
                  {user?.full_name || 'Staff User'}
                </Typography>
                <Typography variant="caption" sx={{ color: isAdmin ? '#0F766E' : '#2563EB', fontWeight: 600, fontSize: '0.7rem' }}>
                  {user?.role || 'USER'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Page Content Outlet */}
        <Outlet />
      </Box>

      {/* ── View All Notifications Modal ─────────────────────────────────────── */}
      <Dialog
        open={viewAllOpen}
        onClose={() => setViewAllOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            background: 'rgba(255,255,255,0.32)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: '1px solid rgba(255,255,255,0.45)',
            boxShadow: '0 24px 64px rgba(15,118,110,0.15)',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: 1,
            borderBottom: '1px solid rgba(255,255,255,0.35)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Bell size={18} color="#0F766E" />
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#17313B' }}>
              All Notifications
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setViewAllOpen(false)} sx={{ color: '#64748B' }}>
            <X size={18} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: 1.5, py: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {notifications.map((notif) => (
              <NotificationCard key={notif.id} notif={notif} />
            ))}
          </Box>
        </DialogContent>
      </Dialog>

      {/* Mobile & Tablet Notification Bottom Sheet (<1024px) */}
      {!isDesktop && (
        <NotificationSheet
          open={notifOpen}
          onClose={() => setNotifOpen(false)}
          notifications={notifications}
          onMarkAllRead={handleMarkAllRead}
          onViewAll={() => {
            setNotifOpen(false);
            setViewAllOpen(true);
          }}
        />
      )}

      {/* Mobile-only bottom navigation (hidden >= 640px) */}
      <MobileBottomNav />
    </Box>
  );
};

export default MainLayout;
