/**
 * PHTS System - Finance Officer Dashboard
 */

'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Box, Card, CardContent, Typography, Stack } from '@mui/material';

export default function FinanceDashboard() {
  return (
    <DashboardLayout title="แดชบอร์ดเจ้าหน้าที่การเงิน (Finance Officer)">
      <Stack spacing={4}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            ยินดีต้อนรับ เจ้าหน้าที่การเงิน
          </Typography>
          <Typography variant="body1" color="text.secondary">
            จัดการการเบิกจ่ายและตรวจสอบงบประมาณ
          </Typography>
        </Box>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              สิทธิ์การใช้งาน
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ประมวลผลการจ่ายเงิน ตรวจสอบบัญชี และออกรายงานการเงิน
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </DashboardLayout>
  );
}
