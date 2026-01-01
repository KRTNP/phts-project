/**
 * PHTS System - User Dashboard
 *
 * Dashboard for general staff (USER role)
 */

'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Container,
  Paper,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  Add as AddIcon,
  Article as ArticleIcon,
  CheckCircle as CheckCircleIcon,
  PendingActions as PendingIcon,
} from '@mui/icons-material';
import RequestStatusTable from '@/components/requests/RequestStatusTable';
import { RequestStatus, RequestWithDetails } from '@/types/request.types';
import * as requestApi from '@/lib/api/requestApi';
import { AuthService } from '@/lib/api/authApi';

type StatCardProps = {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
};

// การ์ดสถิติแบบเรียบหรู (Enterprise Style)
const StatCard = ({ title, value, icon, color, onClick }: StatCardProps) => (
  <Card
    onClick={onClick}
    sx={{
      height: '100%',
      cursor: onClick ? 'pointer' : 'default',
      borderLeft: `5px solid ${color}`,
      borderRadius: 2,
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      transition: 'all 0.2s ease-in-out',
      '&:hover': onClick
        ? {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          }
        : {},
    }}
  >
    <CardContent>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="body2" color="text.secondary" fontWeight={500} gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight={600} color="text.primary">
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            p: 1,
            borderRadius: 1,
            bgcolor: `${color}15`,
            color: color,
            display: 'flex',
          }}
        >
          {icon}
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

export default function UserDashboard() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [requests, setRequests] = useState<RequestWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const user = AuthService.getCurrentUser() as {
          first_name?: string;
          last_name?: string;
        } | null;
        if (user) {
          const first = user.first_name || '';
          const last = user.last_name || '';
          const displayName = `${first} ${last}`.trim();
          setUserName(displayName || 'บุคลากร');
        }

        const data = await requestApi.getMyRequests();
        setRequests(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNewRequest = () => router.push('/dashboard/user/request');

  const stats = useMemo(
    () => ({
      total: requests.length,
      pending: requests.filter(
        (r) => r.status === RequestStatus.PENDING || r.status === RequestStatus.DRAFT
      ).length,
      approved: requests.filter((r) => r.status === RequestStatus.APPROVED).length,
    }),
    [requests]
  );

  return (
    <DashboardLayout title="">
      <Container maxWidth="lg" disableGutters={isMobile}>
        <Stack spacing={3} sx={{ mt: isMobile ? 1 : 2 }}>
          {/* Header Section */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'stretch', sm: 'center' },
              gap: 2,
              mb: 1,
            }}
          >
            <Box>
              <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight={600} color="primary.main">
                สวัสดี, คุณ{userName || 'บุคลากร'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ระบบบริหารจัดการค่าตอบแทน (PHTS)
              </Typography>
            </Box>

            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={handleNewRequest}
              fullWidth={isMobile}
              sx={{
                borderRadius: 2,
                boxShadow: 'none',
                height: 48,
              }}
            >
              ยื่นคำขอใหม่
            </Button>
          </Box>

          {/* Stats Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' },
              gap: 2,
            }}
          >
            <Box sx={{ gridColumn: { xs: '1 / -1', sm: 'span 1' } }}>
              <StatCard
                title="คำขอทั้งหมด"
                value={loading ? '...' : stats.total}
                icon={<ArticleIcon />}
                color={theme.palette.info.main}
              />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 1' } }}>
              <StatCard
                title="รอดำเนินการ"
                value={loading ? '...' : stats.pending}
                icon={<PendingIcon />}
                color={theme.palette.warning.main}
              />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 1' } }}>
              <StatCard
                title="อนุมัติแล้ว"
                value={loading ? '...' : stats.approved}
                icon={<CheckCircleIcon />}
                color={theme.palette.success.main}
              />
            </Box>
          </Box>

          {/* Table Section */}
          <Paper
            variant="outlined"
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
              borderColor: theme.palette.divider,
            }}
          >
            <Box
              sx={{
                p: 2,
                bgcolor: isMobile ? 'transparent' : 'grey.50',
                borderBottom: 1,
                borderColor: 'divider',
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                รายการล่าสุด
              </Typography>
            </Box>

            <RequestStatusTable requests={requests} loading={loading} />
          </Paper>
        </Stack>
      </Container>
    </DashboardLayout>
  );
}
