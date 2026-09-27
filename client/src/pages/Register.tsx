import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  InputBase,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Mail, Lock, User as UserIcon, UserPlus, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Register: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      await register(fullName, email, password, confirmPassword);
      setSuccess('Account registered successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check details and try again.');
    } finally {
      setLoading(false);
    }
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
          top: '10%',
          right: '25%',
          width: 380,
          height: 380,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.2) 0%, rgba(255, 255, 255, 0) 70%)',
          filter: 'blur(50px)',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          left: '20%',
          width: 350,
          height: 350,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(15, 118, 110, 0.2) 0%, rgba(255, 255, 255, 0) 70%)',
          filter: 'blur(40px)',
          zIndex: 0,
        }}
      />

      {/* Centered Glass Card */}
      <Card
        className="glass-card"
        sx={{
          width: '100%',
          maxWidth: 480,
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
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                mx: 'auto',
                mb: 2,
                boxShadow: '0 10px 25px rgba(37, 99, 235, 0.3)',
              }}
            >
              <UserPlus size={30} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#17313B', letterSpacing: '-0.02em' }}>
              Create Staff Account
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
              Register for standard <span style={{ color: '#2563EB', fontWeight: 600 }}>USER</span> access
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: '14px', fontSize: '0.85rem' }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2.5, borderRadius: '14px', fontSize: '0.85rem' }}>
              {success}
            </Alert>
          )}

          {/* Registration Form */}
          <form onSubmit={handleRegister}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Full Name */}
              <Box>
                <Typography variant="caption" sx={{ color: '#17313B', fontWeight: 600, mb: 0.75, display: 'block' }}>
                  Full Name
                </Typography>
                <Box className="glass-input" sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.85 }}>
                  <UserIcon size={18} color="#64748B" />
                  <InputBase
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. John Doe"
                    sx={{ ml: 1.5, flexGrow: 1, fontSize: '0.925rem', color: '#17313B' }}
                  />
                </Box>
              </Box>

              {/* Email Address */}
              <Box>
                <Typography variant="caption" sx={{ color: '#17313B', fontWeight: 600, mb: 0.75, display: 'block' }}>
                  Email Address
                </Typography>
                <Box className="glass-input" sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.85 }}>
                  <Mail size={18} color="#64748B" />
                  <InputBase
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@medledger.io"
                    sx={{ ml: 1.5, flexGrow: 1, fontSize: '0.925rem', color: '#17313B' }}
                  />
                </Box>
              </Box>

              {/* Password */}
              <Box>
                <Typography variant="caption" sx={{ color: '#17313B', fontWeight: 600, mb: 0.75, display: 'block' }}>
                  Password
                </Typography>
                <Box className="glass-input" sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.85 }}>
                  <Lock size={18} color="#64748B" />
                  <InputBase
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    sx={{ ml: 1.5, flexGrow: 1, fontSize: '0.925rem', color: '#17313B' }}
                  />
                </Box>
              </Box>

              {/* Confirm Password */}
              <Box>
                <Typography variant="caption" sx={{ color: '#17313B', fontWeight: 600, mb: 0.75, display: 'block' }}>
                  Confirm Password
                </Typography>
                <Box className="glass-input" sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.85 }}>
                  <Lock size={18} color="#64748B" />
                  <InputBase
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    sx={{ ml: 1.5, flexGrow: 1, fontSize: '0.925rem', color: '#17313B' }}
                  />
                </Box>
              </Box>

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                disabled={loading}
                variant="contained"
                className="glass-button"
                endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <UserPlus size={18} />}
                sx={{
                  py: 1.4,
                  fontSize: '1rem',
                  borderRadius: '18px',
                  mt: 1,
                  background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%) !important',
                }}
              >
                {loading ? 'Creating Account...' : 'Register Account'}
              </Button>
            </Box>
          </form>

          {/* Back to Login */}
          <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(226, 232, 240, 0.6)', textAlign: 'center' }}>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                <ArrowLeft size={14} /> Back to Sign In
              </Typography>
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register;
