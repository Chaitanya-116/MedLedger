import React from 'react';
import { Box, Button, Chip, CircularProgress, SwipeableDrawer, Typography } from '@mui/material';
import { History, X } from 'lucide-react';
import type { AuditLogItem } from '../../types/inventory';
import { formatAuditTimestamp } from '../../utils';

interface AuditTrailSheetProps {
  open: boolean;
  onClose: () => void;
  logs: AuditLogItem[];
  loading: boolean;
}

/** Badge colour mapping — identical to the desktop audit dialog. */
const actionTone = (action: string): { bgcolor: string; color: string } => {
  if (action.includes('Added') || action.includes('Increased') || action.includes('Restored')) {
    return { bgcolor: 'rgba(34, 197, 94, 0.15)', color: '#166534' };
  }
  if (action.includes('Deleted')) {
    return { bgcolor: 'rgba(239, 68, 68, 0.15)', color: '#991B1B' };
  }
  return { bgcolor: 'rgba(15, 118, 110, 0.15)', color: '#0F766E' };
};

/**
 * Mobile Audit Trail (<640px only): a 90% height glass bottom sheet
 * with a sticky header, scrollable timeline and sticky Close button.
 */
export const AuditTrailSheet: React.FC<AuditTrailSheetProps> = ({ open, onClose, logs, loading }) => {
  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onOpen={() => {}}
      onClose={onClose}
      swipeAreaWidth={0}
      transitionDuration={280}
      slotProps={{ paper: { elevation: 0 } }}
      sx={{ zIndex: 2000 }}
      PaperProps={{
        sx: {
          height: '90dvh',
          borderTopLeftRadius: '28px',
          borderTopRightRadius: '28px',
          background: 'rgba(255, 255, 255, 0.55)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          boxShadow: '0 -16px 50px rgba(15, 118, 110, 0.22)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        },
      }}
    >
      {/* Grab handle */}
      <Box sx={{ flexShrink: 0, display: 'flex', justifyContent: 'center', pt: 1.25 }}>
        <Box sx={{ width: 44, height: 5, borderRadius: 3, bgcolor: 'rgba(15, 118, 110, 0.22)' }} />
      </Box>

      {/* ── Sticky header ── */}
      <Box
        sx={{
          flexShrink: 0,
          px: 2,
          pt: 1,
          pb: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          borderBottom: '1px solid rgba(15, 118, 110, 0.12)',
        }}
      >
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
          }}
        >
          <History size={20} color="#0F766E" />
        </Box>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#17313B', lineHeight: 1.2 }}>
            Inventory Audit Log
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748B' }}>
            Immutable history of all inventory operations
          </Typography>
        </Box>
        {/* Sticky close */}
        <Box
          role="button"
          aria-label="Close audit trail"
          tabIndex={0}
          onClick={onClose}
          sx={{
            width: 44,
            height: 44,
            flexShrink: 0,
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748B',
            bgcolor: 'rgba(15, 118, 110, 0.06)',
            '&:active': { bgcolor: 'rgba(15, 118, 110, 0.14)' },
          }}
        >
          <X size={20} />
        </Box>
      </Box>

      {/* ── Scrollable timeline ── */}
      <Box
        sx={{
          flexGrow: 1,
          minHeight: 0,
          overflowY: 'auto',
          px: 2,
          py: 2,
          // Fade the list under the sticky footer for depth
          maskImage: 'linear-gradient(to bottom, black calc(100% - 28px), transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, black calc(100% - 28px), transparent)',
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8, gap: 1.5 }}>
            <CircularProgress size={24} sx={{ color: '#0F766E' }} />
            <Typography variant="body2" sx={{ color: '#64748B' }}>
              Loading audit history…
            </Typography>
          </Box>
        ) : logs.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <History size={40} color="#94A3B8" />
            <Typography variant="body2" sx={{ color: '#64748B', mt: 1 }}>
              No audit log entries recorded yet.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ position: 'relative', pl: 2.75 }}>
            {/* Timeline rail */}
            <Box
              sx={{
                position: 'absolute',
                left: 9,
                top: 10,
                bottom: 10,
                width: 2,
                borderRadius: 2,
                background: 'linear-gradient(to bottom, rgba(15, 118, 110, 0.35), rgba(15, 118, 110, 0.08))',
              }}
            />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
              {logs.map((log) => {
                const tone = actionTone(log.action);
                return (
                  <Box key={log.id} sx={{ position: 'relative' }}>
                    {/* Timeline dot — centred on the rail (wrapper pad 22px, rail centre 10px) */}
                    <Box
                      sx={{
                        position: 'absolute',
                        left: -18,
                        top: 18,
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: tone.color,
                        border: '2.5px solid #FFFFFF',
                        boxShadow: `0 0 8px ${tone.bgcolor}`,
                      }}
                    />

                    {/* Event card */}
                    <Box
                      sx={{
                        p: 1.9,
                        borderRadius: '18px',
                        background: 'rgba(255, 255, 255, 0.55)',
                        border: '1px solid rgba(255, 255, 255, 0.6)',
                        boxShadow: '0 4px 14px rgba(15, 118, 110, 0.07)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.75,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                        <Chip
                          label={log.action}
                          size="small"
                          sx={{
                            height: 21,
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            flexShrink: 0,
                            ...tone,
                          }}
                        />
                        <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600, textAlign: 'right' }}>
                          {formatAuditTimestamp(log.created_at)}
                        </Typography>
                      </Box>

                      <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', color: '#17313B', wordBreak: 'break-word' }}>
                        {log.medicine_name}
                      </Typography>

                      <Typography variant="caption" sx={{ color: '#64748B', wordBreak: 'break-word' }}>
                        Performed by <strong>{log.user_name}</strong> ({log.user_email})
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}
      </Box>

      {/* ── Sticky footer ── */}
      <Box
        sx={{
          flexShrink: 0,
          px: 2,
          py: 1.5,
          pb: 'calc(12px + env(safe-area-inset-bottom, 0px))',
          borderTop: '1px solid rgba(15, 118, 110, 0.12)',
        }}
      >
        <Button fullWidth variant="outlined" onClick={onClose} sx={{ minHeight: 48, borderRadius: '16px', fontSize: '0.95rem' }}>
          Close
        </Button>
      </Box>
    </SwipeableDrawer>
  );
};

export default AuditTrailSheet;
