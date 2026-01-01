/**
 * PHTS System - Reusable Approver Dashboard Component
 *
 * Shared component for all approver roles
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Stack,
  Typography,
  Card,
  CardContent,
  Snackbar,
  Alert,
  Box,
  Chip,
} from '@mui/material';
import { Assignment } from '@mui/icons-material';
import ApprovalList from './ApprovalList';
import { RequestWithDetails } from '@/types/request.types';
import * as requestApi from '@/lib/api/requestApi';

interface ApproverDashboardContentProps {
  title: string;
  subtitle: string;
  stepNumber: number;
}

export default function ApproverDashboardContent({
  title,
  subtitle,
  stepNumber,
}: ApproverDashboardContentProps) {
  const [requests, setRequests] = useState<RequestWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const data = await requestApi.getPendingRequests();
      setRequests(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const handleApprove = async (requestId: number, comment?: string) => {
    try {
      await requestApi.approveRequest(requestId, comment);
      setToast({
        open: true,
        message: 'อนุมัติคำขอสำเร็จ',
        severity: 'success',
      });
      await fetchPendingRequests();
    } catch (err: any) {
      throw new Error(err.message || 'เกิดข้อผิดพลาดในการอนุมัติคำขอ');
    }
  };

  const handleReject = async (requestId: number, comment: string) => {
    try {
      await requestApi.rejectRequest(requestId, comment);
      setToast({
        open: true,
        message: 'ปฏิเสธคำขอสำเร็จ',
        severity: 'success',
      });
      await fetchPendingRequests();
    } catch (err: any) {
      throw new Error(err.message || 'เกิดข้อผิดพลาดในการปฏิเสธคำขอ');
    }
  };

  const handleReturn = async (requestId: number, comment: string) => {
    try {
      await requestApi.returnRequest(requestId, comment);
      setToast({
        open: true,
        message: 'ส่งคำขอกลับสำเร็จ',
        severity: 'success',
      });
      await fetchPendingRequests();
    } catch (err: any) {
      throw new Error(err.message || 'เกิดข้อผิดพลาดในการส่งคำขอกลับ');
    }
  };

  return (
    <>
      <Stack spacing={4}>
        {/* Header */}
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {subtitle} (ขั้นตอนที่ {stepNumber})
          </Typography>
        </Box>

        {/* Stats Card */}
        <Card>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Assignment sx={{ fontSize: 40, color: 'warning.main' }} />
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  คำขอรอดำเนินการ
                </Typography>
                <Box mt={1}>
                  <Chip
                    label={`${requests.length} รายการ`}
                    color="warning"
                    size="small"
                  />
                </Box>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Approval List */}
        <ApprovalList
          requests={requests}
          loading={loading}
          error={error}
          onApprove={handleApprove}
          onReject={handleReject}
          onReturn={handleReturn}
          onRefresh={fetchPendingRequests}
        />
      </Stack>

      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          variant="filled"
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}
