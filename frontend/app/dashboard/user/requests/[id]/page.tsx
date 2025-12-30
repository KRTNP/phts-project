/**
 * PHTS System - Request Detail Page
 *
 * Detailed view of a single request with approval history
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import {
  Stack,
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import {
  ArrowBack,
  CheckCircle,
  Cancel,
  Pending,
  AttachFile,
  Description,
} from '@mui/icons-material';
import { RequestWithDetails, REQUEST_TYPE_LABELS, STEP_LABELS } from '@/types/request.types';
import StatusChip from '@/components/common/StatusChip';
import * as requestService from '@/services/requestService';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

export default function RequestDetailPage() {
  const router = useRouter();
  const params = useParams();
  const requestId = params?.id ? parseInt(params.id as string, 10) : null;

  const [request, setRequest] = useState<RequestWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!requestId || isNaN(requestId)) {
      setError('Invalid request ID');
      setLoading(false);
      return;
    }

    const fetchRequest = async () => {
      try {
        setLoading(true);
        const data = await requestService.getRequestById(requestId);
        setRequest(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลคำขอ');
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [requestId]);

  const formatDate = (date: Date | string | null): string => {
    if (!date) return '-';
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return format(dateObj, 'd MMMM yyyy, HH:mm น.', { locale: th });
    } catch {
      return '-';
    }
  };

  const handleBack = () => {
    router.push('/dashboard/user');
  };

  if (loading) {
    return (
      <DashboardLayout title="รายละเอียดคำขอ">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  if (error || !request) {
    return (
      <DashboardLayout title="รายละเอียดคำขอ">
        <Stack spacing={3}>
          <Alert severity="error">{error || 'ไม่พบข้อมูลคำขอ'}</Alert>
          <Button variant="outlined" startIcon={<ArrowBack />} onClick={handleBack}>
            กลับไปหน้ารายการคำขอ
          </Button>
        </Stack>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="รายละเอียดคำขอ">
      <Stack spacing={3}>
        {/* Back Button */}
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handleBack}
          sx={{ alignSelf: 'flex-start' }}
        >
          กลับ
        </Button>

        {/* Request Header */}
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Box display="flex" justifyContent="space-between" alignItems="start" flexWrap="wrap" gap={2}>
                <Box>
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    คำขอ #{request.request_id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {REQUEST_TYPE_LABELS[request.request_type]}
                  </Typography>
                </Box>
                <StatusChip status={request.status} size="medium" />
              </Box>

              <Divider />

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography variant="caption" color="text.secondary">
                    วันที่ยื่นคำขอ
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {formatDate(request.submitted_at || request.created_at)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography variant="caption" color="text.secondary">
                    ผู้ยื่นคำขอ
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {request.requester?.citizen_id || '-'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography variant="caption" color="text.secondary">
                    ขั้นตอนปัจจุบัน
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {request.status === 'APPROVED'
                      ? 'เสร็จสิ้น'
                      : request.status === 'REJECTED'
                      ? 'ไม่อนุมัติ'
                      : request.status === 'DRAFT'
                      ? 'แบบร่าง'
                      : `ขั้นตอนที่ ${request.current_step}: ${STEP_LABELS[request.current_step] || ''}`}
                  </Typography>
                </Grid>
              </Grid>
            </Stack>
          </CardContent>
        </Card>

        {/* Request Details */}
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              รายละเอียดคำขอ
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {request.submission_data ? (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {request.submission_data.notes || 'ไม่มีรายละเอียดเพิ่มเติม'}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                ไม่มีรายละเอียดเพิ่มเติม
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Attachments */}
        {request.attachments && request.attachments.length > 0 && (
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6" fontWeight={600}>
                  เอกสารแนบ ({request.attachments.length} ไฟล์)
                </Typography>
                <Divider />
                <Stack spacing={1}>
                  {request.attachments.map((file, index) => (
                    <Paper key={index} variant="outlined" sx={{ p: 2 }}>
                      <Box display="flex" alignItems="center" gap={2}>
                        {file.mime_type.startsWith('image/') ? (
                          <AttachFile color="primary" />
                        ) : (
                          <Description color="error" />
                        )}
                        <Box flexGrow={1}>
                          <Typography variant="body2" fontWeight={500}>
                            {file.file_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {(file.file_size / 1024).toFixed(2)} KB
                          </Typography>
                        </Box>
                        <Button size="small" variant="outlined">
                          ดาวน์โหลด
                        </Button>
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Approval History */}
        {request.actions && request.actions.length > 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                ประวัติการดำเนินการ
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Timeline position="alternate">
                {request.actions.map((action, index) => {
                  const isLast = index >= (request.actions?.length ?? 0) - 1;
                  return (
                  <TimelineItem key={action.action_id}>
                    <TimelineOppositeContent color="text.secondary">
                      {formatDate(action.created_at)}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot
                        color={
                          action.action_type === 'APPROVE'
                            ? 'success'
                            : action.action_type === 'REJECT'
                            ? 'error'
                            : action.action_type === 'RETURN'
                            ? 'info'
                            : 'grey'
                        }
                      >
                        {action.action_type === 'APPROVE' ? (
                          <CheckCircle />
                        ) : action.action_type === 'REJECT' ? (
                          <Cancel />
                        ) : (
                          <Pending />
                        )}
                      </TimelineDot>
                      {!isLast && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Paper elevation={2} sx={{ p: 2 }}>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {action.action_type === 'SUBMIT'
                            ? 'ส่งคำขอ'
                            : action.action_type === 'APPROVE'
                            ? 'อนุมัติ'
                            : action.action_type === 'REJECT'
                            ? 'ไม่อนุมัติ'
                            : 'ส่งกลับแก้ไข'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          โดย: {action.actor?.citizen_id || '-'}
                        </Typography>
                        {action.comment && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            หมายเหตุ: {action.comment}
                          </Typography>
                        )}
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                  );
                })}
              </Timeline>
            </CardContent>
          </Card>
        )}
      </Stack>
    </DashboardLayout>
  );
}
