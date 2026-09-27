import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  Chip,
  Button,
} from '@mui/material';
import {
  BarChart3,
  TrendingUp,
  IndianRupee,
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Layers,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

const mockMonthlyRevenueTrend = [
  { month: 'Jan', revenue: 2400000, profit: 720000, expenses: 1680000 },
  { month: 'Feb', revenue: 2850000, profit: 850000, expenses: 2000000 },
  { month: 'Mar', revenue: 3200000, profit: 980000, expenses: 2220000 },
  { month: 'Apr', revenue: 3100000, profit: 910000, expenses: 2190000 },
  { month: 'May', revenue: 3800000, profit: 1140000, expenses: 2660000 },
  { month: 'Jun', revenue: 4250000, profit: 1320000, expenses: 2930000 },
  { month: 'Jul', revenue: 4900000, profit: 1510000, expenses: 3390000 },
];

const mockCategoryDistribution = [
  { name: 'Antibiotics', sales: 4200000, color: '#0F766E' },
  { name: 'Analgesics', sales: 2800000, color: '#2563EB' },
  { name: 'Cardiology', sales: 2100000, color: '#8B5CF6' },
  { name: 'Diabetes', sales: 1800000, color: '#22C55E' },
  { name: 'Vitamins', sales: 1400000, color: '#FB923C' },
];

const mockExpiryForecast = [
  { window: '< 30 Days', count: 8, cost: 145000 },
  { window: '30–60 Days', count: 18, cost: 320000 },
  { window: '60–90 Days', count: 29, cost: 580000 },
  { window: '> 90 Days', count: 140, cost: 2400000 },
];


export const Analytics: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <BarChart3 size={24} color="#0F766E" />
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#17313B' }}>
              Pharmacy Intelligence & Analytics
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            Comprehensive sales performance, profit margins, therapeutic demand, and stock forecasting metrics.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={<Calendar size={18} />}
            sx={{ borderRadius: '18px' }}
          >
            YTD 2026
          </Button>
          <Button
            variant="contained"
            className="glass-button"
            startIcon={<Download size={18} />}
            sx={{ borderRadius: '18px' }}
          >
            Export Analytics Report
          </Button>
        </Box>
      </Box>

      {/* Analytics High-Level Highlights */}
      <Grid container spacing={2.5}>
        {[
          { title: 'Total YTD Revenue', value: formatCurrency(24500000), trend: '+24.5%', isPos: true, icon: IndianRupee, color: '#0F766E' },
          { title: 'Average Gross Margin', value: '30.8%', trend: '+2.1%', isPos: true, icon: TrendingUp, color: '#2563EB' },
          { title: 'Monthly Orders Dispensed', value: '3,840 Bills', trend: '+14.2%', isPos: true, icon: Activity, color: '#8B5CF6' },
          { title: 'Stock Turnover Rate', value: '4.2x / Year', trend: 'Healthy', isPos: true, icon: Layers, color: '#22C55E' },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card className="glass-card" sx={{ p: 2.5, height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '14px',
                      bgcolor: `${item.color}18`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: item.color,
                    }}
                  >
                    <Icon size={22} />
                  </Box>
                  <Chip
                    icon={item.isPos ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    label={item.trend}
                    size="small"
                    sx={{ bgcolor: `${item.color}15`, color: item.color, fontWeight: 700 }}
                  />
                </Box>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                  {item.title}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#17313B', mt: 0.5 }}>
                  {item.value}
                </Typography>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Revenue & Profit Area Chart */}
      <Card className="glass-panel" sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#17313B' }}>
              Revenue vs Expenses vs Profit (Monthly)
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B' }}>
              Financial trajectory over the past 7 months
            </Typography>
          </Box>
        </Box>

        <Box sx={{ width: '100%', height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockMonthlyRevenueTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0F766E" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0F766E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.4)" />
              <XAxis dataKey="month" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="revenue" name="Total Revenue (₹)" stroke="#0F766E" fill="url(#colorRev)" strokeWidth={3} />
              <Area type="monotone" dataKey="profit" name="Net Profit (₹)" stroke="#2563EB" fill="url(#colorProf)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Card>

      {/* Grid: Sales by Category & Expiry Risk Forecast */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <Card className="glass-panel" sx={{ p: 3, height: '100%' }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#17313B' }}>
                Sales Revenue by Category
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B' }}>
                Therapeutic segment distribution
              </Typography>
            </Box>

            <Box sx={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockCategoryDistribution} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.4)" />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
                  <YAxis stroke="#64748B" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.85)',
                      backdropFilter: 'blur(12px)',
                      borderRadius: '12px',
                    }}
                  />
                  <Bar dataKey="sales" name="Sales (₹)" radius={[10, 10, 0, 0]}>
                    {mockCategoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card className="glass-panel" sx={{ p: 3, height: '100%' }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#17313B' }}>
                Batch Expiry Cost Risk Forecast
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B' }}>
                Potential inventory value at risk by timeline
              </Typography>
            </Box>

            <Box sx={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockExpiryForecast} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.4)" />
                  <XAxis dataKey="window" stroke="#64748B" fontSize={12} />
                  <YAxis stroke="#64748B" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.85)',
                      backdropFilter: 'blur(12px)',
                      borderRadius: '12px',
                    }}
                  />
                  <Bar dataKey="cost" name="Risk Value (₹)" fill="#FB923C" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
