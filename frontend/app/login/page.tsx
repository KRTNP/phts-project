/**
 * PHTS System - Login Page
 *
 * Professional login interface with glassmorphism design
 * Features: Citizen ID validation, password visibility toggle, role-based routing
 */

'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Stack,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  LocalHospital,
  Person,
  Lock,
} from '@mui/icons-material';
import { AuthService } from '@/services/authService';
import { LoginCredentials } from '@/types/auth';

export default function LoginPage() {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    citizen_id: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState({
    citizen_id: '',
    password: '',
  });

  // Validate Citizen ID (13 digits, numeric only)
  const validateCitizenId = (value: string): string => {
    if (!value) return 'กรุณากรอกเลขบัตรประชาชน';
    if (!/^\d+$/.test(value)) return 'กรุณากรอกตัวเลขเท่านั้น';
    if (value.length !== 13) return 'เลขบัตรประชาชนต้องมี 13 หลัก';
    return '';
  };

  // Validate Password
  const validatePassword = (value: string): string => {
    if (!value) return 'กรุณากรอกรหัสผ่าน';
    return '';
  };

  // Handle input change with validation
  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    // For citizen_id, only allow numeric input
    if (field === 'citizen_id') {
      // Remove non-numeric characters
      value = value.replace(/\D/g, '');
      // Limit to 13 digits
      if (value.length > 13) return;
    }

    setCredentials((prev) => ({ ...prev, [field]: value }));
    setError(null);

    // Validate on blur (will be triggered by form validation)
    if (field === 'citizen_id') {
      setFieldErrors((prev) => ({
        ...prev,
        citizen_id: value ? validateCitizenId(value) : '',
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const citizenIdError = validateCitizenId(credentials.citizen_id);
    const passwordError = validatePassword(credentials.password);

    setFieldErrors({
      citizen_id: citizenIdError,
      password: passwordError,
    });

    if (citizenIdError || passwordError) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await AuthService.login(credentials);

      if (response.success) {
        // Redirect to role-based dashboard
        AuthService.redirectToDashboard(response.user);
      }
    } catch (err: any) {
      setError(
        err.message || 'เลขบัตรประชาชนหรือรหัสผ่านไม่ถูกต้อง'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #00695f 0%, #004d40 100%)',
        padding: 2,
      }}
    >
      <Card
        elevation={8}
        sx={{
          maxWidth: 440,
          width: '100%',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: 3,
          overflow: 'visible',
        }}
      >
        <CardContent sx={{ padding: 4 }}>
          {/* Header */}
          <Stack spacing={2} alignItems="center" sx={{ mb: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00695f 0%, #004d40 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(0,105,95,0.3)',
              }}
            >
              <LocalHospital sx={{ fontSize: 48, color: 'white' }} />
            </Box>
            <Typography
              variant="h4"
              component="h1"
              fontWeight={600}
              color="primary"
              textAlign="center"
            >
              PHTS System
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              ระบบจัดการค่าตอบแทนกำลังคนด้านสาธารณสุข
            </Typography>
          </Stack>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* Citizen ID Field */}
              <TextField
                fullWidth
                label="เลขบัตรประชาชน (Citizen ID)"
                placeholder="1234567890123"
                value={credentials.citizen_id}
                onChange={(e) =>
                  handleInputChange('citizen_id', e.target.value)
                }
                error={!!fieldErrors.citizen_id}
                helperText={
                  fieldErrors.citizen_id ||
                  'กรอกเลขบัตรประชาชน 13 หลัก'
                }
                inputMode="numeric"
                autoComplete="username"
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Password Field */}
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                label="รหัสผ่าน (Password)"
                placeholder="DDMMYYYY"
                value={credentials.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                error={!!fieldErrors.password}
                helperText={
                  fieldErrors.password ||
                  'รหัสผ่านเริ่มต้น: วันเกิด (DDMMYYYY)'
                }
                autoComplete="current-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  position: 'relative',
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                  'เข้าสู่ระบบ (Login)'
                )}
              </Button>
            </Stack>
          </form>

          {/* Footer Note */}
          <Typography
            variant="caption"
            color="text.secondary"
            textAlign="center"
            display="block"
            sx={{ mt: 3 }}
          >
            หากพบปัญหาการเข้าใช้งาน กรุณาติดต่อฝ่าย IT
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
