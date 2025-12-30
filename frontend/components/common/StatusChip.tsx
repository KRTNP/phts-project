/**
 * PHTS System - Status Chip Component
 *
 * Reusable status chip with color-coding for request statuses
 */

'use client';

import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import { RequestStatus, REQUEST_STATUS_LABELS } from '@/types/request.types';

interface StatusChipProps {
  status: RequestStatus;
  size?: ChipProps['size'];
}

/**
 * Status color mapping
 */
const STATUS_COLOR_MAP: Record<
  RequestStatus,
  ChipProps['color']
> = {
  [RequestStatus.DRAFT]: 'default',
  [RequestStatus.PENDING]: 'warning',
  [RequestStatus.APPROVED]: 'success',
  [RequestStatus.REJECTED]: 'error',
  [RequestStatus.CANCELLED]: 'default',
  [RequestStatus.RETURNED]: 'info',
};

export default function StatusChip({ status, size = 'small' }: StatusChipProps) {
  const color = STATUS_COLOR_MAP[status];
  const label = REQUEST_STATUS_LABELS[status];

  return (
    <Chip
      label={label}
      color={color}
      size={size}
      sx={{
        fontWeight: 500,
        ...(color === 'default' && {
          backgroundColor: '#9e9e9e',
          color: 'white',
        }),
      }}
    />
  );
}
