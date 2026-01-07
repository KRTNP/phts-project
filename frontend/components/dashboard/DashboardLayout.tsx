/**
 * PHTS System - Dashboard Layout
 * Redesigned for Modern GovTech Look & Feel (Logo Updated: No White Bg, Larger Size)
 */

'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  Container,
  Stack,
  Divider,
  ListItemIcon,
  Badge,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { Logout, KeyboardArrowDown, NotificationsNone, PersonOutline } from '@mui/icons-material';
import Image from 'next/image';
import { AuthService } from '@/lib/api/authApi';
import { UserProfile, ROLE_NAMES } from '@/types/auth';
import { useRouter } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const theme = useTheme();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [hasNotification] = useState(true);

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      router.replace('/login');
      return;
    }
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      router.replace('/login');
      return;
    }
    setUser(currentUser);
  }, [router]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    AuthService.logout();
  };

  if (!user) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      {/* --- Top Navigation Bar --- */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'primary.contrastText',
          zIndex: theme.zIndex.drawer + 1,
          borderBottom: `1px solid ${alpha('#fff', 0.1)}`,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 72 } }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Image
                  src="/logo-uttaradit-hospital.png"
                  alt="Hospital Logo"
                  width={56}
                  height={56}
                  priority
                  style={{
                    objectFit: 'contain',
                    filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.25))',
                  }}
                />
              </Box>

              <Box>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    fontWeight: 800,
                    lineHeight: 1.2,
                    letterSpacing: 0.5,
                    textTransform: 'uppercase',
                    textShadow: '0px 2px 4px rgba(0,0,0,0.2)',
                  }}
                >
                  PHTS System
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    opacity: 0.9,
                    fontWeight: 400,
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  ระบบยื่นคำขอรับเงิน พ.ต.ส.
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={{ xs: 1, md: 2 }} alignItems="center">
              <IconButton color="inherit" sx={{ display: { xs: 'none', sm: 'flex' } }}>
                <Badge variant="dot" color="error" invisible={!hasNotification}>
                  <NotificationsNone />
                </Badge>
              </IconButton>

              <Chip
                label={ROLE_NAMES[user.role] || user.role}
                size="small"
                sx={{
                  backgroundColor: alpha('#fff', 0.15),
                  color: '#fff',
                  fontWeight: 600,
                  backdropFilter: 'blur(6px)',
                  border: `1px solid ${alpha('#fff', 0.2)}`,
                  height: 32,
                  px: 0.5,
                  display: { xs: 'none', md: 'flex' },
                }}
              />

              <Box
                onClick={handleMenuOpen}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  p: 0.5,
                  pr: 1,
                  borderRadius: 50,
                  transition: 'background-color 0.2s',
                  '&:hover': { bgcolor: alpha('#fff', 0.08) },
                }}
              >
                <Avatar
                  sx={{
                    width: 38,
                    height: 38,
                    bgcolor: alpha('#fff', 0.9),
                    color: 'primary.main',
                    mr: { xs: 0, md: 1.5 },
                    border: `2px solid ${alpha('#fff', 0.2)}`,
                  }}
                >
                  {user.first_name ? user.first_name.charAt(0) : <PersonOutline />}
                </Avatar>

                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                  <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.2 }}>
                    {user.first_name} {user.last_name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ opacity: 0.8, display: 'block', lineHeight: 1 }}
                  >
                    {user.position || user.citizen_id}
                  </Typography>
                </Box>

                <KeyboardArrowDown
                  sx={{ ml: 0.5, opacity: 0.7, display: { xs: 'none', md: 'block' } }}
                  fontSize="small"
                />
              </Box>

              <Menu
                id="user-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                      mt: 1.5,
                      borderRadius: 2,
                      minWidth: 200,
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                    },
                  },
                }}
              >
                <MenuItem sx={{ display: { xs: 'block', md: 'none' }, pointerEvents: 'none' }}>
                  <Typography variant="caption" color="text.secondary">
                    สถานะ
                  </Typography>
                  <Typography variant="body2" fontWeight={600} color="primary">
                    {ROLE_NAMES[user.role]}
                  </Typography>
                </MenuItem>

                <Divider sx={{ display: { xs: 'block', md: 'none' } }} />

                <MenuItem onClick={handleMenuClose}>
                  <ListItemIcon>
                    <PersonOutline fontSize="small" />
                  </ListItemIcon>
                  ข้อมูลส่วนตัว
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                  <ListItemIcon>
                    <Logout fontSize="small" color="error" />
                  </ListItemIcon>
                  ออกจากระบบ
                </MenuItem>
              </Menu>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* --- Main Content --- */}
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">{children}</Container>
      </Box>

      {/* --- Footer --- */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2025 PHTS - Public Health Talent System | Uttaradit Hospital
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
