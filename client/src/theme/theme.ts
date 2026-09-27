import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0F766E',
      light: '#14B8A6',
      dark: '#115E59',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#2563EB',
      light: '#60A5FA',
      dark: '#1D4ED8',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#22C55E',
    },
    warning: {
      main: '#FBBF24',
    },
    error: {
      main: '#EF4444',
    },
    background: {
      default: 'transparent',
      paper: 'rgba(255, 255, 255, 0.28)',
    },
    text: {
      primary: '#17313B',
      secondary: '#64748B',
      disabled: '#94A3B8',
    },
    divider: 'rgba(255, 255, 255, 0.35)',
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: { fontWeight: 700, fontSize: '2.25rem', letterSpacing: '-0.02em', color: '#17313B' },
    h2: { fontWeight: 700, fontSize: '1.875rem', letterSpacing: '-0.015em', color: '#17313B' },
    h3: { fontWeight: 600, fontSize: '1.5rem', letterSpacing: '-0.01em', color: '#17313B' },
    h4: { fontWeight: 600, fontSize: '1.25rem', color: '#17313B' },
    h5: { fontWeight: 600, fontSize: '1.125rem', color: '#17313B' },
    h6: { fontWeight: 600, fontSize: '1rem', color: '#17313B' },
    subtitle1: { fontWeight: 500, fontSize: '0.95rem', color: '#64748B' },
    subtitle2: { fontWeight: 500, fontSize: '0.85rem', color: '#64748B' },
    body1: { fontSize: '0.95rem', color: '#17313B', lineHeight: 1.5 },
    body2: { fontSize: '0.875rem', color: '#64748B', lineHeight: 1.4 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 24,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #DDF6F3 0%, #ECF9F8 45%, #F8FCFC 100%)',
          backgroundAttachment: 'fixed',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '18px',
          padding: '10px 22px',
          boxShadow: 'none',
          fontWeight: 600,
          transition: 'all 200ms ease-in-out',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(15, 118, 110, 0.25)',
            transform: 'translateY(-1px)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #0F766E 0%, #115E59 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #115E59 0%, #0F524C 100%)',
          },
        },
        outlined: {
          borderColor: 'rgba(255, 255, 255, 0.45)',
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(12px)',
          color: '#17313B',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.45)',
            borderColor: 'rgba(255, 255, 255, 0.6)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '24px',
          backgroundColor: 'rgba(255, 255, 255, 0.28)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.38)',
          boxShadow: '0 10px 30px rgba(15, 118, 110, 0.08)',
          transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '24px',
          backgroundColor: 'rgba(255, 255, 255, 0.28)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.38)',
          boxShadow: '0 10px 30px rgba(15, 118, 110, 0.08)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.32)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          color: '#17313B',
          boxShadow: '0 8px 25px rgba(15, 118, 110, 0.07)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
          backgroundColor: 'transparent',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '18px',
          backgroundColor: 'rgba(255, 255, 255, 0.35)',
          backdropFilter: 'blur(16px)',
          '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.45)',
          },
          '&:hover fieldset': {
            borderColor: 'rgba(15, 118, 110, 0.5)',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#0F766E',
            borderWidth: '2px',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          fontWeight: 600,
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '28px',
          backgroundColor: 'rgba(255, 255, 255, 0.45)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          boxShadow: '0 20px 50px rgba(15, 118, 110, 0.15)',
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(255, 255, 255, 0.35)',
          color: '#17313B',
          padding: '14px 16px',
        },
        head: {
          fontWeight: 600,
          color: '#64748B',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
        },
      },
    },
  },
});

export default theme;

