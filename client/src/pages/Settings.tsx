import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Chip,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Store,
  Shield,
  Bell,
  Palette,
  Save,
  CheckCircle2,
} from 'lucide-react';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'store' | 'security' | 'notifications' | 'theme'>('store');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

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
            <SettingsIcon size={24} color="#0F766E" />
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#17313B' }}>
              Pharmacy System Preferences
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            Configure store profile, alert thresholds, tax configurations, and glass theme presets.
          </Typography>
        </Box>

        {savedSuccess && (
          <Chip
            icon={<CheckCircle2 size={16} />}
            label="Settings Saved Successfully!"
            color="success"
            sx={{ bgcolor: 'rgba(34, 197, 94, 0.18)', color: '#166534', fontWeight: 600 }}
          />
        )}
      </Box>

      {/* Settings Grid Layout */}
      <Grid container spacing={3}>
        {/* Navigation Tabs (Left side) */}
        <Grid item xs={12} md={3.5}>
          <Card className="glass-panel" sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {[
              { id: 'store', label: 'Store Profile', icon: Store },
              { id: 'security', label: 'Security & Auth', icon: Shield },
              { id: 'notifications', label: 'Alert Thresholds', icon: Bell },
              { id: 'theme', label: 'Theme & Glass FX', icon: Palette },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <Box
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  sx={{
                    p: 1.75,
                    px: 2,
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    cursor: 'pointer',
                    bgcolor: isActive ? '#0F766E' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#17313B',
                    fontWeight: isActive ? 600 : 500,
                    transition: 'all 200ms ease',
                    '&:hover': {
                      bgcolor: isActive ? '#0F766E' : 'rgba(255, 255, 255, 0.4)',
                    },
                  }}
                >
                  <Icon size={19} />
                  <Typography variant="body2" sx={{ fontSize: '0.925rem', fontWeight: isActive ? 600 : 500 }}>
                    {tab.label}
                  </Typography>
                </Box>
              );
            })}
          </Card>
        </Grid>

        {/* Content Area (Right side) */}
        <Grid item xs={12} md={8.5}>
          <Card className="glass-panel" sx={{ p: 4 }}>
            {activeTab === 'store' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#17313B' }}>
                  Store Profile & License
                </Typography>
                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.4)' }} />

                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Pharmacy Name" defaultValue="MedLedger Central Pharmacy" fullWidth size="small" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Drug License Number" defaultValue="DL-2026-991823-A" fullWidth size="small" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="GSTIN / Tax ID" defaultValue="27AAAAA0000A1Z5" fullWidth size="small" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Primary Contact Email" defaultValue="admin@medledger.io" fullWidth size="small" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField label="Store Address" defaultValue="Suite 402, Healthcare Plaza, Metro Station Road" multiline rows={2} fullWidth size="small" />
                  </Grid>
                </Grid>
              </Box>
            )}

            {activeTab === 'security' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#17313B' }}>
                  Security & Access Controls
                </Typography>
                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.4)' }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControlLabel
                    control={<Switch defaultChecked sx={{ color: '#0F766E', '&.Mui-checked': { color: '#0F766E' } }} />}
                    label={<Typography variant="body2" sx={{ fontWeight: 600 }}>Require Pharmacist PIN for Stock Removal</Typography>}
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked sx={{ color: '#0F766E', '&.Mui-checked': { color: '#0F766E' } }} />}
                    label={<Typography variant="body2" sx={{ fontWeight: 600 }}>Automatic Session Timeout after 15 Minutes</Typography>}
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked sx={{ color: '#0F766E', '&.Mui-checked': { color: '#0F766E' } }} />}
                    label={<Typography variant="body2" sx={{ fontWeight: 600 }}>Enable Audit Log Trailing for All Transactions</Typography>}
                  />
                </Box>
              </Box>
            )}

            {activeTab === 'notifications' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#17313B' }}>
                  Inventory & Expiry Threshold Alerts
                </Typography>
                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.4)' }} />

                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Low Stock Warning Threshold (Units)" type="number" defaultValue="20" fullWidth size="small" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Expiry Warning Days Window" type="number" defaultValue="30" fullWidth size="small" />
                  </Grid>
                </Grid>
              </Box>
            )}

            {activeTab === 'theme' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#17313B' }}>
                  Glassmorphism Appearance Presets
                </Typography>
                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.4)' }} />

                <Typography variant="body2" sx={{ color: '#64748B' }}>
                  Active Preset: Apple Glass UI + Emerald Primary Palette (#0F766E). Backdrop Filter Blur: 24px.
                </Typography>
              </Box>
            )}

            {/* Save Button */}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                className="glass-button"
                startIcon={<Save size={18} />}
                onClick={handleSave}
                sx={{ borderRadius: '18px', px: 4 }}
              >
                Save Preferences
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;
