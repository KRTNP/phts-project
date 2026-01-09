'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import ApproverDashboard from '@/components/requests/ApproverDashboard';
import ApprovalHistoryList from '@/components/requests/ApprovalHistoryList';
import { Payments, History } from '@mui/icons-material';
import PayrollApprovalPanel from '@/components/payroll/PayrollApprovalPanel';
import * as payrollApi from '@/lib/api/payrollApi';

export default function HeadFinancePage() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <DashboardLayout title="สำหรับหัวหน้ากลุ่มงานการเงิน">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          อนุมัติการจ่ายเงิน (Head of Finance)
        </Typography>
        <Typography color="text.secondary">
          ตรวจสอบความถูกต้องของยอดเงินและอนุมัติรายการคำขอ (Step 4)
        </Typography>
      </Box>

      <PayrollApprovalPanel
        requiredStatus="WAITING_HEAD_FINANCE"
        title="Payroll Approval (Head Finance)"
        approveLabel="Approve Period (Head Finance)"
        onApprove={payrollApi.approvePeriodByHeadFinance}
        onReject={payrollApi.rejectPeriod}
      />

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange} aria-label="finance head tabs">
          <Tab icon={<Payments />} iconPosition="start" label="รายการรอตรวจสอบ" />
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
