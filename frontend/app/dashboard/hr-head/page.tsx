/**
 * PHTS System - HR Head Dashboard
 */

'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Box, Card, CardContent, Typography, Stack } from '@mui/material';

export default function HRHeadDashboard() {
  return (
    <DashboardLayout title="แดชบอร์ดหัวหน้าฝ่ายทรัพยากรบุคคล (Head of HR)">
      <Stack spacing={4}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            ยินดีต้อนรับ หัวหน้าฝ่าย HR
          </Typography>
          <Typography variant="body1" color="text.secondary">
            บริหารจัดการทรัพยากรบุคคลและอนุมัติข้อมูล
          </Typography>
        </Box>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              สิทธิ์การใช้งาน
            </Typography>
            <Typography variant="body2" color="text.secondary">
              อนุมัติคำขอ จัดการข้อมูลบุคลากร และดูรายงานภาพรวม
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </DashboardLayout>
  );
}
