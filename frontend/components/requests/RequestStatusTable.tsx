/**
 * PHTS System - Request Status Table Component
 *
 * Table displaying user's request history with status tracking
 */

'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Skeleton,
  Alert,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import {
  RequestWithDetails,
  REQUEST_TYPE_LABELS,
  STEP_LABELS,
} from '@/types/request.types';
import StatusChip from '@/components/common/StatusChip';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

interface RequestStatusTableProps {
  requests: RequestWithDetails[];
  loading?: boolean;
  error?: string | null;
}

export default function RequestStatusTable({
  requests,
  loading = false,
  error = null,
}: RequestStatusTableProps) {
  const router = useRouter();

  const formatDate = (date: Date | string): string => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return format(dateObj, 'd MMM yyyy HH:mm', { locale: th });
    } catch {
      return '-';
    }
  };

  const getCurrentStepLabel = (request: RequestWithDetails): string => {
    if (request.status === 'DRAFT') return 'แบบร่าง';
    if (request.status === 'APPROVED') return 'เสร็จสิ้น';
    if (request.status === 'REJECTED') return 'ไม่อนุมัติ';
    if (request.status === 'CANCELLED') return 'ยกเลิก';

    const stepLabel = STEP_LABELS[request.current_step] || `ขั้นตอนที่ ${request.current_step}`;
    return `ขั้นตอนที่ ${request.current_step}: ${stepLabel}`;
  };

  const handleRowClick = (requestId: number) => {
    router.push(`/dashboard/user/requests/${requestId}`);
  };

  if (loading) {
    return (
      <TableContainer component={Paper}>
        <Box p={2}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height={60} />
          ))}
        </Box>
      </TableContainer>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (requests.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          ยังไม่มีคำขอในระบบ
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          คลิกปุ่ม "ยื่นคำขอใหม่" เพื่อเริ่มต้น
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="subtitle2" fontWeight={600}>
                วันที่ยื่น
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2" fontWeight={600}>
                ประเภทคำขอ
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2" fontWeight={600}>
                ขั้นตอนปัจจุบัน
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2" fontWeight={600}>
                สถานะ
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((request) => (
            <TableRow
              key={request.request_id}
              hover
              onClick={() => handleRowClick(request.request_id)}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <TableCell>
                <Typography variant="body2">
                  {formatDate(request.submitted_at || request.created_at)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {REQUEST_TYPE_LABELS[request.request_type]}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {getCurrentStepLabel(request)}
                </Typography>
              </TableCell>
              <TableCell>
                <StatusChip status={request.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
