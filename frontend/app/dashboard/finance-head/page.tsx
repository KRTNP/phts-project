/**
 * PHTS System - Finance Head Dashboard
 *
 * Dashboard for HEAD_FINANCE role - Step 5 approver
 */

'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ApproverDashboardContent from '@/components/requests/ApproverDashboard';

export default function FinanceHeadDashboard() {
  return (
    <DashboardLayout title="แดชบอร์ดหัวหน้าฝ่ายการเงิน (Head of Finance)">
      <ApproverDashboardContent
        title="รายการคำขอรออนุมัติ"
        subtitle="คำขอที่รอการพิจารณาจากหัวหน้าฝ่ายการเงิน"
        stepNumber={5}
      />
    </DashboardLayout>
  );
}
