/**
 * PHTS System - Typography Configuration
 *
 * Font: 'Sarabun' - Google Fonts, optimized for Thai language
 * Clear hierarchy for professional medical interface
 */

import { ThemeOptions } from '@mui/material/styles';

export const typography: ThemeOptions['typography'] = {
  fontFamily: [
    'Sarabun',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ].join(','),
  h1: {
    fontWeight: 700,
    fontSize: '2.5rem',
    lineHeight: 1.2,
    letterSpacing: '-0.01562em',
  },
  h2: {
    fontWeight: 600,
    fontSize: '2rem',
    lineHeight: 1.3,
    letterSpacing: '-0.00833em',
  },
  h3: {
    fontWeight: 600,
    fontSize: '1.75rem',
    lineHeight: 1.4,
  },
  h4: {
    fontWeight: 600,
    fontSize: '1.5rem',
    lineHeight: 1.4,
  },
  h5: {
    fontWeight: 600,
    fontSize: '1.25rem',
    lineHeight: 1.5,
  },
  h6: {
    fontWeight: 600,
    fontSize: '1rem',
    lineHeight: 1.5,
  },
  body1: {
    fontWeight: 400,
    fontSize: '1rem',
    lineHeight: 1.5,
  },
  body2: {
    fontWeight: 400,
    fontSize: '0.875rem',
    lineHeight: 1.57,
  },
  button: {
    fontWeight: 500,
    fontSize: '0.875rem',
    lineHeight: 1.75,
    textTransform: 'none', // Don't force uppercase for Thai text
  },
  caption: {
    fontWeight: 400,
    fontSize: '0.75rem',
    lineHeight: 1.66,
  },
  overline: {
    fontWeight: 600,
    fontSize: '0.75rem',
    lineHeight: 2.66,
    textTransform: 'uppercase',
  },
};
