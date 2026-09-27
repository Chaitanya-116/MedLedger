import React from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Drawer,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { ArrowLeft, Package, X } from 'lucide-react';
import type { CreateMedicineDto } from '../../types/inventory';
import { formatCurrency } from '../../utils/formatCurrency';
import { PriceInput, QuantityInput } from './PriceInput';

interface AddMedicineSheetProps {
  open: boolean;
  onClose: () => void;
  categories: string[];
  formData: CreateMedicineDto;
  onChange: (patch: Partial<CreateMedicineDto>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

// Prevents iOS Safari auto-zoom: focused inputs must render at >=16px.
const inputSx = {
  '& .MuiInputBase-input': { fontSize: '16px' },
} as const;

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography
    variant="caption"
    sx={{ fontWeight: 800, color: '#0F766E', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}
  >
    {children}
  </Typography>
);

/**
 * Full-screen mobile "Add New Medicine" sheet (<640px only).
 * Reuses the page's formData / submit handler so validation and API
 * behaviour stay identical to the desktop modal. Sticky header and
 * footer keep Cancel / Save Medicine always visible and reachable.
 */
export const AddMedicineSheet: React.FC<AddMedicineSheetProps> = ({
  open,
  onClose,
  categories,
  formData,
  onChange,
  onSubmit,
}) => {
  // Live pricing calculator (same maths as the desktop modal)
  const liveProfit = formData.selling_price - formData.buying_price;
  const liveMargin =
    formData.selling_price > 0 ? ((liveProfit / formData.selling_price) * 100).toFixed(1) : '0.0';

  const priceWarning =
    formData.mrp < formData.selling_price
      ? 'MRP is lower than Selling Price! MRP must be >= Selling Price.'
      : formData.selling_price < formData.buying_price
      ? 'Selling Price is lower than Buying Price (Loss per unit).'
      : null;

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      transitionDuration={280}
      slotProps={{ paper: { elevation: 0 } }}
      sx={{ zIndex: 2000 }}
      PaperProps={{
        sx: {
          // Dynamic viewport height keeps the footer visible above mobile browser chrome
          height: '100dvh',
          borderRadius: 0,
          background: 'linear-gradient(135deg, #DDF6F3 0%, #ECF9F8 45%, #F8FCFC 100%)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        },
      }}
    >
      <form
        onSubmit={onSubmit}
        style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}
      >
        {/* ── Sticky header ── */}
        <Box
          sx={{
            flexShrink: 0,
            px: 1.5,
            py: 1.25,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            bgcolor: 'rgba(255, 255, 255, 0.55)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderBottom: '1px solid rgba(15, 118, 110, 0.14)',
          }}
        >
          {/* Back */}
          <Box
            role="button"
            aria-label="Back"
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
              color: '#17313B',
              '&:active': { bgcolor: 'rgba(15, 118, 110, 0.1)' },
            }}
          >
            <ArrowLeft size={22} />
          </Box>

          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#17313B', lineHeight: 1.2 }}>
              Add New Medicine
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B' }}>
              Stock, pricing and batch details
            </Typography>
          </Box>

