/**
 * PHTS System - Theme Configuration
 *
 * Medical Clean Theme - Complete MUI theme with custom components
 */

'use client';

import { createTheme, ThemeOptions } from '@mui/material/styles';
import { palette } from './palette';
import { typography } from './typography';

const themeOptions: ThemeOptions = {
  palette,
  typography: {
    ...typography,
    fontFamily: 'Sarabun, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: {
    borderRadius: 12, // Softer, more modern corners
  },
  shadows: [
    'none',
    '0 1px 2px rgba(145, 158, 171, 0.12), 0 1px 1px rgba(145, 158, 171, 0.08)',
    '0 2px 4px rgba(145, 158, 171, 0.12), 0 2px 8px rgba(145, 158, 171, 0.08)',
    '0 4px 8px rgba(145, 158, 171, 0.12), 0 4px 12px rgba(145, 158, 171, 0.08)',
    '0 6px 12px rgba(145, 158, 171, 0.12), 0 6px 16px rgba(145, 158, 171, 0.08)',
    '0 8px 16px rgba(145, 158, 171, 0.12), 0 8px 20px rgba(145, 158, 171, 0.08)',
    '0 10px 18px rgba(145, 158, 171, 0.12), 0 10px 24px rgba(145, 158, 171, 0.08)',
    '0 12px 20px rgba(145, 158, 171, 0.12), 0 12px 28px rgba(145, 158, 171, 0.08)',
    '0 14px 22px rgba(145, 158, 171, 0.12), 0 14px 32px rgba(145, 158, 171, 0.08)',
    '0 16px 24px rgba(145, 158, 171, 0.12), 0 16px 36px rgba(145, 158, 171, 0.08)',
    '0 18px 26px rgba(145, 158, 171, 0.12), 0 18px 40px rgba(145, 158, 171, 0.08)',
    '0 20px 28px rgba(145, 158, 171, 0.12), 0 20px 44px rgba(145, 158, 171, 0.08)',
    '0 22px 30px rgba(145, 158, 171, 0.12), 0 22px 48px rgba(145, 158, 171, 0.08)',
    '0 24px 32px rgba(145, 158, 171, 0.12), 0 24px 52px rgba(145, 158, 171, 0.08)',
    '0 26px 34px rgba(145, 158, 171, 0.12), 0 26px 56px rgba(145, 158, 171, 0.08)',
    '0 28px 36px rgba(145, 158, 171, 0.12), 0 28px 60px rgba(145, 158, 171, 0.08)',
    '0 30px 38px rgba(145, 158, 171, 0.12), 0 30px 64px rgba(145, 158, 171, 0.08)',
    '0 32px 40px rgba(145, 158, 171, 0.12), 0 32px 68px rgba(145, 158, 171, 0.08)',
    '0 34px 42px rgba(145, 158, 171, 0.12), 0 34px 72px rgba(145, 158, 171, 0.08)',
    '0 36px 44px rgba(145, 158, 171, 0.12), 0 36px 76px rgba(145, 158, 171, 0.08)',
    '0 38px 46px rgba(145, 158, 171, 0.12), 0 38px 80px rgba(145, 158, 171, 0.08)',
    '0 40px 48px rgba(145, 158, 171, 0.12), 0 40px 84px rgba(145, 158, 171, 0.08)',
    '0 42px 50px rgba(145, 158, 171, 0.12), 0 42px 88px rgba(145, 158, 171, 0.08)',
    '0 44px 52px rgba(145, 158, 171, 0.12), 0 44px 92px rgba(145, 158, 171, 0.08)',
    '0 46px 54px rgba(145, 158, 171, 0.12), 0 46px 96px rgba(145, 158, 171, 0.08)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 8px 16px 0 rgba(0, 108, 156, 0.24)',
          },
        },
        sizeLarge: {
          height: 48,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow:
            '0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: {
          borderRadius: 12,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          color: palette.text?.secondary,
          backgroundColor: palette.background?.default,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
};

export const theme = createTheme(themeOptions);
