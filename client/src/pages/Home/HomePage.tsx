import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Container,
} from '@mui/material';
import {
  ShieldCheck,
  Building2,
  Pill,
  HeartPulse,
  Clock,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  UserPlus,
  LogIn,
  CheckCircle2,
  Sparkles,
  Baby,
  Stethoscope,
  Activity,
  Award,
  ThumbsUp,
  Package,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect to dashboard if user is already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const categories = [
    {
      title: 'Prescription Medicines',
      desc: 'Authentic prescription drugs dispensed by registered pharmacists.',
      icon: Pill,
      badge: 'Rx Required',
    },
    {
      title: 'General Medicines',
      desc: 'Over-the-counter essentials for fever, pain relief, cold, and cough.',
      icon: Stethoscope,
      badge: 'OTC Ready',
    },
    {
      title: 'Baby Care Products',
      desc: 'Infant formula, gentle skincare, diapers, and baby hygiene essentials.',
      icon: Baby,
      badge: 'Safe & Pure',
    },
    {
      title: 'First Aid Supplies',
      desc: 'Bandages, antiseptics, cotton rolls, tapes, and emergency care kits.',
      icon: HeartPulse,
      badge: 'Emergency Ready',
    },
    {
      title: 'Surgical Items',
      desc: 'Sterile gloves, syringes, masks, gauze rolls, and clinical supplies.',
      icon: Activity,
      badge: 'Sterile Grade',
    },
    {
      title: 'Diabetes Care',
      desc: 'Glucometers, test strips, lancets, and specialized diabetic care items.',
      icon: Award,
      badge: 'Precision Test',
    },
    {
      title: 'Blood Pressure Monitors',
      desc: 'Digital BP monitors, pulse oximeters, and daily health tracking gear.',
      icon: Activity,
      badge: 'Digital Accuracy',
    },
    {
      title: 'Vitamins & Supplements',
      desc: 'Multivitamins, calcium, protein powders, and immunity boosters.',
      icon: Sparkles,
      badge: '100% Genuine',
    },
    {
      title: 'Personal Care Products',
      desc: 'Derma skincare, soaps, oral hygiene, and daily grooming items.',
      icon: ThumbsUp,
      badge: 'Top Brands',
    },
    {
      title: 'Health & Wellness Products',
      desc: 'Ayurvedic health tonic, herbal supplements, and wellness drinks.',
      icon: Package,
      badge: 'Natural Wellness',
    },
  ];

  const whyChooseUs = [
    {
      title: 'Genuine Medicines',
      desc: '100% authentic medicines sourced directly from verified pharmaceutical distributors.',
      icon: ShieldCheck,
      color: '#0F766E',
    },
    {
      title: 'Affordable Prices',
      desc: 'Fair MRP pricing with maximal savings on chronic and monthly prescription refills.',
      icon: Award,
      color: '#2563EB',
    },
    {
      title: 'Trusted Local Pharmacy',
      desc: 'Serving Kurada village and surrounding communities in Karapa Mandal with dedication.',
      icon: Building2,
      color: '#16A34A',
    },
    {
      title: 'Daily Stock Availability',
      desc: 'Fresh batches and daily inventory replenishment ensuring your medicine is never out of stock.',
      icon: CheckCircle2,
      color: '#D97706',
    },
  ];

  const aboutPoints = [
    'Genuine branded medicines from leading pharmaceutical manufacturers.',
    'Complete range of prescription & over-the-counter (OTC) medicines.',
    'Dedicated Healthcare, Surgical, & Baby Care product sections.',
    'Friendly, patient-centric customer support and dosage guidance.',
    'Reliable medicine availability every single day of the week.',
    'Convenient location right on Main Road, Kurada.',
  ];

  return (
    <Box
      id="home"
      sx={{
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        overflowX: 'hidden',
        color: '#17313B',
      }}
    >
      {/* Background Ambient Glow Orbs */}
      <Box
        sx={{
          position: 'fixed',
          top: '-10%',
          left: '15%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(15, 118, 110, 0.22) 0%, rgba(255, 255, 255, 0) 70%)',
          filter: 'blur(60px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'fixed',
          bottom: '10%',
          right: '15%',
          width: 550,
          height: 550,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.18) 0%, rgba(255, 255, 255, 0) 70%)',
          filter: 'blur(70px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* FLOATING GLASS NAVBAR */}
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 16,
          zIndex: 1100,
          px: { xs: 2, md: 4 },
          mb: 4,
        }}
      >
        <Container maxWidth="lg" disableGutters>
          <Box
            className="glass-navbar"
            sx={{
              py: 1.5,
              px: { xs: 2, md: 3 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              borderRadius: '24px',
              background: 'rgba(255, 255, 255, 0.55) !important',
              backdropFilter: 'blur(20px) !important',
              border: '1px solid rgba(255, 255, 255, 0.6) !important',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05) !important',
            }}
          >
            {/* Left Brand Info */}
            <Box
              onClick={() => navigate('/')}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                cursor: 'pointer',
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #0F766E 0%, #115E59 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: '0 8px 20px rgba(15, 118, 110, 0.3)',
                  flexShrink: 0,
                }}
              >
                <ShieldCheck size={26} />
              </Box>
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1.05rem' },
                    lineHeight: 1.1,
                    color: '#0F766E',
                    letterSpacing: '-0.01em',
                  }}
                >
                  SRI LAKSHMI GANAPATHI
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#64748B',
                    fontWeight: 600,
                    fontSize: { xs: '0.65rem', sm: '0.75rem' },
                    display: 'block',
                  }}
                >
                  MEDICAL AND GENERAL STORE
                </Typography>
              </Box>
            </Box>

            {/* Center Nav Links */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                gap: 3,
              }}
            >
              {[
                { label: 'Home', href: '#home' },
                { label: 'About', href: '#about' },
                { label: 'Services', href: '#services' },
                { label: 'Medicines', href: '#medicines' },
                { label: 'Timings', href: '#timings' },
                { label: 'Contact', href: '#contact' },
              ].map((link) => (
                <Typography
                  key={link.label}
                  component="a"
                  href={link.href}
                  variant="body2"
                  sx={{
                    color: '#17313B',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'color 200ms ease',
                    '&:hover': { color: '#0F766E' },
                  }}
                >
                  {link.label}
                </Typography>
              ))}
            </Box>

            {/* Right Side Auth Buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/login')}
                startIcon={<LogIn size={16} />}
                sx={{
                  borderRadius: '16px',
                  borderColor: 'rgba(15, 118, 110, 0.4)',
                  color: '#0F766E',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  px: { xs: 1.5, sm: 2.5 },
                  py: 0.8,
                  '&:hover': {
                    bgcolor: 'rgba(15, 118, 110, 0.08)',
                    borderColor: '#0F766E',
                  },
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/register')}
                startIcon={<UserPlus size={16} />}
                sx={{
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #0F766E 0%, #115E59 100%)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  px: { xs: 1.5, sm: 2.5 },
                  py: 0.8,
                  boxShadow: '0 8px 20px rgba(15, 118, 110, 0.25)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #115E59 0%, #0F766E 100%)',
                  },
                }}
              >
                Sign Up
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 2 }}>
        {/* HERO SECTION */}
        <Box sx={{ mb: 10, pt: { xs: 2, md: 4 } }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Box>
                <Chip
                  icon={<Building2 size={16} color="#0F766E" />}
                  label="Trusted Pharmacy • Kurada, Kakinada"
                  sx={{
                    bgcolor: 'rgba(15, 118, 110, 0.12)',
                    color: '#0F766E',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    mb: 2.5,
                    border: '1px solid rgba(15, 118, 110, 0.25)',
                    px: 0.5,
                  }}
                />
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '2.1rem', sm: '2.8rem', md: '3.4rem' },
                    lineHeight: 1.15,
                    color: '#17313B',
                    letterSpacing: '-0.02em',
                    mb: 2,
                  }}
                >
                  SRI LAKSHMI GANAPATHI MEDICAL AND GENERAL STORE
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: '#0F766E',
                    fontSize: { xs: '1.05rem', sm: '1.25rem' },
                    mb: 2,
                  }}
                >
                  Your Trusted Medical Store in Kurada, Karapa Mandal, Kakinada District.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#64748B',
                    fontSize: { xs: '0.95rem', sm: '1.05rem' },
                    lineHeight: 1.6,
                    mb: 4,
                    maxWidth: 620,
                  }}
                >
                  Providing genuine medicines, healthcare essentials, surgical products, baby care items, wellness products, and prescription medicines with trusted service every day.
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/login')}
                    endIcon={<ArrowRight size={20} />}
                    sx={{
                      borderRadius: '18px',
                      background: 'linear-gradient(135deg, #0F766E 0%, #115E59 100%)',
                      px: 3.5,
                      py: 1.6,
                      fontSize: '1rem',
                      fontWeight: 700,
                      boxShadow: '0 10px 25px rgba(15, 118, 110, 0.3)',
                    }}
                  >
                    Login to MedLedger
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/register')}
                    startIcon={<UserPlus size={20} />}
                    sx={{
                      borderRadius: '18px',
                      borderColor: 'rgba(37, 99, 235, 0.4)',
                      color: '#2563EB',
                      px: 3.5,
                      py: 1.6,
                      fontSize: '1rem',
                      fontWeight: 700,
                      bgcolor: 'rgba(255, 255, 255, 0.4)',
                      '&:hover': {
                        bgcolor: 'rgba(37, 99, 235, 0.08)',
                        borderColor: '#2563EB',
                      },
                    }}
                  >
                    Create Account
                  </Button>
                </Box>
              </Box>
            </Grid>

            {/* Hero Right Glass Card Illustration */}
            <Grid item xs={12} md={5}>
              <Card
                className="glass-card"
                sx={{
                  p: { xs: 3, sm: 4 },
                  borderRadius: '28px !important',
                  background: 'rgba(255, 255, 255, 0.45) !important',
                  backdropFilter: 'blur(28px) !important',
                  border: '1px solid rgba(255, 255, 255, 0.6) !important',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.08) !important',
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '22px',
                      background: 'linear-gradient(135deg, #0F766E 0%, #115E59 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      mb: 3,
                      boxShadow: '0 10px 25px rgba(15, 118, 110, 0.3)',
                    }}
                  >
                    <Building2 size={36} />
                  </Box>

                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#17313B', mb: 1 }}>
                    Store Highlights
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
                    Serving patients and families across Karapa Mandal.
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {[
                      { icon: ShieldCheck, title: '100% Genuine Medicines', subtitle: 'Direct distributor supply' },
                      { icon: Clock, title: 'Open 7 Days a Week', subtitle: '09:00 AM — 10:00 PM' },
                      { icon: HeartPulse, title: 'Full Surgical & OTC Stock', subtitle: 'Emergency supplies ready' },
                    ].map((item, idx) => {
                      const IconComp = item.icon;
                      return (
                        <Box
                          key={idx}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            p: 1.5,
                            borderRadius: '18px',
                            bgcolor: 'rgba(255, 255, 255, 0.5)',
                            border: '1px solid rgba(255, 255, 255, 0.6)',
                          }}
                        >
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '12px',
                              bgcolor: 'rgba(15, 118, 110, 0.12)',
                              color: '#0F766E',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <IconComp size={22} />
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#17313B', lineHeight: 1.2 }}>
                              {item.title}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500 }}>
                              {item.subtitle}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* ABOUT OUR SHOP */}
        <Box id="about" sx={{ mb: 10, pt: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip
              label="Established & Trusted Local Pharmacy"
              sx={{ bgcolor: 'rgba(37, 99, 235, 0.12)', color: '#2563EB', fontWeight: 700, mb: 1.5 }}
            />
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#17313B', letterSpacing: '-0.02em' }}>
              About Our Medical Store
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748B', mt: 1, maxWidth: 720, mx: 'auto' }}>
              <strong>SRI LAKSHMI GANAPATHI MEDICAL AND GENERAL STORE</strong> is a trusted neighborhood pharmacy serving Kurada and nearby villages in Karapa Mandal, Kakinada District.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {aboutPoints.map((point, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  className="glass-card"
                  sx={{
                    height: '100%',
                    p: 2.5,
                    borderRadius: '22px !important',
                    transition: 'all 300ms ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 15px 35px rgba(15, 118, 110, 0.15) !important',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.75 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '12px',
                        bgcolor: 'rgba(15, 118, 110, 0.12)',
                        color: '#0F766E',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        mt: 0.25,
                      }}
                    >
                      <CheckCircle2 size={20} />
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#17313B', lineHeight: 1.5 }}>
                      {point}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* WHAT WE SELL */}
        <Box id="medicines" sx={{ mb: 10, pt: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip
              label="Complete Healthcare Inventory"
              sx={{ bgcolor: 'rgba(15, 118, 110, 0.12)', color: '#0F766E', fontWeight: 700, mb: 1.5 }}
            />
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#17313B', letterSpacing: '-0.02em' }}>
              What We Sell
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748B', mt: 1 }}>
              Browse our comprehensive range of pharmaceutical and general healthcare products.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {categories.map((cat, index) => {
              const IconComponent = cat.icon;
              return (
                <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                  <Card
                    className="glass-card"
                    sx={{
                      height: '100%',
                      p: 2.5,
                      borderRadius: '24px !important',
                      display: 'flex',
                      flexDirection: 'column',
                      justify: 'space-between',
                      transition: 'all 300ms ease',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08) !important',
                      },
                    }}
                  >
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: '16px',
                            bgcolor: 'rgba(15, 118, 110, 0.12)',
                            color: '#0F766E',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <IconComponent size={22} />
                        </Box>
                      </Box>

                      <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', color: '#17313B', mb: 1, lineHeight: 1.3 }}>
                        {cat.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.825rem', lineHeight: 1.4, mb: 2 }}>
                        {cat.desc}
                      </Typography>
                    </Box>

                    <Chip
                      label={cat.badge}
                      size="small"
                      sx={{
                        fontSize: '0.675rem',
                        fontWeight: 700,
                        bgcolor: 'rgba(255, 255, 255, 0.6)',
                        color: '#0F766E',
                        border: '1px solid rgba(15, 118, 110, 0.2)',
                        alignSelf: 'flex-start',
                      }}
                    />
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {/* WHY CHOOSE US */}
        <Box id="services" sx={{ mb: 10, pt: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip
              label="Why Customers Rely On Us"
              sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#059669', fontWeight: 700, mb: 1.5 }}
            />
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#17313B', letterSpacing: '-0.02em' }}>
              Why Choose Us
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748B', mt: 1 }}>
              Our core commitments to patient health and community trust.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {whyChooseUs.map((feature, index) => {
              const IconComp = feature.icon;
              return (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card
                    className="glass-card"
                    sx={{
                      height: '100%',
                      p: 3,
                      borderRadius: '26px !important',
                      textAlign: 'center',
                      transition: 'all 300ms ease',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08) !important',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '20px',
                        bgcolor: `${feature.color}15`,
                        color: feature.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2.5,
                      }}
                    >
                      <IconComp size={28} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#17313B', mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.5 }}>
                      {feature.desc}
                    </Typography>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {/* SHOP TIMINGS */}
        <Box id="timings" sx={{ mb: 10, pt: 4 }}>
          <Card
            className="glass-card"
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: '32px !important',
              background: 'linear-gradient(135deg, rgba(15, 118, 110, 0.12) 0%, rgba(37, 99, 235, 0.08) 100%) !important',
              border: '1px solid rgba(255, 255, 255, 0.6) !important',
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #0F766E 0%, #115E59 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                boxShadow: '0 10px 25px rgba(15, 118, 110, 0.3)',
              }}
            >
              <Clock size={32} />
            </Box>

            <Typography variant="h3" sx={{ fontWeight: 800, color: '#17313B', mb: 1 }}>
              Shop Timings
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748B', mb: 3 }}>
              We are open every single day to serve your medical needs.
            </Typography>

            <Box
              sx={{
                display: 'inline-flex',
                flexDirection: 'column',
                gap: 1.5,
                p: 3,
                borderRadius: '24px',
                bgcolor: 'rgba(255, 255, 255, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.7)',
                minWidth: { xs: '100%', sm: 360 },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#17313B' }}>
                  Monday — Sunday
                </Typography>
                <Chip label="Open Every Day" color="success" size="small" sx={{ fontWeight: 700 }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F766E' }}>
                09:00 AM — 10:00 PM
              </Typography>
            </Box>
          </Card>
        </Box>

        {/* CONTACT & LOCATION */}
        <Box id="contact" sx={{ mb: 10, pt: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip
              label="Visit Our Store"
              sx={{ bgcolor: 'rgba(15, 118, 110, 0.12)', color: '#0F766E', fontWeight: 700, mb: 1.5 }}
            />
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#17313B', letterSpacing: '-0.02em' }}>
              Contact & Location
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748B', mt: 1 }}>
              Located conveniently on Main Road, Kurada.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Address Details */}
            <Grid item xs={12} md={6}>
              <Card
                className="glass-card"
                sx={{
                  height: '100%',
                  p: { xs: 3, sm: 4 },
                  borderRadius: '28px !important',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                }}
              >
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: '14px',
                        bgcolor: 'rgba(15, 118, 110, 0.12)',
                        color: '#0F766E',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <MapPin size={24} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#17313B' }}>
                      Official Address
                    </Typography>
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F766E', mb: 1.5 }}>
                    SRI LAKSHMI GANAPATHI MEDICAL AND GENERAL STORE
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, color: '#475569', fontSize: '0.975rem', fontWeight: 500 }}>
                    <Typography variant="body2">Door No: 2-87</Typography>
                    <Typography variant="body2">Ground Floor, Shop No.1</Typography>
                    <Typography variant="body2">Main Road, Kurada</Typography>
                    <Typography variant="body2">Karapa Mandal</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#17313B' }}>
                      PIN: 533260
                    </Typography>
                    <Typography variant="body2">Kakinada District, Andhra Pradesh</Typography>
                  </Box>
                </Box>

                <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(226, 232, 240, 0.6)', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Phone size={18} color="#0F766E" />
                    <Typography variant="body2" sx={{ color: '#17313B', fontWeight: 600 }}>
                      +91 99632 44623 (Store Enquiry)
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Mail size={18} color="#0F766E" />
                    <Typography variant="body2" sx={{ color: '#17313B', fontWeight: 600 }}>
                      chaitanyamagapu14@gmail.com
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>

            {/* Reserved Google Maps Container */}
            <Grid item xs={12} md={6}>
              <Card
                className="glass-card"
                sx={{
                  height: '100%',
                  minHeight: 320,
                  p: { xs: 3, sm: 4 },
                  borderRadius: '28px !important',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.4) !important',
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '22px',
                    bgcolor: 'rgba(37, 99, 235, 0.12)',
                    color: '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <MapPin size={32} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#17313B', mb: 1 }}>
                  Google Maps Location
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B', maxWidth: 360, mb: 3 }}>
                  Main Road, Kurada, Karapa Mandal, Kakinada District (PIN: 533260).
                </Typography>
                <Chip
                  label="Map Integration Ready"
                  variant="outlined"
                  sx={{ borderColor: 'rgba(37, 99, 235, 0.4)', color: '#2563EB', fontWeight: 700 }}
                />
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* FOOTER */}
      <Box
        component="footer"
        sx={{
          mt: 8,
          py: 4,
          px: 2,
          background: 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.6)',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ mb: 4 }}>
            <Grid item xs={12} md={5}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F766E', mb: 1 }}>
                SRI LAKSHMI GANAPATHI MEDICAL AND GENERAL STORE
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B', maxWidth: 400, mb: 2 }}>
                Providing genuine medicines, surgical supplies, and healthcare essentials to Kurada and nearby villages in Kakinada District.
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600 }}>
                Store Hours: Mon — Sun (09:00 AM — 10:00 PM)
              </Typography>
            </Grid>

            <Grid item xs={6} md={3.5}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#17313B', mb: 1.5 }}>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography component="a" href="#home" variant="body2" sx={{ color: '#64748B', textDecoration: 'none', '&:hover': { color: '#0F766E' } }}>Home</Typography>
                <Typography component="a" href="#about" variant="body2" sx={{ color: '#64748B', textDecoration: 'none', '&:hover': { color: '#0F766E' } }}>About Us</Typography>
                <Typography component="a" href="#medicines" variant="body2" sx={{ color: '#64748B', textDecoration: 'none', '&:hover': { color: '#0F766E' } }}>What We Sell</Typography>
                <Typography component="a" href="#timings" variant="body2" sx={{ color: '#64748B', textDecoration: 'none', '&:hover': { color: '#0F766E' } }}>Shop Timings</Typography>
                <Typography component="a" href="#contact" variant="body2" sx={{ color: '#64748B', textDecoration: 'none', '&:hover': { color: '#0F766E' } }}>Contact & Location</Typography>
              </Box>
            </Grid>

            <Grid item xs={6} md={3.5}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#17313B', mb: 1.5 }}>
                MedLedger Terminal Access
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/login')}
                  startIcon={<LogIn size={15} />}
                  sx={{ borderRadius: '12px', justifyContent: 'flex-start', color: '#0F766E', borderColor: 'rgba(15, 118, 110, 0.3)' }}
                >
                  Sign In to Terminal
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => navigate('/register')}
                  startIcon={<UserPlus size={15} />}
                  sx={{ borderRadius: '12px', justifyContent: 'flex-start', bgcolor: '#2563EB' }}
                >
                  Register Staff Account
                </Button>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ pt: 3, borderTop: '1px solid rgba(226, 232, 240, 0.6)', textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
              © 2026 SRI LAKSHMI GANAPATHI MEDICAL AND GENERAL STORE. Powered by MedLedger.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
