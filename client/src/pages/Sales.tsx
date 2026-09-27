import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatCurrency';
import {
  Box,
  Typography,
  Grid,
  Card,
  Button,
  InputBase,
  Chip,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import {
  Search,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  QrCode,
  CheckCircle2,
  Printer,
  ShoppingBag,
  X,
  FileText,
} from 'lucide-react';

interface MedicineItem {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

interface CartItem extends MedicineItem {
  quantity: number;
}

const mockCatalog: MedicineItem[] = [
  { id: '1', name: 'Amoxicillin 500mg Capsule', category: 'Antibiotics', price: 85.0, stock: 145 },
  { id: '2', name: 'Paracetamol 650mg Tablet', category: 'Analgesics', price: 32.5, stock: 18 },
  { id: '3', name: 'Ciprofloxacin 500mg', category: 'Antibiotics', price: 145.0, stock: 42 },
  { id: '4', name: 'Metformin 500mg SR', category: 'Diabetes', price: 68.0, stock: 210 },
  { id: '5', name: 'Atorvastatin 10mg', category: 'Cardiology', price: 195.0, stock: 12 },
  { id: '6', name: 'Azithromycin 250mg', category: 'Antibiotics', price: 165.0, stock: 95 },
  { id: '7', name: 'Omeprazole 20mg Capsule', category: 'Gastroenterology', price: 88.0, stock: 110 },
  { id: '8', name: 'Cetirizine 10mg Tablet', category: 'Antihistamine', price: 38.0, stock: 320 },
];

export const Sales: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([
    { id: '1', name: 'Amoxicillin 500mg Capsule', category: 'Antibiotics', price: 85.0, stock: 145, quantity: 2 },
    { id: '2', name: 'Paracetamol 650mg Tablet', category: 'Analgesics', price: 32.5, stock: 18, quantity: 1 },
  ]);
  const [discountPercent, setDiscountPercent] = useState(5);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card' | 'UPI'>('Cash');
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const categories = ['All', 'Antibiotics', 'Analgesics', 'Diabetes', 'Cardiology', 'Gastroenterology', 'Antihistamine'];

  const filteredCatalog = mockCatalog.filter((med) => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || med.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (medicine: MedicineItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === medicine.id);
      if (existing) {
        return prev.map((item) => (item.id === medicine.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prev, { ...medicine, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Billing Math
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableAmount = subtotal - discountAmount;
  const gstAmount = taxableAmount * 0.18; // 18% GST
  const grandTotal = taxableAmount + gstAmount;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header Banner */}
      <Box
        className="glass-panel"
        sx={{
          p: 3,
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#17313B' }}>
            Point of Sale (POS Billing)
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            Rapid checkout billing, instant medicine search, tax computation, and digital invoice generation.
          </Typography>
        </Box>
        <Chip
          icon={<CheckCircle2 size={15} color="#0F766E" />}
          label="POS Terminal #01 Active"
          sx={{ bgcolor: 'rgba(15, 118, 110, 0.12)', color: '#0F766E', fontWeight: 600 }}
        />
      </Box>

      {/* POS Billing Layout */}
      <Grid container spacing={3}>
        {/* Left Panel: Catalog & Medicine Cards */}
        <Grid item xs={12} lg={7.5}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Search Bar & Category Pills */}
            <Box className="glass-panel" sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box
                className="glass-input"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  px: 2,
                  py: 1,
                  width: '100%',
                }}
              >
                <Search size={20} color="#64748B" />
                <InputBase
                  placeholder="Search medicine by name or barcode scan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ ml: 1.5, flexGrow: 1, fontSize: '0.95rem', color: '#17313B' }}
                />
              </Box>

              {/* Category Pills */}
              <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 0.5 }}>
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <Chip
                      key={cat}
                      label={cat}
                      onClick={() => setSelectedCategory(cat)}
                      sx={{
                        cursor: 'pointer',
                        bgcolor: isActive ? '#0F766E' : 'rgba(255, 255, 255, 0.4)',
                        color: isActive ? '#FFFFFF' : '#17313B',
                        fontWeight: isActive ? 600 : 500,
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                        '&:hover': {
                          bgcolor: isActive ? '#115E59' : 'rgba(255, 255, 255, 0.6)',
                        },
                      }}
                    />
                  );
                })}
              </Box>
            </Box>

            {/* Medicine Grid */}
            <Grid container spacing={2}>
              {filteredCatalog.map((med) => (
                <Grid item xs={12} sm={6} md={4} key={med.id}>
                  <Card
                    className="glass-card"
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justify: 'space-between',
                      p: 2,
                    }}
                  >
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Chip label={med.category} size="small" sx={{ fontSize: '0.7rem', height: 20, bgcolor: 'rgba(15, 118, 110, 0.1)', color: '#0F766E' }} />
                        <Typography variant="caption" sx={{ color: med.stock < 20 ? '#EF4444' : '#64748B', fontWeight: 600 }}>
                          {med.stock} in stock
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#17313B', lineHeight: 1.3, mb: 1 }}>
                        {med.name}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F766E' }}>
                        {formatCurrency(med.price)}
                      </Typography>
                      <Button
                        size="small"
                        variant="contained"
                        className="glass-button"
                        onClick={() => addToCart(med)}
                        startIcon={<Plus size={15} />}
                        sx={{ borderRadius: '14px', py: 0.5, px: 1.5 }}
                      >
                        Add
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>

        {/* Right Panel: Current Bill Invoice */}
        <Grid item xs={12} lg={4.5}>
          <Card className="glass-panel" sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#17313B', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ShoppingBag size={20} color="#0F766E" />
                  Current Bill Summary
                </Typography>
                <Chip label={`${cart.reduce((a, b) => a + b.quantity, 0)} Items`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.5)', fontWeight: 600 }} />
              </Box>

              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.4)', mb: 2 }} />

              {/* Cart Item List */}
              {cart.length === 0 ? (
                <Box sx={{ py: 6, textAlign: 'center' }}>
                  <ShoppingBag size={40} color="#94A3B8" />
                  <Typography variant="body2" sx={{ color: '#64748B', mt: 1 }}>
                    No medicines added to bill yet.
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, maxHeight: 300, overflowY: 'auto', pr: 0.5 }}>
                  {cart.map((item) => (
                    <Box
                      key={item.id}
                      sx={{
                        p: 1.5,
                        borderRadius: '16px',
                        background: 'rgba(255, 255, 255, 0.4)',
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box sx={{ flexGrow: 1, mr: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#17313B' }}>
                          {item.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748B' }}>
                          {formatCurrency(item.price)} × {item.quantity} = {formatCurrency(item.price * item.quantity)}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <IconButton size="small" onClick={() => updateQuantity(item.id, -1)} sx={{ bgcolor: 'rgba(255,255,255,0.6)' }}>
                          <Minus size={14} />
                        </IconButton>
                        <Typography variant="body2" sx={{ fontWeight: 700, px: 1 }}>
                          {item.quantity}
                        </Typography>
                        <IconButton size="small" onClick={() => updateQuantity(item.id, 1)} sx={{ bgcolor: 'rgba(255,255,255,0.6)' }}>
                          <Plus size={14} />
                        </IconButton>
                        <IconButton size="small" onClick={() => removeFromCart(item.id)} sx={{ color: '#EF4444', ml: 0.5 }}>
                          <Trash2 size={15} />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            {/* Billing Calculation & Payment Section */}
            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.4)' }}>
              {/* Discount Selector */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 500 }}>
                  Apply Discount:
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {[0, 5, 10, 15].map((pct) => (
                    <Chip
                      key={pct}
                      label={`${pct}%`}
                      size="small"
                      onClick={() => setDiscountPercent(pct)}
                      sx={{
                        cursor: 'pointer',
                        bgcolor: discountPercent === pct ? '#0F766E' : 'rgba(255,255,255,0.4)',
                        color: discountPercent === pct ? '#FFFFFF' : '#17313B',
                        fontWeight: 600,
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Price Breakdown */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: '#64748B' }}>
                    Subtotal:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatCurrency(subtotal)}
                  </Typography>
                </Box>

                {discountPercent > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: '#22C55E' }}>
                      Discount ({discountPercent}%):
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#22C55E' }}>
                      -{formatCurrency(discountAmount)}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: '#64748B' }}>
                    GST Tax (18%):
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    +{formatCurrency(gstAmount)}
                  </Typography>
                </Box>

                <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.4)' }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#17313B' }}>
                    Grand Total:
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F766E' }}>
                    {formatCurrency(grandTotal)}
                  </Typography>
                </Box>
              </Box>

              {/* Payment Method Selector */}
              <Box sx={{ mb: 2.5 }}>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, mb: 1, display: 'block' }}>
                  PAYMENT METHOD
                </Typography>
                <Grid container spacing={1}>
                  {[
                    { mode: 'Cash', icon: Banknote },
                    { mode: 'Card', icon: CreditCard },
                    { mode: 'UPI', icon: QrCode },
                  ].map((pm) => {
                    const Icon = pm.icon;
                    const isSelected = paymentMethod === pm.mode;
                    return (
                      <Grid item xs={4} key={pm.mode}>
                        <Box
                          onClick={() => setPaymentMethod(pm.mode as any)}
                          sx={{
                            p: 1,
                            borderRadius: '14px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            bgcolor: isSelected ? '#0F766E' : 'rgba(255,255,255,0.35)',
                            color: isSelected ? '#FFFFFF' : '#17313B',
                            border: '1px solid rgba(255,255,255,0.4)',
                            transition: 'all 200ms ease',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          <Icon size={18} />
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            {pm.mode}
                          </Typography>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>

              {/* Complete Sale Action */}
              {isAdmin ? (
                <Button
                  fullWidth
                  variant="contained"
                  className="glass-button"
                  disabled={cart.length === 0}
                  onClick={() => setIsReceiptOpen(true)}
                  sx={{ py: 1.5, fontSize: '1rem', borderRadius: '18px' }}
                >
                  Complete Sale ({formatCurrency(grandTotal)})
                </Button>
              ) : (
                <Button
                  fullWidth
                  disabled
                  variant="outlined"
                  sx={{ py: 1.5, fontSize: '0.875rem', borderRadius: '18px', borderColor: 'rgba(148, 163, 184, 0.4)' }}
                >
                  Read Only Access (USER Role)
                </Button>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Printable Receipt Modal */}
      <Dialog
        open={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ className: 'glass-dialog' }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FileText color="#0F766E" size={20} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#17313B' }}>
              Sale Receipt Preview
            </Typography>
          </Box>
          <IconButton onClick={() => setIsReceiptOpen(false)} size="small">
            <X size={18} />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ py: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F766E' }}>
              MedLedger Pharmacy
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
              Invoice #ML-2026-94812
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B' }}>
              Date: {new Date().toLocaleString()}
            </Typography>
          </Box>

          <Divider sx={{ my: 1.5 }} />

          {/* Items breakdown */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
            {cart.map((item) => (
              <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: '#17313B' }}>
                  {item.name} × {item.quantity}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                   {formatCurrency(item.price * item.quantity)}
                </Typography>
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 1.5 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" sx={{ color: '#64748B' }}>
                Payment Method:
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {paymentMethod}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#17313B' }}>
                Total Paid:
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F766E' }}>
                {formatCurrency(grandTotal)}
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button variant="outlined" onClick={() => setIsReceiptOpen(false)} sx={{ borderRadius: '16px' }}>
            Close
          </Button>
          <Button
            variant="contained"
            className="glass-button"
            startIcon={<Printer size={16} />}
            onClick={() => {
              setIsReceiptOpen(false);
              setCart([]);
            }}
            sx={{ borderRadius: '16px' }}
          >
            Print Receipt
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Sales;
