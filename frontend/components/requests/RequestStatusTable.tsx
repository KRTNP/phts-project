/**
 * PHTS System - Request Status Table (Responsive)
 *
 * Desktop: table view
 * Mobile/Tablet: card list view for readability
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
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
  Stack,
  Divider,
  CardActionArea,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  Description as DocIcon,
  CalendarToday as DateIcon,
  ChevronRight as ArrowIcon,
} from '@mui/icons-material';
import { RequestWithDetails, REQUEST_TYPE_LABELS, STEP_LABELS } from '@/types/request.types';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const formatDate = (date: Date | string) => {
    try {
      const d = typeof date === 'string' ? new Date(date) : date;
      return format(d, 'd MMM yy', { locale: th });
    } catch {
      return '-';
    }
  };

  const getStepLabel = (req: RequestWithDetails) => {
    if (req.status === 'DRAFT') return 'แบบร่าง';
    if (req.status === 'APPROVED') return 'อนุมัติแล้ว';
    if (req.status === 'REJECTED') return 'ถูกปฏิเสธ';
    return `ขั้นที่ ${req.current_step}: ${STEP_LABELS[req.current_step] || ''}`;
  };

  const handleRowClick = (id: number) => router.push(`/dashboard/user/requests/${id}`);

  // Loading / error / empty states
  if (loading) {
    return (
      <Box p={2}>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} height={isMobile ? 84 : 50} />
        ))}
      </Box>
    );
  }

  if (error) return <Alert severity="error">{error}</Alert>;

  if (requests.length === 0) {
    return (
      <Box p={4} textAlign="center">
        <Typography variant="body1" color="text.secondary">
          ไม่พบรายการคำขอ
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          กด "ยื่นคำขอใหม่" เพื่อเริ่มต้น
        </Typography>
      </Box>
    );
  }

  // Mobile / Tablet: Card List
  if (isMobile) {
    return (
      <Stack spacing={0} divider={<Divider />}>
        {requests.map((req) => (
          <CardActionArea key={req.request_id} onClick={() => handleRowClick(req.request_id)}>
            <Box sx={{ p: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {REQUEST_TYPE_LABELS[req.request_type]}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                  >
                    <DateIcon sx={{ fontSize: 14 }} /> {formatDate(req.submitted_at || req.created_at)}
                  </Typography>
                </Box>
                <StatusChip status={req.status} size="small" />
              </Stack>

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: '80%' }}>
                  {getStepLabel(req)}
                </Typography>
                <ArrowIcon color="action" fontSize="small" />
              </Stack>
            </Box>
          </CardActionArea>
        ))}
      </Stack>
    );
  }

  // Desktop: Table
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ bgcolor: 'grey.50' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>ประเภทคำขอ</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>วันที่ยื่น</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>ขั้นตอนปัจจุบัน</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>สถานะ</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((req) => (
            <TableRow
              key={req.request_id}
              hover
              onClick={() => handleRowClick(req.request_id)}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      p: 0.5,
                      borderRadius: 1,
                      bgcolor: 'primary.50',
                      color: 'primary.main',
                      display: 'flex',
                    }}
                  >
                    <DocIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {REQUEST_TYPE_LABELS[req.request_type]}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      #{req.request_id}
                    </Typography>
                  </Box>
                </Stack>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{formatDate(req.submitted_at || req.created_at)}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {getStepLabel(req)}
                </Typography>
              </TableCell>
              <TableCell>
                <StatusChip status={req.status} size="small" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
