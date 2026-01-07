/**
 * PTS Officer Dashboard
 * Multi-tab dashboard with approval review and payroll management
 */
'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import ApproverDashboard from '@/components/requests/ApproverDashboard';
import ApprovalHistoryList from '@/components/requests/ApprovalHistoryList';
import PayrollManager from '@/components/payroll/PayrollManager';
import { VerifiedUser, Paid, History } from '@mui/icons-material';

export default function OfficerDashboard() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <DashboardLayout title="สำหรับเจ้าหน้าที่ พ.ต.ส.">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          แดชบอร์ดเจ้าหน้าที่ พ.ต.ส.
        </Typography>
        <Typography color="text.secondary">
          ตรวจสอบความถูกต้องของคำขอ และบริหารจัดการงวดเดือน (Step 2)
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange} aria-label="officer tabs">
          <Tab icon={<VerifiedUser />} iconPosition="start" label="รายการรอตรวจสอบ" />
          <Tab icon={<Paid />} iconPosition="start" label="จัดการงวดเดือน" />
          <Tab icon={<History />} iconPosition="start" label="ประวัติการดำเนินการ" />
        </Tabs>
      </Box>

      {currentTab === 0 && <ApproverDashboard />}
      {currentTab === 1 && <PayrollManager />}
      {currentTab === 2 && <ApprovalHistoryList />}
    </DashboardLayout>
  );
}
