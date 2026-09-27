import React from 'react';
import { Box, Chip, IconButton, Typography } from '@mui/material';
import { Archive, Edit2, RotateCcw, Trash2 } from 'lucide-react';
import { InventoryViewMode, Medicine, MedicineStatus } from '../../types/inventory';
import { formatCurrency } from '../../utils/formatCurrency';
import { computeMedicineStatus } from '../../utils/medicineStatus';
import { MedicineStatusChip } from './MedicineStatusChip';

interface MedicineCardProps {
  med: Medicine;
  viewMode: InventoryViewMode;
  isAdmin: boolean;
  onEdit: (med: Medicine) => void;
  onArchive: (med: Medicine) => void;
  onDelete: (med: Medicine) => void;
  onRestore: (med: Medicine) => void;
  onPermanentDelete: (med: Medicine) => void;
}

/** Small labelled value cell used inside the 2-column information grid. */
const InfoCell: React.FC<{ label: string; value: string; color?: string }> = ({
  label,
  value,
  color = '#17313B',
}) => (
  <Box sx={{ minWidth: 0 }}>
    <Typography
      variant="caption"
      sx={{ color: '#94A3B8', fontWeight: 600, fontSize: '0.68rem', display: 'block' }}
    >
      {label}
    </Typography>
    <Typography variant="body2" sx={{ fontWeight: 700, color, lineHeight: 1.3, overflowWrap: 'anywhere' }}>
      {value}
    </Typography>
  </Box>
);

/** Single "Label · value" detail line under the card header. */
const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, minWidth: 0 }}>
    <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600, flexShrink: 0, width: 58 }}>
      {label}
    </Typography>
    <Typography
      variant="caption"
      sx={{
        color: '#475569',
        fontWeight: 600,
        minWidth: 0,
        overflowWrap: 'anywhere',
      }}
    >
      {value}
    </Typography>
  </Box>
);

const ACTION_BASE_SX = {
  width: 48,
  height: 48,
  borderRadius: '14px',
  border: '1px solid rgba(255, 255, 255, 0.5)',
} as const;

/**
 * Glass medicine card for the mobile inventory list (<640px).
 * Rounded 22px, mint border, soft shadow; the parent list applies the 16px gap.
 * Quick-action buttons keep a 48x48px minimum touch target.
 */
