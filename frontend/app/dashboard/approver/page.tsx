/**
 * Approver Dashboard
 */
'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import ApproverDashboard from '@/components/requests/ApproverDashboard';
import ApprovalHistoryList from '@/components/requests/ApprovalHistoryList';
import { Assignment, History } from '@mui/icons-material';

export default function ApproverPage() {
  const [currentTab, setCurrentTab] = useState(0);

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
