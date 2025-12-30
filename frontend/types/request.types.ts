/**
 * PHTS System - Request Management Types (Frontend)
 *
 * Type definitions for PTS request workflow and management
 * Mirrors backend types for type safety across the stack
 */

/**
 * Request types for different PTS operations
 */
export enum RequestType {
  NEW_ENTRY = 'NEW_ENTRY',
  EDIT_INFO = 'EDIT_INFO',
  RATE_CHANGE = 'RATE_CHANGE',
}

/**
 * Request status tracking throughout the workflow
 */
export enum RequestStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
}

/**
 * Action types for request workflow transitions
 */
export enum ActionType {
  SUBMIT = 'SUBMIT',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  RETURN = 'RETURN',
}

/**
 * File attachment types for request documentation
 */
export enum FileType {
  LICENSE = 'LICENSE',
  DIPLOMA = 'DIPLOMA',
  ORDER_DOC = 'ORDER_DOC',
  OTHER = 'OTHER',
}

/**
 * Step to Role mapping
 */
export const STEP_ROLE_MAP: Record<number, string> = {
  1: 'HEAD_DEPT',
  2: 'PTS_OFFICER',
  3: 'HEAD_HR',
  4: 'DIRECTOR',
  5: 'HEAD_FINANCE',
};

/**
 * Role to Step mapping
 */
export const ROLE_STEP_MAP: Record<string, number> = {
  HEAD_DEPT: 1,
  PTS_OFFICER: 2,
  HEAD_HR: 3,
  DIRECTOR: 4,
  HEAD_FINANCE: 5,
};

/**
 * PTS Request entity
 */
export interface PTSRequest {
  request_id: number;
  user_id: number;
  request_type: RequestType;
  status: RequestStatus;
  current_step: number;
  submission_data: any;
  created_at: Date | string;
  updated_at: Date | string;
  submitted_at: Date | string | null;
}

/**
 * Request action/history entity
 */
export interface RequestAction {
  action_id: number;
  request_id: number;
  actor_id: number;
  action_type: ActionType;
  from_step: number;
  to_step: number;
  comment: string | null;
  created_at: Date | string;
}

/**
 * File attachment entity
 */
export interface RequestAttachment {
  attachment_id: number;
  request_id: number;
  file_type: FileType;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  uploaded_at: Date | string;
}

/**
 * Extended request with related data
 */
export interface RequestWithDetails extends PTSRequest {
  attachments?: RequestAttachment[];
  actions?: RequestActionWithActor[];
  requester?: {
    citizen_id: string;
    role: string;
  };
}

/**
 * Action with actor information
 */
export interface RequestActionWithActor extends RequestAction {
  actor?: {
    citizen_id: string;
    role: string;
  };
}

/**
 * DTO for creating a new request
 */
export interface CreateRequestDTO {
  request_type: RequestType;
  submission_data: any;
  files?: File[];
}

/**
 * Request type labels (Thai)
 */
export const REQUEST_TYPE_LABELS: Record<RequestType, string> = {
  [RequestType.NEW_ENTRY]: 'ขอรับค่าตอบแทนใหม่',
  [RequestType.EDIT_INFO]: 'แก้ไขข้อมูล',
  [RequestType.RATE_CHANGE]: 'เปลี่ยนแปลงอัตรา',
};

/**
 * Request status labels (Thai)
 */
export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  [RequestStatus.DRAFT]: 'แบบร่าง',
  [RequestStatus.PENDING]: 'รอดำเนินการ',
  [RequestStatus.APPROVED]: 'อนุมัติแล้ว',
  [RequestStatus.REJECTED]: 'ไม่อนุมัติ',
  [RequestStatus.CANCELLED]: 'ยกเลิก',
  [RequestStatus.RETURNED]: 'ส่งกลับแก้ไข',
};

/**
 * Step labels (Thai)
 */
export const STEP_LABELS: Record<number, string> = {
  1: 'หัวหน้าแผนก',
  2: 'เจ้าหน้าที่ พ.ต.ส.',
  3: 'หัวหน้าฝ่ายทรัพยากรบุคคล',
  4: 'ผู้อำนวยการโรงพยาบาล',
  5: 'หัวหน้าฝ่ายการเงิน',
};
