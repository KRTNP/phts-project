/**
 * PHTS System - PTS Officer Dashboard
 */

'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Box, Card, CardContent, Typography, Stack } from '@mui/material';

export default function OfficerDashboard() {
  return (
    <DashboardLayout title="แดชบอร์ดเจ้าหน้าที่ PTS (PTS Officer)">
      <Stack spacing={4}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            ยินดีต้อนรับ เจ้าหน้าที่ PTS
          </Typography>
          <Typography variant="body1" color="text.secondary">
            จัดการข้อมูล PTS และประมวลผลการจ่ายเงิน
          </Typography>
        </Box>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              สิทธิ์การใช้งาน
            </Typography>
            <Typography variant="body2" color="text.secondary">
              จัดการข้อมูลการจ่าย PTS, คำนวณอัตรา, และออกรายงาน
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </DashboardLayout>
  );
}
