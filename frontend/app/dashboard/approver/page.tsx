/**
 * Approver Dashboard
 */
'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import ApproverDashboard from '@/components/requests/ApproverDashboard';
import ApprovalHistoryList from '@/components/requests/ApprovalHistoryList';
import { Assignment, History } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/api/authApi';
import { ROLE_ROUTES, UserRole } from '@/types/auth';

export default function ApproverPage() {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      router.replace('/login');
      return;
    }
    if (currentUser.role !== UserRole.HEAD_DEPT) {
      router.replace(ROLE_ROUTES[currentUser.role] || '/login');
    }
  }, [router]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <DashboardLayout title="สำหรับผู้อนุมัติ">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          ภาพรวมการอนุมัติ
        </Typography>
        <Typography color="text.secondary">
          จัดการรายการคำขอและตรวจสอบประวัติการดำเนินการ
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange} aria-label="approver tabs">
          <Tab icon={<Assignment />} iconPosition="start" label="รายการรออนุมัติ" />
          <Tab icon={<History />} iconPosition="start" label="ประวัติการดำเนินการ" />
        </Tabs>
      </Box>

      {currentTab === 0 && <ApproverDashboard />}
      {currentTab === 1 && <ApprovalHistoryList />}
    </DashboardLayout>
  );
}
