/**
 * PHTS System - HR Head Dashboard
 *
 * Dashboard for HEAD_HR role - Step 3 approver
 */

'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ApproverDashboardContent from '@/components/requests/ApproverDashboard';

export default function HRHeadDashboard() {
  return (
    <DashboardLayout title="แดชบอร์ดหัวหน้าฝ่ายทรัพยากรบุคคล (Head of HR)">
      <ApproverDashboardContent
        title="รายการคำขอรออนุมัติ"
        subtitle="คำขอที่รอการพิจารณาจากหัวหน้าฝ่ายทรัพยากรบุคคล"
        stepNumber={3}
      />
    </DashboardLayout>
  );
}
