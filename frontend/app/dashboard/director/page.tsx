/**
 * PHTS System - Director Dashboard
 */

'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Box, Card, CardContent, Typography, Stack } from '@mui/material';

export default function DirectorDashboard() {
  return (
    <DashboardLayout title="แดชบอร์ดผู้อำนวยการโรงพยาบาล (Hospital Director)">
      <Stack spacing={4}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            ยินดีต้อนรับ ผู้อำนวยการโรงพยาบาล
          </Typography>
          <Typography variant="body1" color="text.secondary">
            ดูภาพรวมและอนุมัติคำขอระดับสูง
          </Typography>
        </Box>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              สิทธิ์การใช้งาน
            </Typography>
            <Typography variant="body2" color="text.secondary">
              อนุมัติคำขอสำคัญ ดูรายงานภาพรวมทั้งหมด และจัดการนโยบาย
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </DashboardLayout>
  );
}
