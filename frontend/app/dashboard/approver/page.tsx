/**
 * PHTS System - Department Head Dashboard
 *
 * Dashboard for department heads (HEAD_DEPT role)
 */

'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Box, Card, CardContent, Typography, Stack } from '@mui/material';
import { AssignmentTurnedIn, PendingActions, People } from '@mui/icons-material';

export default function ApproverDashboard() {
  return (
    <DashboardLayout title="แดชบอร์ดหัวหน้าแผนก (Head of Department)">
      <Stack spacing={4}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            ยินดีต้อนรับ หัวหน้าแผนก
          </Typography>
          <Typography variant="body1" color="text.secondary">
            จัดการและอนุมัติคำขอของบุคลากรในแผนก
          </Typography>
        </Box>

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
                <PendingActions sx={{ fontSize: 40, color: 'warning.main' }} />
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    รออนุมัติ
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    คำขอที่รอการพิจารณา
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <AssignmentTurnedIn sx={{ fontSize: 40, color: 'success.main' }} />
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    อนุมัติแล้ว
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    คำขอที่ผ่านการอนุมัติ
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <People sx={{ fontSize: 40, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    บุคลากรในแผนก
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    จัดการข้อมูลบุคลากร
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              สิทธิ์การใช้งาน
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ในฐานะหัวหน้าแผนก คุณสามารถอนุมัติคำขอของบุคลากรในแผนกได้
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </DashboardLayout>
  );
}
