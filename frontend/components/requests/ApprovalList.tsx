/**
 * PHTS System - Approval List Component
 *
 * Table displaying pending requests for approvers with action buttons
 */

'use client';

import React, { useState } from 'react';
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
  Button,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Undo,
  Visibility,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import {
  RequestWithDetails,
  REQUEST_TYPE_LABELS,
} from '@/types/request.types';
import StatusChip from '@/components/common/StatusChip';
import ApprovalDialog, { ApprovalAction } from './ApprovalDialog';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

interface ApprovalListProps {
  requests: RequestWithDetails[];
  loading?: boolean;
  error?: string | null;
  onApprove: (requestId: number, comment?: string) => Promise<void>;
  onReject: (requestId: number, comment: string) => Promise<void>;
  onReturn: (requestId: number, comment: string) => Promise<void>;
  onRefresh?: () => void;
}

export default function ApprovalList({
  requests,
  loading = false,
  error = null,
  onApprove,
  onReject,
  onReturn,
  onRefresh,
}: ApprovalListProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RequestWithDetails | null>(null);
  const [currentAction, setCurrentAction] = useState<ApprovalAction>('approve');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (date: Date | string): string => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return format(dateObj, 'd MMM yyyy', { locale: th });
    } catch {
      return '-';
    }
  };

  const handleOpenDialog = (request: RequestWithDetails, action: ApprovalAction) => {
    setSelectedRequest(request);
    setCurrentAction(action);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    if (!isSubmitting) {
      setDialogOpen(false);
      setSelectedRequest(null);
    }
  };

  const handleConfirm = async (comment: string) => {
    if (!selectedRequest) return;

    setIsSubmitting(true);
    try {
      switch (currentAction) {
        case 'approve':
          await onApprove(selectedRequest.request_id, comment || undefined);
          break;
        case 'reject':
          await onReject(selectedRequest.request_id, comment);
          break;
        case 'return':
          await onReturn(selectedRequest.request_id, comment);
          break;
      }

      // Close dialog and refresh
      handleCloseDialog();
      if (onRefresh) {
        onRefresh();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewDetails = (requestId: number) => {
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
          ไม่มีคำขอรออนุมัติในขณะนี้
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          คำขอที่รอการอนุมัติจะแสดงที่นี่
        </Typography>
      </Paper>
    );
  }

  return (
    <>
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
                  ผู้ยื่นคำขอ
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  ประเภท
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  สถานะ
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2" fontWeight={600}>
                  การดำเนินการ
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.request_id} hover>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(request.submitted_at || request.created_at)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {request.requester?.citizen_id || '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {REQUEST_TYPE_LABELS[request.request_type]}
                  </Typography>
                </TableCell>
                <TableCell>
                  <StatusChip status={request.status} />
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Tooltip title="ดูรายละเอียด">
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(request.request_id)}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="อนุมัติ">
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => handleOpenDialog(request, 'approve')}
                      >
                        <CheckCircle fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="ไม่อนุมัติ">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleOpenDialog(request, 'reject')}
                      >
                        <Cancel fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="ส่งกลับแก้ไข">
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => handleOpenDialog(request, 'return')}
                      >
                        <Undo fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Approval Dialog */}
      <ApprovalDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        request={selectedRequest}
        action={currentAction}
        onConfirm={handleConfirm}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
