/**
 * PHTS System - User Dashboard
 *
 * Dashboard for general staff (USER role)
 */

'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Box, Card, CardContent, Typography, Stack } from '@mui/material';
import { Person, RequestPage, Payment } from '@mui/icons-material';

export default function UserDashboard() {
  return (
    <DashboardLayout title="แดชบอร์ดบุคลากร (User Dashboard)">
      <Stack spacing={4}>
        {/* Welcome Header */}
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            ยินดีต้อนรับ
          </Typography>
          <Typography variant="body1" color="text.secondary">
            ระบบจัดการค่าตอบแทนกำลังคนด้านสาธารณสุข (PHTS)
          </Typography>
        </Box>

        {/* Quick Stats */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Person sx={{ fontSize: 40, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    ข้อมูลส่วนตัว
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ดูและจัดการข้อมูล
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <RequestPage sx={{ fontSize: 40, color: 'info.main' }} />
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    คำขอของฉัน
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ติดตามสถานะคำขอ
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Payment sx={{ fontSize: 40, color: 'success.main' }} />
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    ประวัติการจ่าย PTS
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ดูประวัติการได้รับเงิน
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        {/* Main Content */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              การใช้งานระบบ
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              หน้าจอนี้เป็นหน้าแดชบอร์ดสำหรับบุคลากรทั่วไป
              คุณสามารถดูข้อมูลส่วนตัว ยื่นคำขอ และติดตามสถานะได้จากเมนูด้านบน
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ระบบจะพัฒนาเพิ่มเติมในเฟสถัดไป
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </DashboardLayout>
  );
}
