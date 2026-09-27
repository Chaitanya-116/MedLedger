import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  InputBase,
  Alert,
  Chip,
  CircularProgress,
} from '@mui/material';
import { ShieldCheck, Mail, Lock, ArrowRight, Home } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('srinivasa.rao@medledger.io');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSelect = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Ambient Glow Orbs */}
      <Box
        sx={{
          position: 'absolute',
          top: '15%',
          left: '20%',
          width: 350,
          height: 350,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(15, 118, 110, 0.25) 0%, rgba(255, 255, 255, 0) 70%)',
          filter: 'blur(40px)',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          right: '20%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.2) 0%, rgba(255, 255, 255, 0) 70%)',
          filter: 'blur(50px)',
          zIndex: 0,
        }}
      />

      {/* Centered Glass Card */}
      <Card
        className="glass-card"
        sx={{
          width: '100%',
          maxWidth: 460,
          p: { xs: 3, sm: 4 },
          position: 'relative',
          zIndex: 1,
          borderRadius: '28px !important',
          background: 'rgba(255, 255, 255, 0.4) !important',
          backdropFilter: 'blur(28px) !important',
          border: '1px solid rgba(255, 255, 255, 0.5) !important',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.08) !important',
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {/* Brand Header */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #0F766E 0%, #115E59 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                mx: 'auto',
                mb: 2,
                boxShadow: '0 10px 25px rgba(15, 118, 110, 0.3)',
              }}
            >
              <ShieldCheck size={32} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F766E', letterSpacing: '-0.02em' }}>
              MedLedger
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
              Pharmacy Management & Control Portal
            </Typography>
          </Box>

          {/* Quick Demo Login Preset Chips */}
          <Box sx={{ mb: 3, p: 1.5, borderRadius: '16px', bgcolor: 'rgba(255, 255, 255, 0.45)', border: '1px solid rgba(255, 255, 255, 0.6)' }}>
            <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600, display: 'block', mb: 1, textAlign: 'center' }}>
              ⚡ Quick Demo Credentials
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
              <Chip
                label="Admin 1 (M. Srinivasa Rao)"
                size="small"
                onClick={() => handleDemoSelect('srinivasa.rao@medledger.io', 'Admin@123')}
                sx={{
                  bgcolor: 'rgba(15, 118, 110, 0.1)',
                  color: '#0F766E',
                  fontWeight: 600,
                  fontSize: '0.725rem',
                  border: '1px solid rgba(15, 118, 110, 0.25)',
                  '&:hover': { bgcolor: 'rgba(15, 118, 110, 0.2)' },
                }}
              />
              <Chip
                label="Admin 2 (M. Chaitanya)"
                size="small"
                onClick={() => handleDemoSelect('chaitanya@medledger.io', 'Admin@123')}
                sx={{
                  bgcolor: 'rgba(15, 118, 110, 0.1)',
                  color: '#0F766E',
                  fontWeight: 600,
                  fontSize: '0.725rem',
                  border: '1px solid rgba(15, 118, 110, 0.25)',
                  '&:hover': { bgcolor: 'rgba(15, 118, 110, 0.2)' },
                }}
              />
              <Chip
                label="User (Pharmacy Staff)"
                size="small"
                onClick={() => handleDemoSelect('staff@medledger.io', 'StaffPassword123')}
                sx={{
                  bgcolor: 'rgba(37, 99, 235, 0.1)',
                  color: '#2563EB',
                  fontWeight: 600,
                  fontSize: '0.725rem',
                  border: '1px solid rgba(37, 99, 235, 0.25)',
                  '&:hover': { bgcolor: 'rgba(37, 99, 235, 0.2)' },
                }}
              />
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: '14px', fontSize: '0.85rem' }}>
              {error}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleLogin}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {/* Email Input */}
              <Box>
                <Typography variant="caption" sx={{ color: '#17313B', fontWeight: 600, mb: 0.75, display: 'block' }}>
                  Email Address
                </Typography>
                <Box
                  className="glass-input"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    px: 2,
                    py: 1,
                  }}
                >
                  <Mail size={18} color="#64748B" />
                  <InputBase
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    sx={{ ml: 1.5, flexGrow: 1, fontSize: '0.925rem', color: '#17313B' }}
                  />
                </Box>
              </Box>

              {/* Password Input */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                  <Typography variant="caption" sx={{ color: '#17313B', fontWeight: 600 }}>
                    Password
                  </Typography>
                </Box>
                <Box
                  className="glass-input"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    px: 2,
                    py: 1,
                  }}
                >
                  <Lock size={18} color="#64748B" />
                  <InputBase
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    sx={{ ml: 1.5, flexGrow: 1, fontSize: '0.925rem', color: '#17313B' }}
                  />
                </Box>
              </Box>

              {/* Submit Button */}
              {(() => {
                const isAdminEmail =
                  email.toLowerCase() === 'srinivasa.rao@medledger.io' ||
                  email.toLowerCase() === 'chaitanya@medledger.io' ||
                  email.toLowerCase().includes('admin');

                const buttonText = loading
                  ? 'Signing In...'
                  : isAdminEmail
                  ? 'Sign to Admin'
                  : 'Sign In User';

                return (
                  <Button
                    type="submit"
                    fullWidth
                    disabled={loading}
                    variant="contained"
                    className="glass-button"
                    endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <ArrowRight size={18} />}
                    sx={{
                      py: 1.5,
                      fontSize: '1rem',
                      borderRadius: '18px',
                      mt: 1,
                      background: isAdminEmail
                        ? 'linear-gradient(135deg, #0F766E 0%, #115E59 100%) !important'
                        : 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%) !important',
                      boxShadow: isAdminEmail
                        ? '0 8px 20px rgba(15, 118, 110, 0.3) !important'
                        : '0 8px 20px rgba(37, 99, 235, 0.3) !important',
                    }}
                  >
                    {buttonText}
                  </Button>
                );
              })()}
            </Box>
          </form>

          {/* Register Link */}
          <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(226, 232, 240, 0.6)', textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500 }}>
              Don't have a staff account?{' '}
              <Link to="/register" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>
                Register here (USER Role)
              </Link>
            </Typography>
          </Box>

          {/* Go to Home Page */}
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              fullWidth
              onClick={() => navigate('/')}
              startIcon={<Home size={17} />}
              sx={{
                py: 1.25,
                fontSize: '0.9rem',
                fontWeight: 600,
                borderRadius: '18px',
                color: '#475569',
                background: 'rgba(255, 255, 255, 0.35)',
                border: '1px solid rgba(203, 213, 225, 0.6)',
                backdropFilter: 'blur(12px)',
                textTransform: 'none',
                transition: 'all 220ms ease',
                '&:hover': {
                  background: 'rgba(15, 118, 110, 0.07)',
                  border: '1px solid rgba(15, 118, 110, 0.35)',
                  color: '#0F766E',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 18px rgba(15, 118, 110, 0.12)',
                },
              }}
            >
              Go to Home Page
            </Button>
          </Box>

          {/* Footer note */}
          <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: '#94A3B8', mt: 2 }}>
            MedLedger v1.0 • Encrypted Glass Architecture
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
