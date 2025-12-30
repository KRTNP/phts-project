/**
 * PHTS System - Color Palette
 *
 * Medical Clean Theme - Professional, Trustworthy, Minimalist
 * Optimized for hospital/healthcare environments
 *
 * Primary: Deep Teal (#00695f) - Conveys trust, professionalism, healthcare
 * Background: Light Gray (#F4F6F8) - Reduces eye strain for long sessions
 */

import { PaletteOptions } from '@mui/material/styles';

export const palette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#00695f', // Deep Teal - Medical professionalism
    light: '#439889', // Lighter teal for hover states
    dark: '#003d33', // Darker teal for active states
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#455a64', // Blue Gray - Complementary accent
    light: '#718792',
    dark: '#1c313a',
    contrastText: '#ffffff',
  },
  error: {
    main: '#d32f2f', // Accessible red
    light: '#ef5350',
    dark: '#c62828',
  },
  warning: {
    main: '#ed6c02',
    light: '#ff9800',
    dark: '#e65100',
  },
  info: {
    main: '#0288d1',
    light: '#03a9f4',
    dark: '#01579b',
  },
  success: {
    main: '#2e7d32', // Medical green
    light: '#4caf50',
    dark: '#1b5e20',
  },
  background: {
    default: '#F4F6F8', // Clean neutral background
    paper: '#FFFFFF', // Pure white for cards/dialogs
  },
  text: {
    primary: '#1a1a2e', // Near-black for maximum readability
    secondary: '#546e7a', // Muted for supporting text
    disabled: '#9e9e9e',
  },
  divider: 'rgba(0, 0, 0, 0.12)',
};
