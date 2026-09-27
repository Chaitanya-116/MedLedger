import React from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, BarChart3 } from 'lucide-react';

/**
 * Mobile-only floating glass bottom navigation (< 640px).
 * Shared by every page rendered inside MainLayout — Dashboard,
 * Inventory, Sales and Analytics all get the identical bar.
 * Hidden at >= 640px so tablet/desktop navigation is untouched.
 */

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Inventory', icon: Package, path: '/inventory' },
  { label: 'Sales', icon: ShoppingBag, path: '/sales' },
  { label: 'Analytics', icon: BarChart3, path: '/analytics' },
];

export const MobileBottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box
      component="nav"
      sx={{
        position: 'fixed',
        left: 12,
        right: 12,
        bottom: 'calc(10px + env(safe-area-inset-bottom, 0px))',
        zIndex: 1200,
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'space-around',
        px: 1,
        py: 1,
        borderRadius: '22px',
        background: 'rgba(255, 255, 255, 0.62)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        border: '1px solid rgba(255, 255, 255, 0.55)',
        boxShadow: '0 12px 32px rgba(15, 118, 110, 0.16)',
        // Mobile only — matches the <640px breakpoint used across Inventory mobile
        '@media (min-width: 640px)': { display: 'none' },
      }}
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Box
            key={item.path}
            onClick={() => navigate(item.path)}
            sx={{
              flex: 1,
              minWidth: 0,
              minHeight: 52,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              borderRadius: '16px',
              cursor: 'pointer',
              transition: 'all 200ms ease',
              background: isActive ? 'rgba(15, 118, 110, 0.12)' : 'transparent',
              border: isActive ? '1px solid rgba(15, 118, 110, 0.18)' : '1px solid transparent',
              color: isActive ? '#0F766E' : '#64748B',
              '&:active': { background: 'rgba(15, 118, 110, 0.18)' },
            }}
          >
            <Icon size={21} strokeWidth={isActive ? 2.4 : 2} />
            <Typography
              sx={{
                fontSize: '0.66rem',
                fontWeight: isActive ? 700 : 500,
                lineHeight: 1,
                whiteSpace: 'nowrap',
              }}
            >
              {item.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default MobileBottomNav;
