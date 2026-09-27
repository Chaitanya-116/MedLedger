import React from 'react';
import { Chip } from '@mui/material';
import { AlertTriangle, Ban, CheckCircle2, Clock, ShieldAlert } from 'lucide-react';
import { MedicineStatus } from '../../types/inventory';

interface MedicineStatusChipProps {
  status: MedicineStatus;
}

/**
 * Status badge for the mobile medicine card.
 * Mirrors the color mapping of the desktop table's renderStatusChip()
 * so both surfaces read as one system.
 */
export const MedicineStatusChip: React.FC<MedicineStatusChipProps> = ({ status }) => {
  switch (status) {
    case 'Healthy Stock':
      return (
        <Chip
          icon={<CheckCircle2 size={13} />}
          label="Healthy Stock"
          size="small"
          sx={{
            bgcolor: 'rgba(34, 197, 94, 0.15)',
            color: '#166534',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            fontWeight: 700,
          }}
        />
      );
    case 'Low Stock':
      return (
        <Chip
          icon={<AlertTriangle size={13} />}
          label="Low Stock"
          size="small"
          sx={{
            bgcolor: 'rgba(239, 68, 68, 0.15)',
            color: '#991B1B',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            fontWeight: 700,
          }}
        />
      );
    case 'Out of Stock':
      return (
        <Chip
          icon={<Ban size={13} />}
          label="Out of Stock"
          size="small"
          sx={{
            bgcolor: 'rgba(100, 116, 139, 0.15)',
            color: '#475569',
            border: '1px solid rgba(100, 116, 139, 0.3)',
            fontWeight: 700,
          }}
        />
      );
    case 'Expiring Soon':
      return (
        <Chip
          icon={<Clock size={13} />}
          label="Expiring Soon"
          size="small"
          sx={{
            bgcolor: 'rgba(251, 146, 60, 0.15)',
            color: '#9A3412',
            border: '1px solid rgba(251, 146, 60, 0.3)',
            fontWeight: 700,
          }}
        />
      );
    case 'Expired':
      return (
        <Chip
          icon={<ShieldAlert size={13} />}
          label="Expired"
          size="small"
          sx={{
            bgcolor: 'rgba(153, 27, 27, 0.2)',
            color: '#7F1D1D',
            border: '1px solid rgba(153, 27, 27, 0.4)',
            fontWeight: 800,
          }}
        />
      );
    default:
      return <Chip label={status} size="small" />;
  }
};

export default MedicineStatusChip;
