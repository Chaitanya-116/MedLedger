import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  InputBase,
  MenuItem,
  Select,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Pagination,
  Snackbar,
  Alert,
  CircularProgress,
  useMediaQuery,
} from '@mui/material';
import {
  Search,
  Plus,
  Download,
  Edit2,
  Trash2,
  Archive,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Package,
  X,
  History,
  Ban,
  ShieldAlert,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatCurrency';
import { formatAuditTimestamp } from '../utils';
import { computeMedicineStatus } from '../utils/medicineStatus';
import inventoryService from '../services/inventoryService';
import {
  InventoryMobileHeader,
  ActionsFab,
  AddMedicineSheet,
  AuditTrailSheet,
  MedicineCard,
  PriceInput,
  QuantityInput,
} from '../components/inventory';
import {
  Medicine,
  InventoryViewMode,
  CreateMedicineDto,
  AuditLogItem,
} from '../types/inventory';

// Re-exported for backwards compatibility (logic now lives in utils/medicineStatus)
export { computeMedicineStatus };

// ─── Categories List ──────────────────────────────────────────────────────────
const CATEGORIES = [
  'All',
  'Antibiotics',
  'Analgesics',
  'Cardiology',
  'Diabetes',
  'Gastroenterology',
  'Vitamins',
  'Antihistamine',
  'Dermatology',
  'Respiratory',
  'Others',
];

const STATUS_FILTERS = [
  'All',
  'Healthy Stock',
  'Low Stock',
  'Out of Stock',
  'Expiring Soon',
  'Expired',
];

// Helper to compute status locally for real-time responsiveness — now shared in utils/medicineStatus

export const Inventory: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  // Mobile (<640px) switches the page to the card + bottom-sheet experience.
  // Tablet (640–1023px) keeps the table, compacted via max-width media queries.
  const isMobile = useMediaQuery('(max-width: 639.95px)', { noSsr: true });

  // ─── State Management ─────────────────────────────────────────────────────
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<InventoryViewMode>('active');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isPermanentConfirmOpen, setIsPermanentConfirmOpen] = useState<boolean>(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);

  // Selected Medicine for Edit/Delete
  const [activeMedicine, setActiveMedicine] = useState<Medicine | null>(null);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [loadingAudit, setLoadingAudit] = useState<boolean>(false);

  // Toast / Feedback State
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showToast = (message: string, severity: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    setToast({ open: true, message, severity });
  };

  // ─── Form States ──────────────────────────────────────────────────────────
  const [formData, setFormData] = useState<CreateMedicineDto>({
    name: '',
    brand: '',
    category: 'Antibiotics',
    sku: '',
    batch_number: '',
    stock: 100,
    min_stock: 20,
    buying_price: 50,
    selling_price: 75,
    mrp: 90,
    expiry_date: '',
    manufacturing_date: '',
    supplier_name: '',
    notes: '',
  });

  // Stock adjustment in Edit modal
  const [stockAdjAmount, setStockAdjAmount] = useState<number>(10);
  const [stockAdjMode, setStockAdjMode] = useState<'ADD' | 'REMOVE'>('ADD');

  // ─── Data Fetching ────────────────────────────────────────────────────────
  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      let data: Medicine[] = [];
      if (viewMode === 'active') {
        data = await inventoryService.getActiveInventory();
      } else if (viewMode === 'archived') {
        data = await inventoryService.getArchivedInventory();
      } else {
        data = await inventoryService.getRecentlyDeletedInventory();
      }
      setMedicines(data);
    } catch (err: any) {
      console.error('Failed to fetch inventory:', err);
      showToast(err.response?.data?.detail || 'Failed to load inventory from server.', 'error');
    } finally {
      setLoading(false);
    }
  }, [viewMode]);

  useEffect(() => {
    fetchInventory();
    setCurrentPage(1);
  }, [fetchInventory]);

  // ─── Filter & Search Logic ────────────────────────────────────────────────
  const filteredMedicines = useMemo(() => {
    return medicines.filter((item) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        item.name.toLowerCase().includes(term) ||
        item.brand.toLowerCase().includes(term) ||
        item.sku.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term) ||
        (item.supplier_name && item.supplier_name.toLowerCase().includes(term));

      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;

      const computedStatus = item.status || computeMedicineStatus(item.stock, item.min_stock, item.expiry_date);
      const matchesStatus =
        selectedStatus === 'All' || computedStatus === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [medicines, searchTerm, selectedCategory, selectedStatus]);

  // Paginated subset
  const paginatedMedicines = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredMedicines.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredMedicines, currentPage]);

  const totalPages = Math.ceil(filteredMedicines.length / itemsPerPage) || 1;

  // ─── Add Medicine Action ──────────────────────────────────────────────────
  const handleOpenAddModal = () => {
    // Generate default future date
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const defaultExpDate = nextYear.toISOString().split('T')[0];

    const today = new Date().toISOString().split('T')[0];

    setFormData({
      name: '',
      brand: '',
      category: 'Antibiotics',
      sku: '',
      batch_number: `BAT-${new Date().getFullYear()}-${Math.floor(10 + Math.random() * 90)}`,
      stock: 100,
      min_stock: 20,
      buying_price: 50,
      selling_price: 75,
      mrp: 90,
      expiry_date: defaultExpDate,
      manufacturing_date: today,
      supplier_name: '',
      notes: '',
    });
    setIsAddModalOpen(true);
  };

  const handleSaveNewMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.brand.trim() || !formData.expiry_date) {
      showToast('Please fill in all required fields (Name, Brand, Expiry Date).', 'warning');
      return;
    }

    try {
      const created = await inventoryService.createMedicine(formData);
      showToast(`Medicine "${created.name}" added successfully to inventory!`, 'success');
      setIsAddModalOpen(false);
      fetchInventory();
    } catch (err: any) {
      console.error('Failed to create medicine:', err);
      showToast(err.response?.data?.detail || 'Failed to save medicine.', 'error');
    }
  };

  // ─── Edit Medicine Action ─────────────────────────────────────────────────
  const handleOpenEditModal = (med: Medicine) => {
    setActiveMedicine(med);
    setFormData({
      name: med.name,
      brand: med.brand,
      category: med.category,
      sku: med.sku,
      batch_number: med.batch_number || '',
      stock: med.stock,
      min_stock: med.min_stock,
      buying_price: med.buying_price,
      selling_price: med.selling_price,
      mrp: med.mrp,
      expiry_date: med.expiry_date,
      manufacturing_date: med.manufacturing_date || '',
      supplier_name: med.supplier_name || '',
      notes: med.notes || '',
    });
    setStockAdjAmount(10);
    setStockAdjMode('ADD');
    setIsEditModalOpen(true);
  };

  const handleSaveEditMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMedicine) return;

    try {
      const updated = await inventoryService.updateMedicine(activeMedicine.id, formData);
      showToast(`Medicine "${updated.name}" updated successfully!`, 'success');
      setIsEditModalOpen(false);
      fetchInventory();
    } catch (err: any) {
      console.error('Failed to update medicine:', err);
      showToast(err.response?.data?.detail || 'Failed to update medicine.', 'error');
    }
  };

  // ─── Quick Stock Adjustment ───────────────────────────────────────────────
  const handleApplyStockAdjustment = async () => {
    if (!activeMedicine) return;
    if (stockAdjAmount <= 0) {
      showToast('Adjustment quantity must be greater than 0.', 'warning');
      return;
    }

    if (stockAdjMode === 'REMOVE' && stockAdjAmount > formData.stock) {
      showToast(`Cannot remove ${stockAdjAmount} units. Current stock is ${formData.stock}.`, 'warning');
      return;
    }

    try {
      const updated = await inventoryService.adjustStock(activeMedicine.id, {
        adjustment_type: stockAdjMode,
        quantity: stockAdjAmount,
        notes: `Manual ${stockAdjMode} by ${user?.full_name || 'Admin'}`,
      });

      setFormData((prev) => ({ ...prev, stock: updated.stock }));
      setActiveMedicine(updated);
      showToast(`Stock successfully updated to ${updated.stock} units!`, 'success');
      fetchInventory();
    } catch (err: any) {
      console.error('Failed to adjust stock:', err);
      showToast(err.response?.data?.detail || 'Stock adjustment failed.', 'error');
    }
  };

  // ─── Archive Action ───────────────────────────────────────────────────────
  const handleArchiveMedicine = async (med: Medicine) => {
    try {
      await inventoryService.archiveMedicine(med.id);
      showToast(`"${med.name}" moved to Archived Medicines.`, 'info');
      fetchInventory();
    } catch (err: any) {
      console.error('Failed to archive medicine:', err);
      showToast(err.response?.data?.detail || 'Failed to archive medicine.', 'error');
    }
  };

  // ─── Restore Action ───────────────────────────────────────────────────────
  const handleRestoreMedicine = async (med: Medicine) => {
    try {
      await inventoryService.restoreMedicine(med.id);
      showToast(`"${med.name}" restored back to Active Inventory!`, 'success');
      fetchInventory();
    } catch (err: any) {
      console.error('Failed to restore medicine:', err);
      showToast(err.response?.data?.detail || 'Failed to restore medicine.', 'error');
    }
  };

  // ─── Delete Dialog Actions ────────────────────────────────────────────────
  const handleOpenDeleteDialog = (med: Medicine) => {
    setActiveMedicine(med);
    setIsDeleteModalOpen(true);
  };

  const handleSoftDelete = async () => {
    if (!activeMedicine) return;
    try {
      await inventoryService.softDeleteMedicine(activeMedicine.id);
      showToast(`"${activeMedicine.name}" moved to Recently Deleted.`, 'warning');
      setIsDeleteModalOpen(false);
      fetchInventory();
    } catch (err: any) {
      console.error('Failed to soft delete medicine:', err);
      showToast(err.response?.data?.detail || 'Failed to delete medicine.', 'error');
    }
  };

  const handleOpenPermanentConfirm = () => {
    setIsDeleteModalOpen(false);
    setIsPermanentConfirmOpen(true);
  };

  const handlePermanentDelete = async () => {
    if (!activeMedicine) return;
    try {
      await inventoryService.permanentlyDeleteMedicine(activeMedicine.id);
      showToast(`"${activeMedicine.name}" permanently deleted from database.`, 'error');
      setIsPermanentConfirmOpen(false);
      fetchInventory();
    } catch (err: any) {
      console.error('Failed to permanently delete:', err);
      showToast(err.response?.data?.detail || 'Permanent deletion failed.', 'error');
    }
  };

  // ─── Audit Logs ───────────────────────────────────────────────────────────
  const handleOpenAuditModal = async () => {
    setIsAuditModalOpen(true);
    setLoadingAudit(true);
    try {
      const logs = await inventoryService.getAuditLogs(50);
      setAuditLogs(logs);
    } catch (err: any) {
      console.error('Failed to load audit logs:', err);
      showToast('Could not load audit logs.', 'error');
    } finally {
      setLoadingAudit(false);
    }
  };

  // ─── Export CSV ───────────────────────────────────────────────────────────
  const handleExportCSV = () => {
    if (filteredMedicines.length === 0) {
      showToast('No medicines available to export.', 'warning');
      return;
    }

    const headers = [
      'Name',
      'Brand',
      'SKU',
      'Category',
      'Stock',
      'Min Stock',
      'Buying Price (INR)',
      'Selling Price (INR)',
      'MRP (INR)',
      'Expiry Date',
      'Status',
      'Supplier',
    ];

    const rows = filteredMedicines.map((m) => [
      `"${m.name.replace(/"/g, '""')}"`,
      `"${m.brand.replace(/"/g, '""')}"`,
      `"${m.sku}"`,
      `"${m.category}"`,
      m.stock,
      m.min_stock,
      m.buying_price.toFixed(2),
      m.selling_price.toFixed(2),
      m.mrp.toFixed(2),
      m.expiry_date,
      `"${m.status || computeMedicineStatus(m.stock, m.min_stock, m.expiry_date)}"`,
      `"${(m.supplier_name || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `MedLedger_${viewMode}_inventory_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${filteredMedicines.length} medicines to CSV.`, 'success');
  };

  // ─── Status Chip Badge Renderer ───────────────────────────────────────────
  const renderStatusChip = (item: Medicine) => {
    const status = item.status || computeMedicineStatus(item.stock, item.min_stock, item.expiry_date);

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

  // Live profit calculation for modal
  const liveProfit = formData.selling_price - formData.buying_price;
  const liveMargin =
    formData.selling_price > 0
      ? ((liveProfit / formData.selling_price) * 100).toFixed(1)
      : '0.0';

  const priceWarning =
    formData.mrp < formData.selling_price
      ? 'MRP is lower than Selling Price! MRP must be >= Selling Price.'
      : formData.selling_price < formData.buying_price
      ? 'Selling Price is lower than Buying Price (Loss per unit).'
      : null;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        // Tablet (640–1023px): tighter vertical rhythm — desktop >=1024px unchanged
        '@media (max-width: 1023.95px)': { gap: 2 },
        // Mobile (<640px): keep clear of the floating action button
        '@media (max-width: 639.95px)': { paddingBottom: '84px' },
      }}
    >
      {/* ─── Mobile Header: title, badge, search, filter chips (<640px) ──── */}
      {isMobile && (
        <InventoryMobileHeader
          viewMode={viewMode}
          onViewModeChange={(mode) => {
            setViewMode(mode);
            setCurrentPage(1);
          }}
          searchTerm={searchTerm}
          onSearchChange={(term) => {
            setSearchTerm(term);
            setCurrentPage(1);
          }}
          categories={CATEGORIES.filter((c) => c !== 'All')}
          selectedCategory={selectedCategory}
          onCategoryChange={(category) => {
            setSelectedCategory(category);
            setCurrentPage(1);
          }}
          statusOptions={STATUS_FILTERS}
          selectedStatus={selectedStatus}
          onStatusChange={(status) => {
            setSelectedStatus(status);
            setCurrentPage(1);
          }}
        />
      )}

      {/* ─── Page Title & Actions (desktop / tablet) ─────────────────────── */}
      {!isMobile && (
      <Box
        className="glass-panel"
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2,
          '@media (max-width: 1023.95px)': { p: 2.25 },
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Package size={24} color="#0F766E" />
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#17313B' }}>
              Inventory & Medicine Management
            </Typography>
            <Chip
              label={
                viewMode === 'active'
                  ? 'Active Catalog'
                  : viewMode === 'archived'
                  ? 'Archived Items'
                  : 'Recently Deleted'
              }
              size="small"
              sx={{
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
                fontWeight: 700,
                fontSize: '0.75rem',
              }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            Complete pharmaceutical lifecycle management: Stock adjustments, pricing, automated alerts, and audit logging.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<History size={17} />}
            onClick={handleOpenAuditModal}
            sx={{ borderRadius: '18px' }}
          >
            Audit Trail
          </Button>

          <Button
            variant="outlined"
            startIcon={<Download size={17} />}
            onClick={handleExportCSV}
            sx={{ borderRadius: '18px' }}
          >
            Export CSV
          </Button>

          {isAdmin && (
            <Button
              variant="contained"
              className="glass-button"
              startIcon={<Plus size={18} />}
              onClick={handleOpenAddModal}
              sx={{ borderRadius: '18px' }}
            >
              Add New Medicine
            </Button>
          )}
        </Box>
      </Box>
      )}

      {/* ─── Search & Filter Bar (desktop / tablet) ──────────────────────── */}
      {!isMobile && (
      <Box
        className="glass-panel"
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: 2,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Search Bar */}
        <Box
          className="glass-input"
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 2,
            py: 0.75,
            flexGrow: 1,
            width: { xs: '100%', lg: 'auto' },
            maxWidth: { xs: '100%', lg: 380 },
          }}
        >
          <Search size={18} color="#64748B" />
          <InputBase
            placeholder="Search by name, brand, SKU, category, supplier..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            sx={{ ml: 1, flexGrow: 1, fontSize: '0.9rem', color: '#17313B' }}
          />
          {searchTerm && (
            <IconButton size="small" onClick={() => setSearchTerm('')} sx={{ p: 0.25 }}>
              <X size={15} />
            </IconButton>
          )}
        </Box>

        {/* Dropdown Filters */}
        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            flexWrap: 'wrap',
            width: { xs: '100%', lg: 'auto' },
            justifyContent: { xs: 'flex-start', sm: 'flex-end' },
          }}
        >
          {/* View Mode Selector (Active, Archived, Recently Deleted) */}
          <FormControl size="small" sx={{ minWidth: 170 }}>
            <Select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as InventoryViewMode)}
              className="glass-input"
              sx={{
                fontSize: '0.875rem',
                borderRadius: '18px',
                fontWeight: 600,
                color: '#0F766E',
              }}
            >
              <MenuItem value="active">Active Medicines</MenuItem>
              <MenuItem value="archived">Archived Medicines</MenuItem>
              <MenuItem value="deleted">Recently Deleted</MenuItem>
            </Select>
          </FormControl>

          {/* Category Filter */}
          <FormControl size="small" sx={{ minWidth: 145 }}>
            <Select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              displayEmpty
              className="glass-input"
              sx={{ fontSize: '0.875rem', borderRadius: '18px' }}
            >
              <MenuItem value="All">All Categories</MenuItem>
              {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Status Filter */}
          {viewMode === 'active' && (
            <FormControl size="small" sx={{ minWidth: 145 }}>
              <Select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                displayEmpty
                className="glass-input"
                sx={{ fontSize: '0.875rem', borderRadius: '18px' }}
              >
                {STATUS_FILTERS.map((st) => (
                  <MenuItem key={st} value={st}>
                    {st === 'All' ? 'All Statuses' : st}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>
      </Box>
      )}

      {/* ─── Mobile Medicine Cards (<640px) ──────────────────────────────── */}
      {isMobile && (
        loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8, gap: 2 }}>
            <CircularProgress size={28} sx={{ color: '#0F766E' }} />
            <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>
              Loading pharmacy inventory...
            </Typography>
          </Box>
        ) : filteredMedicines.length === 0 ? (
          <Box className="glass-panel" sx={{ textAlign: 'center', py: 6, px: 2 }}>
            <Package size={44} color="#94A3B8" />
            <Typography variant="h6" sx={{ color: '#17313B', fontWeight: 700, mt: 1.5 }}>
              {viewMode === 'active'
                ? 'No Active Medicines Found'
                : viewMode === 'archived'
                ? 'No Archived Medicines'
                : 'No Recently Deleted Medicines'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
              {searchTerm || selectedCategory !== 'All' || selectedStatus !== 'All'
                ? 'Try adjusting your search or filters.'
                : viewMode === 'active'
                ? 'Tap + to add your first medicine.'
                : 'Items moved to archive or recently deleted will appear here.'}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {paginatedMedicines.map((med) => (
              <MedicineCard
                key={med.id}
                med={med}
                viewMode={viewMode}
                isAdmin={isAdmin}
                onEdit={handleOpenEditModal}
                onArchive={handleArchiveMedicine}
                onDelete={handleOpenDeleteDialog}
                onRestore={handleRestoreMedicine}
                onPermanentDelete={(m) => {
                  setActiveMedicine(m);
                  setIsPermanentConfirmOpen(true);
                }}
              />
            ))}
          </Box>
        )
      )}

      {/* ─── Inventory Table (desktop / tablet) ──────────────────────────── */}
      {!isMobile && (
      <TableContainer
        className="glass-table-container"
        sx={{
          maxHeight: { md: '65vh' },
          '&.glass-table-container': {
            overflowX: 'auto !important',
            overflowY: 'auto !important',
          },
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8, gap: 2 }}>
            <CircularProgress size={28} sx={{ color: '#0F766E' }} />
            <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>
              Loading pharmacy inventory...
            </Typography>
          </Box>
        ) : filteredMedicines.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, px: 2 }}>
            <Package size={48} color="#94A3B8" />
            <Typography variant="h6" sx={{ color: '#17313B', fontWeight: 700, mt: 1.5 }}>
              {viewMode === 'active'
                ? 'No Active Medicines Found'
                : viewMode === 'archived'
                ? 'No Archived Medicines'
                : 'No Recently Deleted Medicines'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B', maxWidth: 400, mx: 'auto', mt: 0.5 }}>
              {searchTerm || selectedCategory !== 'All' || selectedStatus !== 'All'
                ? 'Try adjusting your search query or clear filters to see more results.'
                : viewMode === 'active'
                ? 'Click "Add New Medicine" above to add pharmaceutical items to your catalog.'
                : 'Items moved to archive or recently deleted will appear here.'}
            </Typography>
          </Box>
        ) : (
          <Table
            sx={{
              minWidth: 900,
              borderCollapse: 'separate',
              borderSpacing: '0 14px',
              // Tablet hybrid (640–1023px): condensed columns so rows fit without horizontal scroll.
              // Desktop >=1024px keeps the full table unchanged.
              '@media (max-width: 1023.95px)': { minWidth: 0 },
            }}
          >
            <TableHead
              sx={{
                position: 'sticky',
                top: 0,
                zIndex: 2,
                bgcolor: 'rgba(241, 249, 248, 0.96)',
              }}
            >
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Medicine & Brand</TableCell>
                <TableCell sx={{ fontWeight: 700, '@media (max-width: 1023.95px)': { display: 'none' } }}>
                  Category
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Stock Level</TableCell>
                <TableCell sx={{ fontWeight: 700, '@media (max-width: 1023.95px)': { display: 'none' } }}>
                  Buying Price
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Selling Price</TableCell>
                <TableCell sx={{ fontWeight: 700, '@media (max-width: 1023.95px)': { display: 'none' } }}>
                  MRP
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Expiry Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, minWidth: 130 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedMedicines.map((med) => (
                <TableRow
                  key={med.id}
                  sx={{
                    // Glass card surface — same tone as the Audit Trail event cards
                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                    transition: 'box-shadow 200ms ease',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(15, 118, 110, 0.15)',
                    },
                    // Card outline: top/bottom on all cells, end caps + 20px radius on the edges
                    '& td': {
                      padding: '18px',
                      borderTop: '1px solid rgba(15, 118, 110, 0.12)',
                      borderBottom: '1px solid rgba(15, 118, 110, 0.12)',
                      transition: 'border-color 200ms ease',
                      // Tablet (640–1023px): compact rows — desktop padding unchanged
                      '@media (max-width: 1023.95px)': {
                        padding: '12px',
                        fontSize: '0.82rem',
                      },
                    },
                    '& td:first-of-type': {
                      borderLeft: '1px solid rgba(15, 118, 110, 0.12)',
                      borderRadius: '20px 0 0 20px',
                    },
                    '& td:last-of-type': {
                      borderRight: '1px solid rgba(15, 118, 110, 0.12)',
                      borderRadius: '0 20px 20px 0',
                    },
                    // Hover feedback: brighter border (shadow above)
                    '&:hover td': {
                      borderColor: 'rgba(15, 118, 110, 0.32)',
                    },
                  }}
                >
                  {/* Medicine Name & SKU */}
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#17313B' }}>
                        {med.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                        {med.brand} • <span style={{ fontWeight: 600 }}>{med.sku}</span>
                        {med.batch_number && ` • Batch: ${med.batch_number}`}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Category */}
                  <TableCell sx={{ '@media (max-width: 1023.95px)': { display: 'none' } }}>
                    <Chip
                      label={med.category}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderRadius: '10px',
                        fontSize: '0.75rem',
                        bgcolor: 'rgba(255, 255, 255, 0.4)',
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>

                  {/* Stock Level */}
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        color: med.stock <= med.min_stock ? '#EF4444' : '#17313B',
                      }}
                    >
                      {med.stock} Units
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                      Min: {med.min_stock}
                    </Typography>
                  </TableCell>

                  {/* Buying Price */}
                  <TableCell sx={{ '@media (max-width: 1023.95px)': { display: 'none' } }}>
                    {formatCurrency(med.buying_price)}
                  </TableCell>

                  {/* Selling Price */}
                  <TableCell sx={{ fontWeight: 700, color: '#0F766E' }}>
                    {formatCurrency(med.selling_price)}
                  </TableCell>

                  {/* MRP */}
                  <TableCell sx={{ '@media (max-width: 1023.95px)': { display: 'none' } }}>
                    {formatCurrency(med.mrp)}
                  </TableCell>

                  {/* Expiry Date */}
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          med.status === 'Expired'
                            ? '#991B1B'
                            : med.status === 'Expiring Soon'
                            ? '#C2410C'
                            : '#17313B',
                        fontWeight:
                          med.status === 'Expired' || med.status === 'Expiring Soon' ? 700 : 500,
                      }}
                    >
                      {med.expiry_date}
                    </Typography>
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell>{renderStatusChip(med)}</TableCell>

                  {/* Action Icons — scroll naturally with the table */}
                  <TableCell align="right" sx={{ minWidth: 130 }}>
                    {isAdmin ? (
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
                        {viewMode === 'active' && (
                          <>
                            <Tooltip title="Edit Medicine & Adjust Stock">
                              <IconButton
                                size="small"
                                onClick={() => handleOpenEditModal(med)}
                                sx={{ color: '#0F766E', '&:hover': { bgcolor: 'rgba(15,118,110,0.1)' } }}
                              >
                                <Edit2 size={16} />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Archive Medicine">
                              <IconButton
                                size="small"
                                onClick={() => handleArchiveMedicine(med)}
                                sx={{ color: '#D97706', '&:hover': { bgcolor: 'rgba(217,119,6,0.1)' } }}
                              >
                                <Archive size={16} />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Delete Options">
                              <IconButton
                                size="small"
                                onClick={() => handleOpenDeleteDialog(med)}
                                sx={{ color: '#EF4444', '&:hover': { bgcolor: 'rgba(239,68,68,0.1)' } }}
                              >
                                <Trash2 size={16} />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}

                        {viewMode === 'archived' && (
                          <>
                            <Tooltip title="Restore to Active Inventory">
                              <IconButton
                                size="small"
                                onClick={() => handleRestoreMedicine(med)}
                                sx={{ color: '#0F766E', '&:hover': { bgcolor: 'rgba(15,118,110,0.1)' } }}
                              >
                                <RotateCcw size={16} />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Delete Medicine">
                              <IconButton
                                size="small"
                                onClick={() => handleOpenDeleteDialog(med)}
                                sx={{ color: '#EF4444', '&:hover': { bgcolor: 'rgba(239,68,68,0.1)' } }}
                              >
                                <Trash2 size={16} />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}

                        {viewMode === 'deleted' && (
                          <>
                            <Tooltip title="Restore to Active Inventory">
                              <IconButton
                                size="small"
                                onClick={() => handleRestoreMedicine(med)}
                                sx={{ color: '#0F766E', '&:hover': { bgcolor: 'rgba(15,118,110,0.1)' } }}
                              >
                                <RotateCcw size={16} />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Permanently Delete Forever">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setActiveMedicine(med);
                                  setIsPermanentConfirmOpen(true);
                                }}
                                sx={{ color: '#991B1B', '&:hover': { bgcolor: 'rgba(153,27,27,0.15)' } }}
                              >
                                <Trash2 size={16} />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Box>
                    ) : (
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
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
      )}

      {/* ─── Pagination ──────────────────────────────────────────────────── */}
      <Box
        className="glass-panel"
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
          Showing{' '}
          {filteredMedicines.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
          –{Math.min(currentPage * itemsPerPage, filteredMedicines.length)} of{' '}
          {filteredMedicines.length} Medicines (
          {viewMode === 'active'
            ? 'Active'
            : viewMode === 'archived'
            ? 'Archived'
            : 'Deleted'}
          )
        </Typography>

        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(_, page) => setCurrentPage(page)}
          color="primary"
          // Mobile: compact page numbers so the control fits narrow screens
          {...(isMobile ? { siblingCount: 0, boundaryCount: 1 } : {})}
          sx={{ '& .MuiPaginationItem-root': { borderRadius: '10px', fontWeight: 600 } }}
        />
      </Box>

      {/* ─── Floating Inventory Actions (<640px only) ────────────────────── */}
      {isMobile && (
        <ActionsFab
          isAdmin={isAdmin}
          onAdd={handleOpenAddModal}
          onAudit={handleOpenAuditModal}
          onExport={handleExportCSV}
        />
      )}

      {/* ─── ADD MEDICINE — full-screen mobile sheet (<640px) ────────────── */}
      {isMobile && (
        <AddMedicineSheet
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          categories={CATEGORIES.filter((c) => c !== 'All')}
          formData={formData}
          onChange={(patch) => setFormData({ ...formData, ...patch })}
          onSubmit={handleSaveNewMedicine}
        />
      )}

      {/* ─── ADD MEDICINE MODAL (desktop / tablet) ───────────────────────── */}
      {!isMobile && (
      <Dialog
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        fullWidth
        sx={{ zIndex: 9999 }}
        slotProps={{
          paper: {
            className: 'glass-dialog',
            sx: {
              width: { xs: '95vw', sm: '90vw', md: 920 },
              maxWidth: 'none',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            },
          },
        }}
      >
        <form
          onSubmit={handleSaveNewMedicine}
          style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}
        >
          <DialogTitle
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 2,
              px: 3,
              flexShrink: 0,
              position: 'sticky',
              top: 0,
              zIndex: 1,
              bgcolor: 'rgba(255, 255, 255, 0.45)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.4)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Package color="#0F766E" size={24} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#17313B', lineHeight: 1.2 }}>
                  Add New Medicine
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B' }}>
                  Register SKU details, batch, initial stock, and pricing
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={() => setIsAddModalOpen(false)} size="small">
              <X size={18} />
            </IconButton>
          </DialogTitle>

          <DialogContent
            sx={{
              // Out-specify MUI's ".MuiDialogTitle-root + &" paddingTop: 0 override
              '&&&': { pt: 3 },
              px: 3,
              pb: 3,
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 2.5,
            }}
          >
            {/* Row 1: Name, Brand */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                label="Medicine Name *"
                required
                fullWidth
                size="small"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Amoxicillin 500mg Capsule"
              />
              <TextField
                label="Brand / Manufacturer *"
                required
                fullWidth
                size="small"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g. Novartis"
              />
            </Box>

            {/* Row 2: Category, SKU, Batch */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <FormControl size="small" fullWidth>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  MenuProps={{ sx: { zIndex: 9999 } }}
                >
                  {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
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
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="e.g. MED-AMX-500"
              />

              <TextField
                label="Batch Code"
                fullWidth
                size="small"
                value={formData.batch_number}
                onChange={(e) => setFormData({ ...formData, batch_number: e.target.value })}
                placeholder="e.g. BAT-2026-88"
              />
            </Box>

            {/* Row 3: Stock Quantity & Min Stock */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <QuantityInput
                label="Stock Quantity *"
                value={formData.stock}
                onChange={(stock) => setFormData({ ...formData, stock })}
                fallback={0}
                min={0}
              />
              <QuantityInput
                label="Minimum Stock Alert Threshold *"
                value={formData.min_stock}
                onChange={(min_stock) => setFormData({ ...formData, min_stock })}
                fallback={1}
                min={1}
              />
            </Box>

            {/* Row 4: Pricing & Live Margin calculation */}
            <Box
              sx={{
                p: 2,
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#0F766E', textTransform: 'uppercase' }}>
                Pricing & Profit Margin Calculator (INR ₹)
              </Typography>

              <Box
                sx={{
                  mt: 1.5,
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 2,
                }}
              >
                <PriceInput
                  label="Buying Price (₹) *"
                  value={formData.buying_price}
                  onChange={(buying_price) => setFormData({ ...formData, buying_price })}
                />
                <PriceInput
                  label="Selling Price (₹) *"
                  value={formData.selling_price}
                  onChange={(selling_price) => setFormData({ ...formData, selling_price })}
                />
                <PriceInput
                  label="MRP (₹) *"
                  value={formData.mrp}
                  onChange={(mrp) => setFormData({ ...formData, mrp })}
                />
              </Box>

              {/* Calculation Badges */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mt: 0.5 }}>
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
                    bgcolor: parseFloat(liveMargin) >= 15 ? 'rgba(15, 118, 110, 0.15)' : 'rgba(245, 158, 11, 0.15)',
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

            {/* Row 5: Dates */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                label="Expiry Date *"
                type="date"
                required
                InputLabelProps={{ shrink: true }}
                fullWidth
                size="small"
                value={formData.expiry_date}
                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
              />
              <TextField
                label="Manufacturing Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                size="small"
                value={formData.manufacturing_date}
                onChange={(e) => setFormData({ ...formData, manufacturing_date: e.target.value })}
              />
            </Box>

            {/* Row 6: Supplier & Notes */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                label="Supplier / Distributor Name"
                fullWidth
                size="small"
                value={formData.supplier_name}
                onChange={(e) => setFormData({ ...formData, supplier_name: e.target.value })}
                placeholder="e.g. Apollo Distribution"
              />
              <TextField
                label="Operational Notes (Optional)"
                fullWidth
                size="small"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="e.g. Keep refrigerated at 2-8°C"
              />
            </Box>
          </DialogContent>

          <DialogActions
            sx={{ p: '20px 24px', flexShrink: 0, gap: 1.5, borderTop: '1px solid rgba(255, 255, 255, 0.4)' }}
          >
            <Button variant="outlined" onClick={() => setIsAddModalOpen(false)} sx={{ borderRadius: '18px' }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" className="glass-button" sx={{ borderRadius: '18px' }}>
              Save Medicine
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      )}

      {/* ─── EDIT MEDICINE & STOCK ADJUSTMENT MODAL ───────────────────────── */}
      <Dialog
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ className: 'glass-dialog' }}
      >
        <form onSubmit={handleSaveEditMedicine}>
          <DialogTitle
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pb: 1.5,
              borderBottom: '1px solid rgba(255, 255, 255, 0.4)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Edit2 color="#0F766E" size={22} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#17313B', lineHeight: 1.2 }}>
                  Edit Medicine — {activeMedicine?.name}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B' }}>
                  SKU: {activeMedicine?.sku} • Created by: {activeMedicine?.created_by || 'Admin'}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={() => setIsEditModalOpen(false)} size="small">
              <X size={18} />
            </IconButton>
          </DialogTitle>

          <DialogContent
            sx={{
              // Out-specify MUI's ".MuiDialogTitle-root + &" paddingTop: 0 override
              '&&&': { pt: 3 },
              py: 3,
              display: 'flex',
              flexDirection: 'column',
              gap: 2.5,
            }}
          >
            {/* ── Dedicated Stock Adjustment Box ── */}
            <Box
              sx={{
                p: 2,
                borderRadius: '18px',
                background: 'linear-gradient(135deg, rgba(15, 118, 110, 0.08) 0%, rgba(255, 255, 255, 0.5) 100%)',
                border: '1px solid rgba(15, 118, 110, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F766E' }}>
                  📦 Dedicated Stock Adjustment
                </Typography>
                <Chip
                  label={`Current Stock: ${formData.stock} Units`}
                  size="small"
                  sx={{ bgcolor: '#0F766E', color: '#FFFFFF', fontWeight: 700 }}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                {/* Add / Remove Mode */}
                <Box sx={{ display: 'flex', borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.6)', p: 0.5 }}>
                  <Button
                    size="small"
                    variant={stockAdjMode === 'ADD' ? 'contained' : 'text'}
                    onClick={() => setStockAdjMode('ADD')}
                    sx={{
                      borderRadius: '10px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      bgcolor: stockAdjMode === 'ADD' ? '#0F766E' : 'transparent',
                      color: stockAdjMode === 'ADD' ? '#FFFFFF' : '#17313B',
                      '&:hover': { bgcolor: stockAdjMode === 'ADD' ? '#115E59' : 'rgba(0,0,0,0.05)' },
                    }}
                  >
                    + Add Stock
                  </Button>
                  <Button
                    size="small"
                    variant={stockAdjMode === 'REMOVE' ? 'contained' : 'text'}
                    onClick={() => setStockAdjMode('REMOVE')}
                    sx={{
                      borderRadius: '10px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      bgcolor: stockAdjMode === 'REMOVE' ? '#DC2626' : 'transparent',
                      color: stockAdjMode === 'REMOVE' ? '#FFFFFF' : '#17313B',
                      '&:hover': { bgcolor: stockAdjMode === 'REMOVE' ? '#B91C1C' : 'rgba(0,0,0,0.05)' },
                    }}
                  >
                    - Remove Stock
                  </Button>
                </Box>

                {/* Adjustment Input */}
                <QuantityInput
                  label="Quantity"
                  value={stockAdjAmount}
                  onChange={setStockAdjAmount}
                  fallback={10}
                  floor={1}
                  min={1}
                  required={false}
                  fullWidth={false}
                  sx={{ width: 110 }}
                />

                {/* Quick Chips */}
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {[10, 25, 50, 100].map((amt) => (
                    <Chip
                      key={amt}
                      label={`${stockAdjMode === 'ADD' ? '+' : '-'}${amt}`}
                      size="small"
                      onClick={() => setStockAdjAmount(amt)}
                      sx={{
                        cursor: 'pointer',
                        fontWeight: 700,
                        bgcolor: stockAdjAmount === amt ? 'rgba(15,118,110,0.15)' : 'rgba(255,255,255,0.6)',
                        color: '#0F766E',
                      }}
                    />
                  ))}
                </Box>

                {/* Apply Button */}
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleApplyStockAdjustment}
                  className="glass-button"
                  sx={{ borderRadius: '12px', ml: 'auto' }}
                >
                  Apply Stock Change (
                  {stockAdjMode === 'ADD'
                    ? formData.stock + stockAdjAmount
                    : Math.max(0, formData.stock - stockAdjAmount)}{' '}
                  Units)
                </Button>
              </Box>
            </Box>

            {/* Editable Fields */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                label="Medicine Name *"
                required
                fullWidth
                size="small"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <TextField
                label="Brand *"
                required
                fullWidth
                size="small"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
              <FormControl size="small" fullWidth>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="SKU"
                fullWidth
                size="small"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              />

              <TextField
                label="Batch Code"
                fullWidth
                size="small"
                value={formData.batch_number}
                onChange={(e) => setFormData({ ...formData, batch_number: e.target.value })}
              />
            </Box>

            {/* Stock & Min Stock */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <QuantityInput
                label="Stock Quantity (Direct Edit)"
                value={formData.stock}
                onChange={(stock) => setFormData({ ...formData, stock })}
                fallback={0}
                required={false}
              />
              <QuantityInput
                label="Min Stock Threshold *"
                value={formData.min_stock}
                onChange={(min_stock) => setFormData({ ...formData, min_stock })}
                fallback={1}
              />
            </Box>

            {/* Pricing Section with live margins */}
            <Box
              sx={{
                p: 2,
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#0F766E', textTransform: 'uppercase' }}>
                Pricing & Live Margins (INR ₹)
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
                <PriceInput
                  label="Buying Price (₹) *"
                  value={formData.buying_price}
                  onChange={(buying_price) => setFormData({ ...formData, buying_price })}
                />
                <PriceInput
                  label="Selling Price (₹) *"
                  value={formData.selling_price}
                  onChange={(selling_price) => setFormData({ ...formData, selling_price })}
                />
                <PriceInput
                  label="MRP (₹) *"
                  value={formData.mrp}
                  onChange={(mrp) => setFormData({ ...formData, mrp })}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
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
                    bgcolor: parseFloat(liveMargin) >= 15 ? 'rgba(15, 118, 110, 0.15)' : 'rgba(245, 158, 11, 0.15)',
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

            {/* Expiry & Mfg */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                label="Expiry Date *"
                type="date"
                required
                InputLabelProps={{ shrink: true }}
                fullWidth
                size="small"
                value={formData.expiry_date}
                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
              />
              <TextField
                label="Manufacturing Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                size="small"
                value={formData.manufacturing_date}
                onChange={(e) => setFormData({ ...formData, manufacturing_date: e.target.value })}
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                label="Supplier / Distributor Name"
                fullWidth
                size="small"
                value={formData.supplier_name}
                onChange={(e) => setFormData({ ...formData, supplier_name: e.target.value })}
              />
              <TextField
                label="Notes"
                fullWidth
                size="small"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 2.5, gap: 1.5, borderTop: '1px solid rgba(255, 255, 255, 0.4)' }}>
            <Button variant="outlined" onClick={() => setIsEditModalOpen(false)} sx={{ borderRadius: '18px' }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" className="glass-button" sx={{ borderRadius: '18px' }}>
              Save Changes
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ─── DELETE OPTIONS DIALOG ───────────────────────────────────────── */}
      <Dialog
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ className: 'glass-dialog' }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Trash2 color="#EF4444" size={22} />
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#17313B' }}>
            Delete Medicine
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ py: 2 }}>
          <Typography variant="body2" sx={{ color: '#475569', mb: 2 }}>
            What would you like to do with <strong>{activeMedicine?.name}</strong> (SKU: {activeMedicine?.sku})?
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box
              onClick={handleSoftDelete}
              sx={{
                p: 2,
                borderRadius: '16px',
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                cursor: 'pointer',
                transition: 'all 200ms ease',
                '&:hover': {
                  background: 'rgba(245, 158, 11, 0.16)',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#B45309' }}>
                📦 Move to Recently Deleted
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B' }}>
                Soft delete. Medicine can be restored at any time from the Recently Deleted view.
              </Typography>
            </Box>

            <Box
              onClick={handleOpenPermanentConfirm}
              sx={{
                p: 2,
                borderRadius: '16px',
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                cursor: 'pointer',
                transition: 'all 200ms ease',
                '&:hover': {
                  background: 'rgba(239, 68, 68, 0.16)',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#DC2626' }}>
                ⚠️ Delete Permanently
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B' }}>
                Completely erase record from the database. Cannot be undone.
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsDeleteModalOpen(false)} sx={{ borderRadius: '14px' }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* ─── PERMANENT DELETE CONFIRMATION MODAL ──────────────────────────── */}
      <Dialog
        open={isPermanentConfirmOpen}
        onClose={() => setIsPermanentConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ className: 'glass-dialog' }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#DC2626' }}>
          <AlertTriangle color="#DC2626" size={24} />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Confirm Permanent Deletion
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ py: 2 }}>
          <Typography variant="body2" sx={{ color: '#17313B', mb: 1 }}>
            Are you sure you want to permanently delete <strong>{activeMedicine?.name}</strong>?
          </Typography>
          <Alert severity="error" sx={{ borderRadius: '14px', fontSize: '0.85rem' }}>
            This action cannot be undone. The medicine record and all its data will be permanently purged from SQLite.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setIsPermanentConfirmOpen(false)} sx={{ borderRadius: '14px' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handlePermanentDelete}
            sx={{
              borderRadius: '14px',
              bgcolor: '#DC2626 !important',
              color: '#FFFFFF',
              fontWeight: 700,
              '&:hover': { bgcolor: '#B91C1C !important' },
            }}
          >
            Delete Forever
          </Button>
        </DialogActions>
      </Dialog>

      {/* ─── AUDIT TRAIL — 90% height mobile bottom sheet (<640px) ───────── */}
      {isMobile && (
        <AuditTrailSheet
          open={isAuditModalOpen}
          onClose={() => setIsAuditModalOpen(false)}
          logs={auditLogs}
          loading={loadingAudit}
        />
      )}

      {/* ─── AUDIT TRAIL MODAL (desktop / tablet) ────────────────────────── */}
      {!isMobile && (
      <Dialog
        open={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        fullWidth
        sx={{ zIndex: 9999 }}
        slotProps={{
          paper: {
            className: 'glass-dialog',
            sx: {
              width: { xs: '95vw', sm: '90vw', md: 900 },
              maxWidth: 'none',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 2,
            px: 3,
            position: 'sticky',
            top: 0,
            zIndex: 1,
            bgcolor: 'rgba(255, 255, 255, 0.45)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.4)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <History color="#0F766E" size={22} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#17313B' }}>
                Inventory Audit Log
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B' }}>
                Immutable history of all administrator inventory operations.
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={() => setIsAuditModalOpen(false)} size="small">
            <X size={18} />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            // Out-specify MUI's ".MuiDialogTitle-root + &" paddingTop: 0 override
            '&&&': { pt: 3 },
            pb: 0.5,
            px: 3,
            flex: 1,
            minHeight: 0,
            overflowY: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {loadingAudit ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, gap: 1.5 }}>
              <CircularProgress size={24} sx={{ color: '#0F766E' }} />
              <Typography variant="body2" sx={{ color: '#64748B' }}>
                Loading audit history...
              </Typography>
            </Box>
          ) : auditLogs.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <History size={40} color="#94A3B8" />
              <Typography variant="body2" sx={{ color: '#64748B', mt: 1 }}>
                No audit log entries recorded yet.
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
              }}
            >
              {auditLogs.map((log) => (
                <Box
                  key={log.id}
                  sx={{
                    p: 2.25,
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 1,
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={log.action}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          flexShrink: 0,
                          bgcolor: log.action.includes('Added') || log.action.includes('Increased') || log.action.includes('Restored')
                            ? 'rgba(34, 197, 94, 0.15)'
                            : log.action.includes('Deleted')
                            ? 'rgba(239, 68, 68, 0.15)'
                            : 'rgba(15, 118, 110, 0.15)',
                          color: log.action.includes('Added') || log.action.includes('Increased') || log.action.includes('Restored')
                            ? '#166534'
                            : log.action.includes('Deleted')
                            ? '#991B1B'
                            : '#0F766E',
                        }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#17313B', wordBreak: 'break-word' }}>
                        {log.medicine_name}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 0.5, wordBreak: 'break-word' }}>
                      Performed by: <strong>{log.user_name}</strong> ({log.user_email})
                    </Typography>
                  </Box>

                  <Typography
                    variant="caption"
                    sx={{
                      color: '#94A3B8',
                      fontWeight: 600,
                      flexShrink: 0,
                      whiteSpace: 'nowrap',
                      textAlign: { xs: 'left', sm: 'right' },
                    }}
                  >
                    {formatAuditTimestamp(log.created_at)}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            p: '20px 24px',
            flexShrink: 0,
            justifyContent: 'flex-end',
            borderTop: '1px solid rgba(255, 255, 255, 0.4)',
          }}
        >
          <Button onClick={() => setIsAuditModalOpen(false)} sx={{ borderRadius: '14px' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      )}

      {/* ─── TOAST NOTIFICATION SNACKBAR (top-center on mobile, clear of FAB/nav) */}
      <Snackbar
        open={toast.open}
        sx={{ zIndex: 10000 }}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={
          isMobile ? { vertical: 'top', horizontal: 'center' } : { vertical: 'bottom', horizontal: 'right' }
        }
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          sx={{
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(15, 118, 110, 0.2)',
            boxShadow: '0 10px 30px rgba(15, 118, 110, 0.15)',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Inventory;
