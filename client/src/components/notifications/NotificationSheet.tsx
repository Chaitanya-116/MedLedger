import React from 'react';
import { Box, Button, Chip, IconButton, SwipeableDrawer, Typography } from '@mui/material';
import { Bell, Check, X } from 'lucide-react';

export interface Notification {
  id: number;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  time: string;
  priority: 'high' | 'success' | 'warning' | 'info';
  read: boolean;
}

export const PRIORITY_DOT: Record<Notification['priority'], string> = {
  high: '#EF4444',
  success: '#22C55E',
  warning: '#F59E0B',
  info: '#3B82F6',
};

interface NotificationSheetProps {
  open: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAllRead: () => void;
  onViewAll: () => void;
}

/**
 * Responsive Mobile/Tablet Notification Drawer (<1024px):
 * - Mobile (<640px): 100% width, 88dvh bottom sheet
 * - Tablet (640–1023px): 420px width centered bottom drawer
 * Includes grab handle, sticky header, scrollable cards list, and sticky footer.
 */
export const NotificationSheet: React.FC<NotificationSheetProps> = ({
  open,
  onClose,
  notifications,
  onMarkAllRead,
  onViewAll,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onOpen={() => {}}
      onClose={onClose}
      swipeAreaWidth={0}
      transitionDuration={300}
      slotProps={{
        paper: { elevation: 0 },
        backdrop: {
          sx: {
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            bgcolor: 'rgba(15, 23, 42, 0.45)',
          },
        },
      }}
      sx={{
        zIndex: 9999,
      }}
      PaperProps={{
        sx: {
          height: '88dvh',
          maxHeight: '90dvh',
          width: '100%',
          left: 0,
          right: 0,
          mx: 'auto',
          '@media (min-width: 640px)': {
            width: 420,
            maxWidth: 'calc(100vw - 32px)',
          },
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid rgba(255, 255, 255, 0.7)',
          borderBottom: 'none',
          boxShadow: '0 -16px 50px rgba(15, 118, 110, 0.22)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        },
      }}
    >
      {/* ── Grab handle ── */}
      <Box sx={{ flexShrink: 0, display: 'flex', justifyContent: 'center', pt: 1.25, pb: 0.5 }}>
        <Box sx={{ width: 44, height: 5, borderRadius: 3, bgcolor: 'rgba(15, 118, 110, 0.22)' }} />
      </Box>

      {/* ── Sticky Header ── */}
      <Box
        sx={{
          flexShrink: 0,
          px: 2,
          pt: 1,
          pb: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          bgcolor: 'rgba(255, 255, 255, 0.65)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(15, 118, 110, 0.12)',
        }}
      >
        {/* Left: Icon, Title & Unread Count Badge */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              flexShrink: 0,
              borderRadius: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(15, 118, 110, 0.1)',
              border: '1px solid rgba(15, 118, 110, 0.18)',
            }}
          >
            <Bell size={20} color="#0F766E" />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#17313B', lineHeight: 1.2 }}>
                Notifications
              </Typography>
              {unreadCount > 0 && (
                <Chip
                  label={unreadCount}
                  size="small"
                  sx={{
                    height: 20,
                    minWidth: 20,
                    px: 0.25,
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    bgcolor: 'rgba(239, 68, 68, 0.14)',
                    color: '#EF4444',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                  }}
                />
              )}
            </Box>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500 }}>
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
            </Typography>
          </Box>
        </Box>

        {/* Right: Actions (Mark All Read + Close Button) */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexShrink: 0 }}>
          {unreadCount > 0 && (
            <Button
              id="mobile-mark-all-read-btn"
              size="small"
              onClick={onMarkAllRead}
              startIcon={<Check size={14} />}
              sx={{
                minHeight: 44,
                px: 1.5,
                borderRadius: '12px',
                bgcolor: 'rgba(15, 118, 110, 0.08)',
                color: '#0F766E',
                fontSize: '0.74rem',
                fontWeight: 700,
                border: '1px solid rgba(15, 118, 110, 0.18)',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: 'rgba(15, 118, 110, 0.16)',
                  boxShadow: 'none',
                },
                '&:active': {
                  bgcolor: 'rgba(15, 118, 110, 0.22)',
                },
              }}
            >
              Mark All Read
            </Button>
          )}

          {/* Close button with large 48px touch target */}
          <IconButton
            id="mobile-notification-sheet-close-btn"
            aria-label="Close notifications"
            onClick={onClose}
            sx={{
              width: 48,
              height: 48,
              flexShrink: 0,
              borderRadius: '14px',
              color: '#64748B',
              bgcolor: 'rgba(15, 118, 110, 0.06)',
              border: '1px solid rgba(15, 118, 110, 0.1)',
              '&:hover': {
                bgcolor: 'rgba(15, 118, 110, 0.12)',
              },
              '&:active': {
                bgcolor: 'rgba(15, 118, 110, 0.2)',
              },
            }}
          >
            <X size={20} />
          </IconButton>
        </Box>
      </Box>

      {/* ── Scrollable Notification List ── */}
      <Box
        sx={{
          flexGrow: 1,
          minHeight: 0,
          overflowY: 'auto',
          px: 2,
          py: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.75, // 14px spacing between cards (fits 12–16px requirement)
          maskImage: 'linear-gradient(to bottom, black calc(100% - 24px), transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, black calc(100% - 24px), transparent)',
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(15, 118, 110, 0.25)',
            borderRadius: 4,
          },
        }}
      >
        {notifications.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Bell size={40} color="#94A3B8" />
            <Typography variant="body2" sx={{ color: '#64748B', mt: 1 }}>
              No notifications at the moment.
            </Typography>
          </Box>
        ) : (
          notifications.map((notif) => {
            const Icon = notif.icon;
            return (
              <Box
                key={notif.id}
                sx={{
                  display: 'flex',
                  gap: 1.5,
                  p: 2,
                  borderRadius: '18px',
                  background: notif.read
                    ? 'rgba(255, 255, 255, 0.65)'
                    : 'rgba(255, 255, 255, 0.92)',
                  border: notif.read
                    ? '1px solid rgba(15, 118, 110, 0.14)'
                    : '1.5px solid rgba(15, 118, 110, 0.32)',
                  boxShadow: notif.read
                    ? '0 3px 12px rgba(15, 118, 110, 0.05)'
                    : '0 6px 20px rgba(15, 118, 110, 0.12)',
                  opacity: notif.read ? 0.8 : 1,
                  transition: 'all 200ms ease',
                  '&:active': {
                    transform: 'scale(0.99)',
                    background: 'rgba(255, 255, 255, 0.98)',
                  },
                }}
              >
                {/* Status icon with tinted background */}
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: '13px',
                    bgcolor: notif.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={20} color={notif.iconColor} />
                </Box>

                {/* Content */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 0.75 }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: '#17313B',
                        fontSize: '0.88rem',
                        lineHeight: 1.3,
                        wordBreak: 'break-word',
                      }}
                    >
                      {notif.title}
                    </Typography>

                    {/* Small unread dot if unread */}
                    {!notif.read && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: PRIORITY_DOT[notif.priority] || '#0F766E',
                          flexShrink: 0,
                          mt: 0.5,
                          boxShadow: `0 0 8px ${PRIORITY_DOT[notif.priority] || '#0F766E'}`,
                        }}
                      />
                    )}
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      color: '#475569',
                      fontSize: '0.8rem',
                      lineHeight: 1.45,
                      mt: 0.4,
                      wordBreak: 'break-word',
                    }}
                  >
                    {notif.description}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      color: '#64748B',
                      fontSize: '0.72rem',
                      display: 'block',
                      mt: 0.6,
                      fontWeight: 600,
                    }}
                  >
                    {notif.time}
                  </Typography>
                </Box>
              </Box>
            );
          })
        )}
      </Box>

      {/* ── Sticky Footer ── */}
      <Box
        sx={{
          flexShrink: 0,
          px: 2,
          py: 1.75,
          pb: 'calc(14px + env(safe-area-inset-bottom, 0px))',
          bgcolor: 'rgba(255, 255, 255, 0.65)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(15, 118, 110, 0.12)',
        }}
      >
        <Button
          fullWidth
          variant="contained"
          id="view-all-notifications-mobile-btn"
          onClick={() => {
            onClose();
            onViewAll();
          }}
          sx={{
            minHeight: 48, // 48px minimum touch target
            borderRadius: '16px',
            fontSize: '0.92rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, rgba(15, 118, 110, 0.12) 0%, rgba(20, 184, 166, 0.22) 100%)',
            color: '#0F766E',
            border: '1.5px solid rgba(15, 118, 110, 0.32)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: '0 4px 14px rgba(15, 118, 110, 0.1)',
            transition: 'all 200ms ease',
            '&:hover': {
              background: 'linear-gradient(135deg, rgba(15, 118, 110, 0.2) 0%, rgba(20, 184, 166, 0.3) 100%)',
              borderColor: '#0F766E',
              boxShadow: '0 6px 20px rgba(15, 118, 110, 0.18)',
              transform: 'translateY(-1px)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          }}
        >
          View All Notifications →
        </Button>
      </Box>
    </SwipeableDrawer>
  );
};

export default NotificationSheet;
