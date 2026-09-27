import React, { useState } from 'react';
import { Box, SwipeableDrawer, Typography } from '@mui/material';
import { Download, History, Plus, X } from 'lucide-react';
import type { ReactNode } from 'react';

interface ActionsFabProps {
  isAdmin: boolean;
  onAdd: () => void;
  onAudit: () => void;
  onExport: () => void;
}

interface ActionItem {
  icon: ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
}

/**
 * Floating Inventory "+" button (<640px only) that opens the
 * glass "Inventory Actions" bottom sheet. Dismissable by swipe
 * or by tapping the backdrop.
 */
export const ActionsFab: React.FC<ActionsFabProps> = ({ isAdmin, onAdd, onAudit, onExport }) => {
  const [open, setOpen] = useState(false);

  const actions: ActionItem[] = [
    ...(isAdmin
      ? [
          {
            icon: <Plus size={21} color="#0F766E" />,
            title: 'Add New Medicine',
            subtitle: 'Register a new SKU with stock and pricing',
            onClick: onAdd,
          },
        ]
      : []),
    {
      icon: <History size={21} color="#0F766E" />,
      title: 'Audit Trail',
      subtitle: 'Complete history of inventory operations',
      onClick: onAudit,
    },
    {
      icon: <Download size={21} color="#0F766E" />,
      title: 'Export CSV',
      subtitle: 'Download the current list as a spreadsheet',
      onClick: onExport,
    },
  ];

  return (
    <>
      {/* Floating action button — sits above the mobile bottom nav */}
      <Box
        role="button"
        aria-label="Open inventory actions"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') setOpen(true);
        }}
        sx={{
          position: 'fixed',
          right: 18,
          bottom: 'calc(88px + env(safe-area-inset-bottom, 0px))',
          width: 58,
          height: 58,
          borderRadius: '50%',
          zIndex: 1250,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#FFFFFF',
          background: 'linear-gradient(135deg, #0F766E 0%, #115E59 100%)',
          boxShadow: '0 10px 26px rgba(15, 118, 110, 0.38)',
          transition: 'transform 200ms ease, box-shadow 200ms ease',
          '&:active': { transform: 'scale(0.94)' },
          '@media (min-width: 640px)': { display: 'none' },
        }}
      >
        <Plus size={26} strokeWidth={2.5} />
      </Box>

      {/* Inventory Actions bottom sheet — dismissable by swipe or outside tap */}
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onOpen={() => {}}
        onClose={() => setOpen(false)}
        // swipeAreaWidth 0 = never opens by accident; closing swipe stays enabled
        swipeAreaWidth={0}
        transitionDuration={260}
        slotProps={{ paper: { elevation: 0 } }}
        sx={{ zIndex: 2000 }}
        PaperProps={{
          sx: {
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            boxShadow: '0 -12px 40px rgba(15, 118, 110, 0.18)',
          },
        }}
      >
        {/* Grab handle */}
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1.25 }}>
          <Box sx={{ width: 44, height: 5, borderRadius: 3, bgcolor: 'rgba(15, 118, 110, 0.22)' }} />
        </Box>

        <Box sx={{ px: 2.5, pt: 1.5, pb: 0.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#17313B' }}>
            Inventory Actions
          </Typography>
          <Box
            aria-label="Close actions"
            onClick={() => setOpen(false)}
            sx={{
              width: 32,
              height: 32,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              bgcolor: 'rgba(15, 118, 110, 0.08)',
              color: '#64748B',
              '&:hover': { bgcolor: 'rgba(15, 118, 110, 0.14)' },
            }}
          >
            <X size={17} />
          </Box>
        </Box>

        <Box sx={{ px: 2, pt: 1, pb: 'calc(16px + env(safe-area-inset-bottom, 0px))', display: 'flex', flexDirection: 'column', gap: 1 }}>
          {actions.map((action) => (
            <Box
              key={action.title}
              onClick={() => {
                setOpen(false);
                action.onClick();
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.75,
                p: 1.75,
                minHeight: 64,
                borderRadius: '18px',
                cursor: 'pointer',
                bgcolor: 'rgba(255, 255, 255, 0.55)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                transition: 'all 180ms ease',
                '&:hover': {
                  bgcolor: 'rgba(15, 118, 110, 0.07)',
                  borderColor: 'rgba(15, 118, 110, 0.2)',
                },
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  flexShrink: 0,
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(15, 118, 110, 0.1)',
                }}
              >
                {action.icon}
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#17313B' }}>
                  {action.title}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                  {action.subtitle}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </SwipeableDrawer>
    </>
  );
};

export default ActionsFab;
