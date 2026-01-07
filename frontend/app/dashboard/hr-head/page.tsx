/**
 * PHTS System - HR Head Dashboard
 *
 * Dashboard for HEAD_HR role - Step 3 approver
 */

'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import ApproverDashboard from '@/components/requests/ApproverDashboard';
import ApprovalHistoryList from '@/components/requests/ApprovalHistoryList';
import { Assignment, History } from '@mui/icons-material';

export default function HRHeadDashboard() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <DashboardLayout title="สำหรับหัวหน้าฝ่ายทรัพยากรบุคคล">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          แผงควบคุมหัวหน้า HR
        </Typography>
        <Typography color="text.secondary">
          ตรวจสอบและอนุมัติคำขอรับเงิน พ.ต.ส. (Step 3)
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange} aria-label="hr head tabs">
          <Tab icon={<Assignment />} iconPosition="start" label="รายการรออนุมัติ" />
          <Tab icon={<History />} iconPosition="start" label="ประวัติการอนุมัติ" />
        </Tabs>
      </Box>

      {currentTab === 0 && (
        <ApproverDashboard allowBatch={true} />
      )}

      {currentTab === 1 && <ApprovalHistoryList />}
    </DashboardLayout>
  );
}
