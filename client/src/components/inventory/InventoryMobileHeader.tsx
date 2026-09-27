import React, { useState } from 'react';
import { Box, Chip, IconButton, InputBase, SwipeableDrawer, Typography } from '@mui/material';
import { Check, ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';
import { InventoryViewMode } from '../../types/inventory';

interface InventoryMobileHeaderProps {
  viewMode: InventoryViewMode;
  onViewModeChange: (mode: InventoryViewMode) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  statusOptions: string[];
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

const VIEW_CHIPS: { label: string; value: InventoryViewMode }[] = [
  { label: 'Active Medicines', value: 'active' },
  { label: 'Archived Medicines', value: 'archived' },
  { label: 'Recently Deleted', value: 'deleted' },
];

const CHIP_ACTIVE_SX = {
  bgcolor: '#0F766E',
  color: '#FFFFFF',
  border: '1px solid #0F766E',
} as const;

const CHIP_IDLE_SX = {
  bgcolor: 'rgba(255, 255, 255, 0.5)',
  color: '#17313B',
  border: '1px solid rgba(255, 255, 255, 0.6)',
} as const;

/**
 * Compact mobile page header (<640px): title + catalog badge,
 * search bar, then a horizontally scrolling row of filter chips.
 * Category / Status chips open glass bottom-sheet pickers.
 */
export const InventoryMobileHeader: React.FC<InventoryMobileHeaderProps> = ({
  viewMode,
  onViewModeChange,
  searchTerm,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
  statusOptions,
  selectedStatus,
  onStatusChange,
}) => {
  // Which option picker sheet is open (null = none)
  const [picker, setPicker] = useState<'category' | 'status' | null>(null);

  return (
    <Box>
      {/* Title + Active Catalog badge */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
        <Typography sx={{ fontSize: '1.45rem', fontWeight: 800, color: '#17313B', letterSpacing: '-0.02em' }}>
          Inventory
        </Typography>
        <Chip
          size="small"
          label={
            viewMode === 'active'
              ? 'Active Catalog'
              : viewMode === 'archived'
              ? 'Archived Items'
              : 'Recently Deleted'
          }
          sx={{
            height: 24,
            fontSize: '0.72rem',
            fontWeight: 700,
            bgcolor:
              viewMode === 'active'
                ? 'rgba(15, 118, 110, 0.12)'
                : viewMode === 'archived'
                ? 'rgba(245, 158, 11, 0.15)'
                : 'rgba(239, 68, 68, 0.15)',
            color:
              viewMode === 'active'
                ? '#0F766E'
                : viewMode === 'archived'
                ? '#B45309'
                : '#B91C1C',
          }}
        />
      </Box>

      {/* Search bar */}
      <Box
        className="glass-input"
        sx={{ display: 'flex', alignItems: 'center', px: 2, mt: 1.5, minHeight: 48 }}
      >
        <Search size={19} color="#64748B" />
        <InputBase
          placeholder="Search medicines…"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          // 16px input text prevents iOS Safari auto-zoom on focus
          sx={{ ml: 1.25, flexGrow: 1, fontSize: '16px', color: '#17313B', minWidth: 0 }}
        />
        {searchTerm && (
          <IconButton aria-label="Clear search" size="small" onClick={() => onSearchChange('')} sx={{ p: 0.5 }}>
            <X size={16} />
          </IconButton>
        )}
      </Box>

      {/* Scrollable filter chips */}
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          mt: 1.5,
          overflowX: 'auto',
          pb: 0.75,
          // Keep the chip rail single-row; the page itself never scrolls horizontally
          flexWrap: 'nowrap',
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
        }}
      >
        {VIEW_CHIPS.map((chip) => {
          const isActive = viewMode === chip.value;
          return (
            <Chip
              key={chip.value}
              label={chip.label}
              onClick={() => onViewModeChange(chip.value)}
              sx={{
                flexShrink: 0,
                minHeight: 40,
                cursor: 'pointer',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.82rem',
                ...(isActive ? CHIP_ACTIVE_SX : CHIP_IDLE_SX),
                '&:hover': { bgcolor: isActive ? '#115E59' : 'rgba(255, 255, 255, 0.7)' },
              }}
            />
          );
        })}

        <Chip
          label={selectedCategory === 'All' ? 'Categories' : selectedCategory}
          onClick={() => setPicker('category')}
          icon={<SlidersHorizontal size={14} color="#0F766E" />}
          sx={{
            flexShrink: 0,
            minHeight: 40,
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.82rem',
            ...(selectedCategory !== 'All' ? CHIP_ACTIVE_SX : CHIP_IDLE_SX),
            '& .MuiChip-icon': { color: 'inherit' },
            '&:hover': { bgcolor: selectedCategory !== 'All' ? '#115E59' : 'rgba(255, 255, 255, 0.7)' },
          }}
        />

        {viewMode === 'active' && (
          <Chip
            label={selectedStatus === 'All' ? 'Status' : selectedStatus}
            onClick={() => setPicker('status')}
            icon={<SlidersHorizontal size={14} color="#0F766E" />}
            sx={{
              flexShrink: 0,
              minHeight: 40,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.82rem',
              ...(selectedStatus !== 'All' ? CHIP_ACTIVE_SX : CHIP_IDLE_SX),
              '& .MuiChip-icon': { color: 'inherit' },
              '&:hover': { bgcolor: selectedStatus !== 'All' ? '#115E59' : 'rgba(255, 255, 255, 0.7)' },
            }}
          />
        )}
      </Box>

      {/* ── Category / Status picker bottom sheets ── */}
      <SwipeableDrawer
        anchor="bottom"
        open={picker !== null}
        onOpen={() => {}}
        onClose={() => setPicker(null)}
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
            maxHeight: '72vh',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        {/* Grab handle */}
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1.25 }}>
          <Box sx={{ width: 44, height: 5, borderRadius: 3, bgcolor: 'rgba(15, 118, 110, 0.22)' }} />
        </Box>

        <Box sx={{ px: 2.5, pt: 1.5, pb: 0.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#17313B' }}>
            {picker === 'status' ? 'Filter by Status' : 'Filter by Category'}
          </Typography>
          <IconButton aria-label="Close filter" size="small" onClick={() => setPicker(null)} sx={{ color: '#64748B' }}>
            <ChevronDown size={20} />
          </IconButton>
        </Box>

        <Box sx={{ px: 2, pb: 'calc(16px + env(safe-area-inset-bottom, 0px))', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {(picker === 'status' ? statusOptions : ['All', ...categories]).map((option) => {
            const isSelected =
              picker === 'status'
                ? selectedStatus === option
                : selectedCategory === option;
            const label = option === 'All' ? (picker === 'status' ? 'All Statuses' : 'All Categories') : option;
            return (
              <Box
                key={option}
                onClick={() => {
                  if (picker === 'status') {
                    onStatusChange(option);
                  } else if (picker === 'category') {
                    onCategoryChange(option);
                  }
                  setPicker(null);
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  minHeight: 48,
                  px: 1.5,
                  borderRadius: '14px',
                  cursor: 'pointer',
                  transition: 'background 150ms ease',
                  bgcolor: isSelected ? 'rgba(15, 118, 110, 0.10)' : 'transparent',
                  '&:hover': { bgcolor: 'rgba(15, 118, 110, 0.08)' },
                }}
              >
                <Typography sx={{ fontSize: '0.95rem', fontWeight: isSelected ? 700 : 500, color: isSelected ? '#0F766E' : '#17313B' }}>
                  {label}
                </Typography>
                {isSelected && <Check size={18} color="#0F766E" />}
              </Box>
            );
          })}
        </Box>
      </SwipeableDrawer>
    </Box>
  );
};

export default InventoryMobileHeader;
