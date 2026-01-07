/**
 * PHTS System - Color Palette
 *
 * Medical Clean Theme - Professional, Trustworthy, Minimalist
 * Optimized for hospital/healthcare environments
 *
 * Primary: Deep Teal (#00695f) - Conveys trust, professionalism, healthcare
 * Background: Light Gray (#F4F6F8) - Reduces eye strain for long sessions
 */

import { PaletteOptions, alpha } from '@mui/material/styles';

// New medical/enterprise blue palette
const primary = {
  lighter: '#D0E6F7',
  light: '#6CA6E0',
  main: '#006C9C',
  dark: '#004B75',
  darker: '#002D4A',
  contrastText: '#FFFFFF',
};

const secondary = {
  lighter: '#E6F4F1',
  light: '#85C7BC',
  main: '#009688',
  dark: '#00695F',
  darker: '#003D38',
  contrastText: '#FFFFFF',
};

const error = {
  lighter: '#FFE7D9',
  light: '#FFA48D',
  main: '#FF4842',
  dark: '#B72136',
  darker: '#7A0C2E',
  contrastText: '#FFFFFF',
};

const success = {
  lighter: '#E9FCD4',
  light: '#AAF27F',
  main: '#54D62C',
  dark: '#229A16',
  darker: '#08660D',
  contrastText: '#212B36',
};

const info = {
  lighter: '#D0F2FF',
  light: '#74CAFF',
  main: '#1890FF',
  dark: '#0C53B7',
  darker: '#04297A',
  contrastText: '#FFFFFF',
};

const warning = {
  lighter: '#FFF7CD',
  light: '#FFE16A',
  main: '#FFB020',
  dark: '#B78103',
  darker: '#7A4F01',
  contrastText: '#212B36',
};

const grey = {
  0: '#FFFFFF',
  100: '#F8F9FA',
  200: '#F1F3F5',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
};

export const palette: PaletteOptions = {
  primary,
  secondary,
  error,
  success,
  info,
  warning,
  grey,
  text: {
    primary: grey[800],
    secondary: grey[600],
    disabled: grey[500],
  },
  background: {
    default: '#F4F6F8',
    paper: '#FFFFFF',
  },
  divider: alpha(grey[500], 0.2),
};