export const MedicineCard: React.FC<MedicineCardProps> = ({
  med,
  viewMode,
  isAdmin,
  onEdit,
  onArchive,
  onDelete,
  onRestore,
  onPermanentDelete,
}) => {
  const status: MedicineStatus =
    med.status || computeMedicineStatus(med.stock, med.min_stock, med.expiry_date);

  const expiryColor =
    status === 'Expired' ? '#991B1B' : status === 'Expiring Soon' ? '#C2410C' : '#17313B';

  return (
    <Box
      sx={{
        borderRadius: '22px',
        p: 2.25,
        background: 'rgba(255, 255, 255, 0.42)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(15, 118, 110, 0.14)',
        boxShadow: '0 8px 24px rgba(15, 118, 110, 0.10)',
        transition: 'box-shadow 200ms ease',
      }}
    >
      {/* ── Header: Name + Category pill + Status badge ── */}
      <Typography
        sx={{
          fontWeight: 800,
          color: '#17313B',
          fontSize: '1.08rem',
          lineHeight: 1.25,
          overflowWrap: 'anywhere',
        }}
      >
        {med.name}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 1 }}>
        <Chip
          label={med.category}
          size="small"
          sx={{
            height: 24,
            borderRadius: '10px',
            fontSize: '0.72rem',
            bgcolor: 'rgba(15, 118, 110, 0.1)',
            color: '#0F766E',
            fontWeight: 700,
          }}
        />
        <MedicineStatusChip status={status} />
      </Box>

      {/* ── Details: Brand / SKU / Batch ── */}
      <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 0.4 }}>
        <DetailRow label="Brand" value={med.brand || '—'} />
        <DetailRow label="SKU" value={med.sku} />
        <DetailRow label="Batch No." value={med.batch_number || '—'} />
      </Box>

      {/* ── Information Grid (2 columns) ── */}
      <Box
        sx={{
          mt: 1.75,
          pt: 1.75,
          borderTop: '1px dashed rgba(15, 118, 110, 0.18)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 1.5,
        }}
      >
        <InfoCell
          label="STOCK QUANTITY"
          value={`${med.stock} Units`}
          color={med.stock <= med.min_stock ? '#EF4444' : '#17313B'}
        />
        <InfoCell label="MINIMUM STOCK" value={`${med.min_stock}`} />
        <InfoCell label="BUYING PRICE" value={formatCurrency(med.buying_price)} />
        <InfoCell label="SELLING PRICE" value={formatCurrency(med.selling_price)} color="#0F766E" />
        <InfoCell label="MRP" value={formatCurrency(med.mrp)} />
        <InfoCell label="EXPIRY DATE" value={med.expiry_date} color={expiryColor} />
      </Box>

      {/* ── Quick Actions (mirrors the desktop table's per-view actions) ── */}
      <Box
        sx={{
          mt: 1.75,
          pt: 1.5,
          borderTop: '1px solid rgba(15, 118, 110, 0.12)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1,
          minHeight: 48,
        }}
      >
        {!isAdmin ? (
          <Chip
            label="Read Only"
            size="small"
            sx={{
              bgcolor: 'rgba(241, 245, 249, 0.8)',
              color: '#64748B',
              fontSize: '0.7rem',
              fontWeight: 600,
            }}
          />
        ) : (
          <>
            {viewMode === 'active' && (
              <>
                <IconButton
                  aria-label="Edit medicine"
                  onClick={() => onEdit(med)}
                  sx={{ ...ACTION_BASE_SX, color: '#0F766E', '&:hover': { bgcolor: 'rgba(15,118,110,0.1)' } }}
                >
                  <Edit2 size={19} />
                </IconButton>
                <IconButton
                  aria-label="Archive medicine"
                  onClick={() => onArchive(med)}
                  sx={{ ...ACTION_BASE_SX, color: '#D97706', '&:hover': { bgcolor: 'rgba(217,119,6,0.1)' } }}
                >
                  <Archive size={19} />
                </IconButton>
                <IconButton
                  aria-label="Delete options"
                  onClick={() => onDelete(med)}
                  sx={{ ...ACTION_BASE_SX, color: '#EF4444', '&:hover': { bgcolor: 'rgba(239,68,68,0.1)' } }}
                >
                  <Trash2 size={19} />
                </IconButton>
              </>
            )}

            {viewMode === 'archived' && (
              <>
                <IconButton
                  aria-label="Restore to active inventory"
                  onClick={() => onRestore(med)}
                  sx={{ ...ACTION_BASE_SX, color: '#0F766E', '&:hover': { bgcolor: 'rgba(15,118,110,0.1)' } }}
                >
                  <RotateCcw size={19} />
                </IconButton>
                <IconButton
                  aria-label="Delete medicine"
                  onClick={() => onDelete(med)}
                  sx={{ ...ACTION_BASE_SX, color: '#EF4444', '&:hover': { bgcolor: 'rgba(239,68,68,0.1)' } }}
                >
                  <Trash2 size={19} />
                </IconButton>
              </>
            )}

            {viewMode === 'deleted' && (
              <>
                <IconButton
                  aria-label="Restore to active inventory"
                  onClick={() => onRestore(med)}
                  sx={{ ...ACTION_BASE_SX, color: '#0F766E', '&:hover': { bgcolor: 'rgba(15,118,110,0.1)' } }}
                >
                  <RotateCcw size={19} />
                </IconButton>
                <IconButton
                  aria-label="Permanently delete forever"
                  onClick={() => onPermanentDelete(med)}
                  sx={{ ...ACTION_BASE_SX, color: '#991B1B', '&:hover': { bgcolor: 'rgba(153,27,27,0.15)' } }}
                >
                  <Trash2 size={19} />
                </IconButton>
              </>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default MedicineCard;
