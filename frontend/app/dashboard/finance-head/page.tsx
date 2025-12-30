/**
 * PHTS System - Finance Head Dashboard
 */

'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Box, Card, CardContent, Typography, Stack } from '@mui/material';

export default function FinanceHeadDashboard() {
  return (
    <DashboardLayout title="แดชบอร์ดหัวหน้าฝ่ายการเงิน (Head of Finance)">
      <Stack spacing={4}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            ยินดีต้อนรับ หัวหน้าฝ่ายการเงิน
          </Typography>
          <Typography variant="body1" color="text.secondary">
            อนุมัติงบประมาณและดูรายงานการเงิน
          </Typography>
        </Box>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              สิทธิ์การใช้งาน
            </Typography>
            <Typography variant="body2" color="text.secondary">
              อนุมัติการเบิกจ่าย จัดการงบประมาณ และดูรายงานภาพรวมการเงิน
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </DashboardLayout>
  );
}