          {/* Close */}
          <Box
            role="button"
            aria-label="Close"
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
              '&:active': { bgcolor: 'rgba(15, 118, 110, 0.1)' },
            }}
          >
            <X size={21} />
          </Box>
        </Box>

        {/* ── Scrollable form body ── */}
        <Box
          sx={{
            flexGrow: 1,
            minHeight: 0,
            overflowY: 'auto',
            px: 2,
            py: 2.5,
            display: 'flex',
            flexDirection: 'column',
            gap: 2.75,
          }}
        >
          {/* Basic Information */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
            <SectionLabel>Basic Information</SectionLabel>
            <TextField
              label="Medicine Name *"
              required
              fullWidth
              size="small"
              sx={inputSx}
              value={formData.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="e.g. Amoxicillin 500mg Capsule"
            />
            <TextField
              label="Brand / Manufacturer *"
              required
              fullWidth
              size="small"
              sx={inputSx}
              value={formData.brand}
              onChange={(e) => onChange({ brand: e.target.value })}
              placeholder="e.g. Novartis"
            />
            <FormControl size="small" fullWidth>
              <Select
                value={formData.category}
                onChange={(e) => onChange({ category: e.target.value })}
                sx={{ fontSize: '16px' }}
                MenuProps={{ sx: { zIndex: 2100 } }}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="SKU (Auto-generates if empty)"
              fullWidth
              size="small"
              sx={inputSx}
              value={formData.sku}
              onChange={(e) => onChange({ sku: e.target.value })}
              placeholder="e.g. MED-AMX-500"
            />
            <TextField
              label="Batch Code"
              fullWidth
              size="small"
              sx={inputSx}
              value={formData.batch_number}
              onChange={(e) => onChange({ batch_number: e.target.value })}
              placeholder="e.g. BAT-2026-88"
            />
          </Box>

          {/* Stock Information */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
            <SectionLabel>Stock Information</SectionLabel>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.75 }}>
              <QuantityInput
                label="Quantity *"
                sx={inputSx}
                value={formData.stock}
                onChange={(stock) => onChange({ stock })}
                fallback={0}
                min={0}
              />
              <QuantityInput
                label="Min Stock Alert *"
                sx={inputSx}
                value={formData.min_stock}
                onChange={(min_stock) => onChange({ min_stock })}
                fallback={1}
                min={1}
              />
            </Box>
          </Box>

          {/* Pricing Calculator */}
          <Box
            sx={{
              p: 2,
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.45)',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.75,
            }}
          >
            <SectionLabel>Pricing Calculator (INR ₹)</SectionLabel>
            <PriceInput
              label="Buying Price (₹) *"
              sx={inputSx}
              value={formData.buying_price}
              onChange={(buying_price) => onChange({ buying_price })}
            />
            <PriceInput
              label="Selling Price (₹) *"
              sx={inputSx}
              value={formData.selling_price}
              onChange={(selling_price) => onChange({ selling_price })}
            />
            <PriceInput
              label="MRP (₹) *"
              sx={inputSx}
              value={formData.mrp}
              onChange={(mrp) => onChange({ mrp })}
            />

            {/* Profit read-outs */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap' }}>
              <Chip
                label={`Profit / Unit: ${formatCurrency(liveProfit)}`}
                size="small"
                sx={{
                  fontWeight: 700,
                  bgcolor: liveProfit >= 0 ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: liveProfit >= 0 ? '#166534' : '#991B1B',
                }}
              />
              <Chip
                label={`Profit Margin: ${liveMargin}%`}
                size="small"
                sx={{
                  fontWeight: 700,
                  bgcolor:
                    parseFloat(liveMargin) >= 15 ? 'rgba(15, 118, 110, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  color: parseFloat(liveMargin) >= 15 ? '#0F766E' : '#B45309',
                }}
              />
            </Box>

            {priceWarning && (
              <Alert severity="warning" sx={{ borderRadius: '12px', py: 0, fontSize: '0.8rem' }}>
                {priceWarning}
              </Alert>
            )}
          </Box>

          {/* Dates */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
            <SectionLabel>Dates</SectionLabel>
            <TextField
              label="Manufacturing Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              size="small"
              sx={inputSx}
              value={formData.manufacturing_date}
              onChange={(e) => onChange({ manufacturing_date: e.target.value })}
            />
            <TextField
              label="Expiry Date *"
              type="date"
              required
              InputLabelProps={{ shrink: true }}
              fullWidth
              size="small"
              sx={inputSx}
              value={formData.expiry_date}
              onChange={(e) => onChange({ expiry_date: e.target.value })}
            />
          </Box>

          {/* Supplier */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
            <SectionLabel>Supplier</SectionLabel>
            <TextField
              label="Supplier Name"
              fullWidth
              size="small"
              sx={inputSx}
              value={formData.supplier_name}
              onChange={(e) => onChange({ supplier_name: e.target.value })}
              placeholder="e.g. Apollo Distribution"
            />
          </Box>

          {/* Notes */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
            <SectionLabel>Notes</SectionLabel>
            <TextField
              label="Operational Notes"
              fullWidth
              size="small"
              multiline
              rows={2}
              sx={inputSx}
              value={formData.notes}
              onChange={(e) => onChange({ notes: e.target.value })}
              placeholder="e.g. Keep refrigerated at 2-8°C"
            />
          </Box>

          {/* Footer breathing room while scrolling */}
          <Box sx={{ pb: 1 }} />
        </Box>

        {/* ── Sticky footer ── */}
        <Box
          sx={{
            flexShrink: 0,
            px: 2,
            py: 1.5,
            pb: 'calc(12px + env(safe-area-inset-bottom, 0px))',
            display: 'flex',
            gap: 1.5,
            bgcolor: 'rgba(255, 255, 255, 0.55)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderTop: '1px solid rgba(15, 118, 110, 0.14)',
          }}
        >
          <Button
            type="button"
            variant="outlined"
            onClick={onClose}
            sx={{ flex: 1, minHeight: 48, borderRadius: '16px', fontSize: '0.95rem' }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            className="glass-button"
            startIcon={<Package size={18} />}
            sx={{ flex: 1.4, minHeight: 48, borderRadius: '16px', fontSize: '0.95rem' }}
          >
            Save Medicine
          </Button>
        </Box>
      </form>
    </Drawer>
  );
};

export default AddMedicineSheet;
