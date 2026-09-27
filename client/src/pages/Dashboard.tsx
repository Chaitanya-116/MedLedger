import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
} from '@mui/material';
import {
  TrendingUp,
  Package,
  AlertTriangle,
  Clock,
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Sparkles,
  Eye,
  ShieldCheck,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const mockMonthlyRevenue = [
  { day: '01 Aug', revenue: 32000, profit: 9800 },
  { day: '05 Aug', revenue: 45000, profit: 13500 },
  { day: '10 Aug', revenue: 39000, profit: 11000 },
  { day: '15 Aug', revenue: 61000, profit: 18500 },
  { day: '20 Aug', revenue: 78000, profit: 24000 },
];


const mockCategoryData = [
  { name: 'Antibiotics', value: 38, color: '#0F766E' },
  { name: 'Analgesics', value: 25, color: '#2563EB' },
  { name: 'Cardiology', value: 18, color: '#8B5CF6' },
  { name: 'Vitamins', value: 12, color: '#22C55E' },
  { name: 'Others', value: 7, color: '#FB923C' },
];

const mockTopMedicines = [
  { name: 'Amoxicillin 500mg', sales: 412, stock: 85 },
  { name: 'Paracetamol 650mg', sales: 389, stock: 140 },
  { name: 'Metformin 500mg', sales: 290, stock: 42 },
  { name: 'Atorvastatin 10mg', sales: 245, stock: 18 },
  { name: 'Azithromycin 250mg', sales: 198, stock: 95 },
];

const sparklineData = [
  [{ v: 10 }, { v: 25 }, { v: 18 }, { v: 30 }, { v: 45 }],
  [{ v: 12 }, { v: 15 }, { v: 22 }, { v: 28 }, { v: 38 }],
  [{ v: 40 }, { v: 42 }, { v: 45 }, { v: 48 }, { v: 52 }],
  [{ v: 25 }, { v: 20 }, { v: 18 }, { v: 16 }, { v: 14 }],
  [{ v: 5 }, { v: 7 }, { v: 6 }, { v: 8 }, { v: 8 }],
];

// Map of known admin emails to their display prefix
const ADMIN_PREFIXES: Record<string, string> = {
  'srinivasa.rao@medledger.io': 'Dr.',
  'chaitanya@medledger.io': 'Mr.',
};

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isAdmin = user?.role === 'ADMIN';

  // Build greeting name with correct prefix
  const greetingName = React.useMemo(() => {
    if (!user) return '';
    if (isAdmin && user.email && ADMIN_PREFIXES[user.email]) {
      return `${ADMIN_PREFIXES[user.email]} ${user.full_name}`;
    }
    // For users, just use first name for a friendly greeting
    return user.full_name?.split(' ')[0] || user.full_name || 'there';
  }, [user, isAdmin]);

  const welcomeSubtitle = isAdmin
    ? 'Here is today\'s live pharmacy overview. You have full access to manage inventory, sales, analytics, and pharmacy operations.'
    : 'You have read-only access to monitor pharmacy inventory, sales history, and analytics.';

  const metricCards = [
    {
      title: "Today's Sales",
      value: formatCurrency(18450),
      subtitle: `vs ${formatCurrency(15200)} yesterday`,
      trend: "+21.2%",
      isPositive: true,
      icon: IndianRupee,
      color: "#0F766E",
      bgGradient: "linear-gradient(135deg, rgba(15, 118, 110, 0.18) 0%, rgba(20, 184, 166, 0.08) 100%)",
      sparkData: sparklineData[0],
    },
    {
      title: "Today's Profit",
      value: formatCurrency(4920),
      subtitle: "26.7% profit margin",
      trend: "+14.5%",
      isPositive: true,
      icon: TrendingUp,
      color: "#2563EB",
      bgGradient: "linear-gradient(135deg, rgba(37, 99, 235, 0.18) 0%, rgba(96, 165, 250, 0.08) 100%)",
      sparkData: sparklineData[1],
    },
    {
      title: "Inventory Value",
      value: formatCurrency(342580),
      subtitle: "1,420 Active SKUs",
      trend: "+5.2%",
      isPositive: true,
      icon: Package,
      color: "#8B5CF6",
      bgGradient: "linear-gradient(135deg, rgba(139, 92, 246, 0.18) 0%, rgba(196, 181, 253, 0.08) 100%)",
      sparkData: sparklineData[2],
    },
    {
      title: "Low Stock Alert",
      value: "14 Items",
      subtitle: "Action recommended",
      trend: "-3 SKUs",
      isPositive: false,
      icon: AlertTriangle,
      color: "#EF4444",
      bgGradient: "linear-gradient(135deg, rgba(239, 68, 68, 0.18) 0%, rgba(248, 113, 113, 0.08) 100%)",
      sparkData: sparklineData[3],
    },
    {
      title: "Expiring Soon",
      value: "8 Items",
      subtitle: "Within 30 days window",
      trend: "Action needed",
      isPositive: false,
      icon: Clock,
      color: "#FB923C",
      bgGradient: "linear-gradient(135deg, rgba(251, 146, 60, 0.18) 0%, rgba(253, 186, 116, 0.08) 100%)",
      sparkData: sparklineData[4],
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      {/* Welcome Banner */}
      <Box
        className="glass-panel"
        sx={{
          p: { xs: 2.5, sm: 3.5 },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2,
          background: isAdmin
            ? 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(221, 246, 243, 0.5) 100%) !important'
            : 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(219, 234, 254, 0.5) 100%) !important',
        }}
      >
        {/* Greeting */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            {isAdmin
              ? <ShieldCheck size={20} color="#0F766E" />
              : <Sparkles size={20} color="#2563EB" />
            }
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: '#17313B',
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
              }}
            >
              Welcome back, {greetingName}!
            </Typography>
            {isAdmin && (
              <Chip
                label="ADMIN"
                size="small"
                sx={{
                  bgcolor: 'rgba(15, 118, 110, 0.12)',
                  color: '#0F766E',
                  fontWeight: 800,
                  fontSize: '0.7rem',
                  border: '1px solid rgba(15, 118, 110, 0.25)',
                  height: 22,
                }}
              />
            )}
            {!isAdmin && (
              <Chip
                label="USER"
                size="small"
                sx={{
                  bgcolor: 'rgba(37, 99, 235, 0.1)',
                  color: '#2563EB',
                  fontWeight: 800,
                  fontSize: '0.7rem',
                  border: '1px solid rgba(37, 99, 235, 0.2)',
                  height: 22,
                }}
              />
            )}
          </Box>
          <Typography variant="body2" sx={{ color: '#64748B', maxWidth: 620 }}>
            {welcomeSubtitle}
          </Typography>
        </Box>

        {/* Role-based Action Panel */}
        {isAdmin ? (
          /* Admin: Action Buttons */
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', flexShrink: 0 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/inventory')}
              startIcon={<Package size={18} />}
              sx={{ borderRadius: '18px' }}
            >
              Manage Stock
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/sales')}
              startIcon={<IndianRupee size={18} />}
              className="glass-button"
              sx={{ borderRadius: '18px' }}
            >
              New Billing Sale
            </Button>
          </Box>
        ) : (
          /* User: Read-Only Access Card */
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2,
              borderRadius: '20px',
              background: 'rgba(37, 99, 235, 0.07)',
              border: '1px solid rgba(37, 99, 235, 0.18)',
              backdropFilter: 'blur(12px)',
              flexShrink: 0,
              maxWidth: { xs: '100%', md: 360 },
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '14px',
                bgcolor: 'rgba(37, 99, 235, 0.12)',
                color: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Eye size={22} />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#17313B', mb: 0.25 }}>
                Read-Only Access
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B', lineHeight: 1.4, display: 'block' }}>
                You can monitor inventory, sales history, and analytics. Inventory and sales updates are available only for administrators.
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* 5 Premium Metric Cards */}
      <Grid container spacing={2.5}>
        {metricCards.map((card, idx) => {
          const Icon = card.icon;

          return (
            <Grid item xs={12} sm={6} md={2.4} key={idx}>
              <Card
                className="glass-card"
                sx={{
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  background: `${card.bgGradient} !important`,
                }}
              >
                <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                      <Box
                        sx={{
                          width: 42,
                          height: 42,
                          borderRadius: '14px',
                          bgcolor: 'rgba(255, 255, 255, 0.6)',
                          backdropFilter: 'blur(10px)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: card.color,
                          boxShadow: `0 4px 12px ${card.color}20`,
                        }}
                      >
                        <Icon size={20} />
                      </Box>
                      <Chip
                        icon={card.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        label={card.trend}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(255, 255, 255, 0.65)',
                          backdropFilter: 'blur(8px)',
                          color: card.color,
                          fontWeight: 700,
                          fontSize: '0.725rem',
                          border: `1px solid ${card.color}30`,
                        }}
                      />
                    </Box>

                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {card.title}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#17313B', my: 0.5, letterSpacing: '-0.02em' }}>
                      {card.value}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500 }}>
                      {card.subtitle}
                    </Typography>
                  </Box>

                  {/* Sparkline chart */}
                  <Box sx={{ height: 35, width: '100%', mt: 1.5 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={card.sparkData}>
                        <Line
                          type="monotone"
                          dataKey="v"
                          stroke={card.color}
                          strokeWidth={2.5}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Main Charts Row */}
      <Grid container spacing={3}>
        {/* Daily Sales & Revenue Area Chart */}
        <Grid item xs={12} lg={8}>
          <Card className="glass-panel" sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#17313B' }}>
                  Daily Revenue & Profit Forecast
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B' }}>
                  Real-time sales breakdown across pharmacy operations
                </Typography>
              </Box>
              <Chip
                icon={<Calendar size={14} />}
                label="This Month (Aug 2026)"
                size="small"
                variant="outlined"
                sx={{ borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.4)' }}
              />
            </Box>

            <Box sx={{ width: '100%', height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockMonthlyRevenue} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F766E" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0F766E" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.4)" />
                  <XAxis dataKey="day" stroke="#64748B" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.85)',
                      backdropFilter: 'blur(16px)',
                      borderRadius: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.5)',
                      boxShadow: '0 10px 25px rgba(15, 118, 110, 0.1)',
                      color: '#17313B',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue (₹)"
                    stroke="#0F766E"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    name="Net Profit (₹)"
                    stroke="#2563EB"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorProfit)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* Inventory Category Pie Chart */}
        <Grid item xs={12} lg={4}>
          <Card className="glass-panel" sx={{ p: 3, height: '100%' }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#17313B' }}>
                Inventory Share
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B' }}>
                Distribution by therapeutic category
              </Typography>
            </Box>

            <Box sx={{ width: '100%', height: 220, position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {mockCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.85)',
                      backdropFilter: 'blur(12px)',
                      borderRadius: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
              {mockCategoryData.slice(0, 4).map((cat, i) => (
                <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: cat.color }} />
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>
                      {cat.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#17313B', fontSize: '0.85rem' }}>
                    {cat.value}%
                  </Typography>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Secondary Row: Top Selling Medicines & Expiry Alerts */}
      <Grid container spacing={3}>
        {/* Top Selling Medicines Bar Chart */}
        <Grid item xs={12} lg={7}>
          <Card className="glass-panel" sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#17313B' }}>
                  Top Fast-Moving Medicines
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B' }}>
                  Highest units dispensed this week
                </Typography>
              </Box>
              <Button size="small" onClick={() => navigate('/inventory')} sx={{ color: '#0F766E' }}>
                View All Inventory
              </Button>
            </Box>

            <Box sx={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockTopMedicines} layout="vertical" margin={{ top: 0, right: 20, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255, 255, 255, 0.4)" />
                  <XAxis type="number" stroke="#64748B" fontSize={11} />
                  <YAxis type="category" dataKey="name" stroke="#17313B" fontSize={12} tickLine={false} width={110} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.85)',
                      backdropFilter: 'blur(12px)',
                      borderRadius: '12px',
                    }}
                  />
                  <Bar dataKey="sales" name="Units Sold" fill="#0F766E" radius={[0, 10, 10, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* Expiry Warning Widget */}
        <Grid item xs={12} lg={5}>
          <Card className="glass-panel" sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Clock size={20} color="#FB923C" />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#17313B' }}>
                  Near Expiry Watchlist
                </Typography>
              </Box>
              <Chip label="8 Batches" size="small" sx={{ bgcolor: 'rgba(251, 146, 60, 0.15)', color: '#C2410C', fontWeight: 600 }} />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
              {[
                { name: 'Ciprofloxacin 500mg', batch: 'BAT-2024-09', date: '12 Sep 2026', stock: '45 Units', urgency: 'High' },
                { name: 'Omeprazole 20mg', batch: 'BAT-2024-11', date: '28 Sep 2026', stock: '120 Units', urgency: 'Medium' },
                { name: 'Ibuprofen 400mg', batch: 'BAT-2024-14', date: '04 Oct 2026', stock: '210 Units', urgency: 'Low' },
              ].map((item, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 1.75,
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.35)',
                    border: '1px solid rgba(255, 255, 255, 0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#17313B' }}>
                      {item.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                      Batch: {item.batch} • Exp: {item.date}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#FB923C', display: 'block' }}>
                      {item.stock}
                    </Typography>
                    <Chip
                      label={item.urgency}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.65rem',
                        bgcolor: item.urgency === 'High' ? '#EF444420' : '#FB923C20',
                        color: item.urgency === 'High' ? '#EF4444' : '#FB923C',
                        fontWeight: 700,
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

