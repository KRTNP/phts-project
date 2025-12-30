/**
 * PHTS System - Admin Dashboard
 */

'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Box, Card, CardContent, Typography, Stack } from '@mui/material';

export default function AdminDashboard() {
  return (
    <DashboardLayout title="แดชบอร์ดผู้ดูแลระบบ (System Administrator)">
      <Stack spacing={4}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            ยินดีต้อนรับ ผู้ดูแลระบบ
          </Typography>
          <Typography variant="body1" color="text.secondary">
            จัดการระบบและสิทธิ์การใช้งานทั้งหมด
          </Typography>
        </Box>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              สิทธิ์การใช้งาน
            </Typography>
            <Typography variant="body2" color="text.secondary">
              เข้าถึงทุกส่วนของระบบ จัดการผู้ใช้ กำหนดสิทธิ์ และดูแลระบบ
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </DashboardLayout>
  );
}
