/**
 * PHTS System - Request Form Component
 *
 * Form for creating new PTS requests with auto-filled user data
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Divider,
  CircularProgress,
  Alert,
  Box,
  Stack,
} from '@mui/material';
import { Send, Cancel } from '@mui/icons-material';
import { RequestType, REQUEST_TYPE_LABELS } from '@/types/request.types';
import FileUploadArea from './FileUploadArea';
import { AuthService } from '@/services/authService';
import { apiClient } from '@/lib/axios';

interface RequestFormProps {
  onSubmit: (requestType: RequestType, submissionData: any, files: File[]) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

interface UserInfo {
  name: string;
  position: string;
  department: string;
  citizenId: string;
  ptsRate?: number;
}

export default function RequestForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
}: RequestFormProps) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [requestType, setRequestType] = useState<RequestType>(RequestType.NEW_ENTRY);
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch user info on mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoadingUser(true);
        const currentUser = AuthService.getCurrentUser();

        if (!currentUser) {
          setError('ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่');
          return;
        }

        // Mock user data - In production, fetch from /api/users/me or similar
        setUserInfo({
          name: 'ผู้ใช้ระบบ',
          position: 'ตำแหน่ง',
          department: 'แผนก',
          citizenId: currentUser.citizen_id,
          ptsRate: 0,
        });
      } catch (err: any) {
        setError(err.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้');
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate
    if (!requestType) {
      setError('กรุณาเลือกประเภทคำขอ');
      return;
    }

    if (notes.trim().length === 0) {
      setError('กรุณากรอกรายละเอียดคำขอ');
      return;
    }

    if (files.length === 0) {
      setError('กรุณาแนบเอกสารอย่างน้อย 1 ไฟล์');
      return;
    }

    try {
      const submissionData = {
        notes: notes.trim(),
        userInfo,
      };

      await onSubmit(requestType, submissionData, files);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการส่งคำขอ');
    }
  };

  const handleReset = () => {
    setRequestType(RequestType.NEW_ENTRY);
    setNotes('');
    setFiles([]);
    setError(null);
  };

  if (loadingUser) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (!userInfo) {
    return (
      <Card>
        <CardContent>
          <Alert severity="error">
            ไม่สามารถโหลดข้อมูลผู้ใช้ได้ กรุณาเข้าสู่ระบบใหม่
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Form Title */}
            <Typography variant="h5" fontWeight={600} color="primary">
              แบบฟอร์มยื่นคำขอรับค่าตอบแทน พ.ต.ส.
            </Typography>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {/* Section 1: User Info (Auto-filled, Read-only) */}
            <Box>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                1. ข้อมูลผู้ยื่นคำขอ
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="เลขบัตรประชาชน"
                    value={userInfo.citizenId}
                    disabled
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="ชื่อ-นามสกุล"
                    value={userInfo.name}
                    disabled
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="ตำแหน่ง"
                    value={userInfo.position}
                    disabled
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="แผนก/หน่วยงาน"
                    value={userInfo.department}
                    disabled
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                {userInfo.ptsRate !== undefined && (
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="อัตรา พ.ต.ส. ปัจจุบัน"
                      value={`${userInfo.ptsRate.toLocaleString()} บาท`}
                      disabled
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                )}
              </Grid>
            </Box>

            <Divider />

            {/* Section 2: Request Type */}
            <Box>
              <FormControl component="fieldset">
                <FormLabel component="legend">
                  <Typography variant="h6" fontWeight={600} color="text.primary">
                    2. ประเภทคำขอ *
                  </Typography>
                </FormLabel>
                <RadioGroup
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value as RequestType)}
                  sx={{ mt: 1 }}
                >
                  <FormControlLabel
                    value={RequestType.NEW_ENTRY}
                    control={<Radio />}
                    label={REQUEST_TYPE_LABELS[RequestType.NEW_ENTRY]}
                  />
                  <FormControlLabel
                    value={RequestType.EDIT_INFO}
                    control={<Radio />}
                    label={REQUEST_TYPE_LABELS[RequestType.EDIT_INFO]}
                  />
                  <FormControlLabel
                    value={RequestType.RATE_CHANGE}
                    control={<Radio />}
                    label={REQUEST_TYPE_LABELS[RequestType.RATE_CHANGE]}
                  />
                </RadioGroup>
              </FormControl>
            </Box>

            <Divider />

            {/* Section 3: Additional Information */}
            <Box>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                3. รายละเอียด / เหตุผลในการยื่นคำขอ *
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="กรุณาระบุรายละเอียดหรือเหตุผลในการยื่นคำขอ..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isSubmitting}
              />
            </Box>

            <Divider />

            {/* Section 4: File Upload */}
            <Box>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                4. เอกสารแนบ *
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                แนบเอกสารประกอบคำขอ เช่น ใบประกอบวิชาชีพ, ใบปริญญา, คำสั่ง, ฯลฯ
              </Typography>
              <FileUploadArea
                files={files}
                onChange={setFiles}
                maxFiles={5}
                maxSizeMB={5}
              />
            </Box>

            {/* Action Buttons */}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              {onCancel && (
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  ยกเลิก
                </Button>
              )}
              <Button
                variant="outlined"
                onClick={handleReset}
                disabled={isSubmitting}
              >
                ล้างฟอร์ม
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={isSubmitting ? <CircularProgress size={20} /> : <Send />}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'กำลังส่งคำขอ...' : 'ส่งคำขอ'}
              </Button>
            </Stack>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
}
