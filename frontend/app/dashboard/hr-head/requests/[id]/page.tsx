import DashboardLayout from '@/components/dashboard/DashboardLayout';
import RequestApprovalDetail from '@/components/requests/RequestApprovalDetail';
import { UserRole } from '@/types/auth';

export default function HRHeadRequestDetailPage() {
  return (
    <DashboardLayout title="ตรวจสอบคำขอ">
      <RequestApprovalDetail
        requiredRole={UserRole.HEAD_HR}
        backPath="/dashboard/hr-head"
        pageTitle="ตรวจสอบคำขอ"
      />
    </DashboardLayout>
  );
}
