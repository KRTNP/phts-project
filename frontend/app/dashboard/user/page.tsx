/**
 * PHTS System - User Dashboard
 *
 * Dashboard for general staff (USER role)
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Divider,
} from '@mui/material';
import { Person, RequestPage, Payment, Add } from '@mui/icons-material';
import RequestStatusTable from '@/components/requests/RequestStatusTable';
import { RequestWithDetails } from '@/types/request.types';
import * as requestService from '@/services/requestService';

export default function UserDashboard() {
  const router = useRouter();
  const [requests, setRequests] = useState<RequestWithDetails[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [requestsError, setRequestsError] = useState<string | null>(null);

  // Fetch user's requests on mount
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoadingRequests(true);
        const data = await requestService.getMyRequests();
        setRequests(data);
        setRequestsError(null);
      } catch (error: any) {
        setRequestsError(error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลคำขอ');
      } finally {
        setLoadingRequests(false);
      }
    };

    fetchRequests();
  }, []);

  const handleNewRequest = () => {
    router.push('/dashboard/user/request');
  };

  return (
    <DashboardLayout title="แดชบอร์ดบุคลากร (User Dashboard)">
      <Stack spacing={4}>
        {/* Welcome Header */}
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            ยินดีต้อนรับ
          </Typography>
          <Typography variant="body1" color="text.secondary">
            ระบบจัดการค่าตอบแทนกำลังคนด้านสาธารณสุข (PHTS)
          </Typography>
        </Box>

        {/* Quick Stats */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Person sx={{ fontSize: 40, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    ข้อมูลส่วนตัว
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ดูและจัดการข้อมูล
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <RequestPage sx={{ fontSize: 40, color: 'info.main' }} />
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    คำขอของฉัน
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {requests.length} รายการ
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Payment sx={{ fontSize: 40, color: 'success.main' }} />
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    ประวัติการจ่าย PTS
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ดูประวัติการได้รับเงิน
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        {/* My Requests Section */}
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap={2}
              >
                <Typography variant="h6" fontWeight={600}>
                  คำขอของฉัน
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleNewRequest}
                >
                  ยื่นคำขอใหม่
                </Button>
              </Box>

              <Divider />

              <RequestStatusTable
                requests={requests}
                loading={loadingRequests}
                error={requestsError}
              />
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </DashboardLayout>
  );
}
