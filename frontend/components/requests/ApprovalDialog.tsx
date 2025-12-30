/**
 * PHTS System - Approval Dialog Component
 *
 * Dialog for approving, rejecting, or returning requests
 */

'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Stack,
  Alert,
  CircularProgress,
  Box,
  Divider,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Undo,
} from '@mui/icons-material';
import {
  RequestWithDetails,
  REQUEST_TYPE_LABELS,
} from '@/types/request.types';
import StatusChip from '@/components/common/StatusChip';

export type ApprovalAction = 'approve' | 'reject' | 'return';

interface ApprovalDialogProps {
  open: boolean;
  onClose: () => void;
  request: RequestWithDetails | null;
  action: ApprovalAction;
  onConfirm: (comment: string) => Promise<void>;
  isSubmitting?: boolean;
}

const ACTION_CONFIG = {
  approve: {
    title: 'ยืนยันการอนุมัติคำขอ',
    buttonLabel: 'อนุมัติ',
    buttonColor: 'success' as const,
    icon: <CheckCircle />,
    commentRequired: false,
    commentLabel: 'หมายเหตุ (ถ้ามี)',
  },
  reject: {
    title: 'ยืนยันการไม่อนุมัติคำขอ',
    buttonLabel: 'ไม่อนุมัติ',
    buttonColor: 'error' as const,
    icon: <Cancel />,
    commentRequired: true,
    commentLabel: 'เหตุผลในการไม่อนุมัติ *',
  },
  return: {
    title: 'ยืนยันการส่งกลับคำขอ',
    buttonLabel: 'ส่งกลับ',
    buttonColor: 'info' as const,
    icon: <Undo />,
    commentRequired: true,
    commentLabel: 'เหตุผลในการส่งกลับแก้ไข *',
  },
};

export default function ApprovalDialog({
  open,
  onClose,
  request,
  action,
  onConfirm,
  isSubmitting = false,
}: ApprovalDialogProps) {
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);

  const config = ACTION_CONFIG[action];

  const handleClose = () => {
    if (!isSubmitting) {
      setComment('');
      setError(null);
      onClose();
    }
  };

  const handleConfirm = async () => {
    setError(null);

    // Validate required comment
    if (config.commentRequired && comment.trim().length === 0) {
      setError('กรุณากรอกเหตุผล');
      return;
    }

    try {
      await onConfirm(comment.trim());
      setComment('');
      setError(null);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาด');
    }
  };

  if (!request) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={isSubmitting}
    >
      <DialogTitle>
        <Stack direction="row" spacing={1} alignItems="center">
          {config.icon}
          <Typography variant="h6" fontWeight={600}>
            {config.title}
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          {/* Request Summary */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              รายละเอียดคำขอ
            </Typography>
            <Stack spacing={1}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">เลขที่คำขอ:</Typography>
                <Typography variant="body2" fontWeight={600}>
                  #{request.request_id}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">ประเภท:</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {REQUEST_TYPE_LABELS[request.request_type]}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">สถานะปัจจุบัน:</Typography>
                <StatusChip status={request.status} />
              </Box>
              {request.requester && (
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">ผู้ยื่นคำขอ:</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {request.requester.citizen_id}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Box>

          <Divider />

          {/* Error Alert */}
          {error && <Alert severity="error">{error}</Alert>}

          {/* Comment Field */}
          <TextField
            fullWidth
            multiline
            rows={4}
            label={config.commentLabel}
            placeholder={
              config.commentRequired
                ? 'กรุณาระบุเหตุผล...'
                : 'หมายเหตุเพิ่มเติม (ถ้ามี)...'
            }
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isSubmitting}
            required={config.commentRequired}
            error={config.commentRequired && error !== null}
          />

          {/* Warning for destructive actions */}
          {(action === 'reject' || action === 'return') && (
            <Alert severity="warning">
              การดำเนินการนี้จะส่งผลต่อสถานะของคำขอ กรุณาตรวจสอบให้แน่ใจก่อนยืนยัน
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleClose}
          disabled={isSubmitting}
          variant="outlined"
        >
          ยกเลิก
        </Button>
        <Button
          onClick={handleConfirm}
          color={config.buttonColor}
          variant="contained"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : config.icon}
        >
          {isSubmitting ? 'กำลังดำเนินการ...' : config.buttonLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
