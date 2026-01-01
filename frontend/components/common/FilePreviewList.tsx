/**
 * FilePreviewList
 *
 * Reusable list with preview/remove actions for File objects.
 */
'use client';

import React, { useEffect, useState } from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { Visibility, InsertDriveFile, DeleteOutline } from '@mui/icons-material';

interface FilePreviewListProps {
  files: File[];
  onPreview?: (file: File) => void;
  onRemove?: (index: number) => void;
}

export default function FilePreviewList({ files, onPreview, onRemove }: FilePreviewListProps) {
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handlePreview = (file: File) => {
    if (onPreview) {
      onPreview(file);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewFile(file);
    setPreviewUrl(url);
  };

  const handleClose = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewFile(null);
    setPreviewUrl(null);
  };

  const renderPreviewContent = () => {
    if (!previewFile || !previewUrl) return null;
    if (previewFile.type.startsWith('image/')) {
      return (
        <Box
          component="img"
          src={previewUrl}
          alt={previewFile.name}
          sx={{ maxWidth: '100%', height: 'auto', borderRadius: 1 }}
        />
      );
    }
    if (previewFile.type === 'application/pdf') {
      return (
        <Box
          component="object"
          data={previewUrl}
          type="application/pdf"
          sx={{ width: '100%', height: { xs: 360, md: 520 }, borderRadius: 1 }}
        >
          <Typography variant="body2" color="text.secondary">
            ไม่สามารถแสดงตัวอย่าง PDF ได้ โปรดกด "เปิดไฟล์ในแท็บใหม่"
          </Typography>
        </Box>
      );
    }
    return (
      <Typography variant="body2" color="text.secondary">
        ไม่รองรับพรีวิวไฟล์ประเภทนี้ โปรดกด "เปิดไฟล์ในแท็บใหม่"
      </Typography>
    );
  };

  if (!files.length) return null;

  return (
    <>
      <List dense sx={{ mt: 1 }}>
        {files.map((file, index) => (
          <ListItem key={index} divider sx={{ bgcolor: 'grey.50', borderRadius: 1, mb: 0.5 }}>
            <ListItemIcon>
              <InsertDriveFile color="primary" />
            </ListItemIcon>
            <ListItemText
              primary={file.name}
              secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
              primaryTypographyProps={{ noWrap: true }}
            />
            <ListItemSecondaryAction>
              <Tooltip title="ดูไฟล์">
                <IconButton edge="end" onClick={() => handlePreview(file)} sx={{ mr: onRemove ? 1 : 0 }}>
                  <Visibility />
                </IconButton>
              </Tooltip>
              {onRemove && (
                <Tooltip title="ลบ">
                  <IconButton edge="end" color="error" onClick={() => onRemove(index)}>
                    <DeleteOutline />
                  </IconButton>
                </Tooltip>
              )}
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog open={Boolean(previewFile)} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>{previewFile?.name || 'ตัวอย่างไฟล์'}</DialogTitle>
        <DialogContent dividers>{renderPreviewContent()}</DialogContent>
        <DialogActions>
          {previewUrl && (
            <Button onClick={() => window.open(previewUrl, '_blank')} startIcon={<Visibility />}>
              เปิดไฟล์ในแท็บใหม่
            </Button>
          )}
          <Button onClick={handleClose}>ปิด</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
