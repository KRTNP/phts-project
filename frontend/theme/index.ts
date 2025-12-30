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
  typography,
  shape: {
    borderRadius: 12, // Softer, more modern corners
  },
  shadows: [
    'none',
    '0 2px 4px rgba(0,0,0,0.05)',
    '0 2px 8px rgba(0,0,0,0.08)',
    '0 4px 12px rgba(0,0,0,0.08)',
    '0 6px 16px rgba(0,0,0,0.1)',
    '0 8px 24px rgba(0,0,0,0.12)',
    '0 12px 32px rgba(0,0,0,0.12)',
    '0 16px 40px rgba(0,0,0,0.14)',
    '0 20px 48px rgba(0,0,0,0.14)',
    '0 24px 56px rgba(0,0,0,0.16)',
    '0 2px 4px rgba(0,0,0,0.05)',
    '0 2px 8px rgba(0,0,0,0.08)',
    '0 4px 12px rgba(0,0,0,0.08)',
    '0 6px 16px rgba(0,0,0,0.1)',
    '0 8px 24px rgba(0,0,0,0.12)',
    '0 12px 32px rgba(0,0,0,0.12)',
    '0 16px 40px rgba(0,0,0,0.14)',
    '0 20px 48px rgba(0,0,0,0.14)',
    '0 24px 56px rgba(0,0,0,0.16)',
    '0 24px 56px rgba(0,0,0,0.16)',
    '0 24px 56px rgba(0,0,0,0.16)',
    '0 24px 56px rgba(0,0,0,0.16)',
    '0 24px 56px rgba(0,0,0,0.16)',
    '0 24px 56px rgba(0,0,0,0.16)',
    '0 24px 56px rgba(0,0,0,0.16)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
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
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: {
          borderRadius: 12,
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
