/**
 * PHTS System - Request Service Layer
 *
 * Business logic for PTS request management and workflow.
 * Includes "The Bridge" - post-approval logic that feeds Part 3 Calculation Master Data.
 *
 * Date: 2025-12-31
 */

import { RowDataPacket, ResultSetHeader, PoolConnection } from 'mysql2/promise';
import { query, getConnection } from '../config/database.js';
import {
  RequestStatus,
  ActionType,
  FileType,
  RequestType,
  PTSRequest,
  RequestAttachment,
  RequestWithDetails,
  STEP_ROLE_MAP,
  ROLE_STEP_MAP,
  CreateRequestDTO,
  BatchApproveParams,
  BatchApproveResult,
} from '../types/request.types.js';
import * as signatureService from './signatureService.js';

/**
 * Result type for finalization operation
 */
interface FinalizeResult {
  rateAdjustmentId: number | null;
  licenseUpdated: boolean;
}

/**
 * Create a new request in DRAFT status
 *
 * @param userId - ID of the user creating the request
 * @param data - Request data including all P.T.S. form fields
 * @param files - Uploaded file attachments
 * @param signaturePath - Path to uploaded signature image
 * @returns Created request with attachments
 */
export async function createRequest(
  userId: number,
  data: CreateRequestDTO,
  files?: Express.Multer.File[],
  signaturePath?: string
): Promise<RequestWithDetails> {
  const connection = await getConnection();

  try {
    await connection.beginTransaction();

    // Prepare work_attributes JSON
    const workAttributesJson = data.work_attributes
      ? JSON.stringify(data.work_attributes)
      : null;

    // Prepare submission_data JSON (for backward compatibility)
    const submissionDataJson = data.submission_data
      ? JSON.stringify(data.submission_data)
      : null;

    // Insert request with DRAFT status, all new fields, and signature
    const [result] = await connection.execute<ResultSetHeader>(
      `INSERT INTO pts_requests
       (user_id, personnel_type, position_number, department_group,
        main_duty, work_attributes, applicant_signature, request_type, requested_amount,
        effective_date, status, current_step, submission_data)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        data.personnel_type,
        data.position_number || null,
        data.department_group || null,
        data.main_duty || null,
        workAttributesJson,
        signaturePath || null, // Add signature path
        data.request_type,
        data.requested_amount || null,
        data.effective_date || null,
        RequestStatus.DRAFT,
        1,
        submissionDataJson,
      ]
    );

    const requestId = result.insertId;

    // Insert file attachments if provided
    const attachments: RequestAttachment[] = [];
    if (files && files.length > 0) {
      for (const file of files) {
        const [attachResult] = await connection.execute<ResultSetHeader>(
          `INSERT INTO pts_attachments
           (request_id, file_type, file_path, original_filename, file_size, mime_type)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            requestId,
            FileType.OTHER, // Default type, can be enhanced later
            file.path,
            file.originalname,
            file.size,
            file.mimetype,
          ]
        );

        attachments.push({
          attachment_id: attachResult.insertId,
          request_id: requestId,
          file_type: FileType.OTHER,
          file_path: file.path,
          original_filename: file.originalname,
          file_size: file.size,
          mime_type: file.mimetype,
          uploaded_at: new Date(),
        });
      }
    }

    await connection.commit();

    // Fetch and return the created request
    const [requests] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM pts_requests WHERE request_id = ?',
      [requestId]
    );

    const request = requests[0] as any;

    // Parse work_attributes back to object if it's a JSON string
    if (request.work_attributes && typeof request.work_attributes === 'string') {
      request.work_attributes = JSON.parse(request.work_attributes);
    }

    return {
      ...request,
      attachments,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Submit a draft request to start the approval workflow
 *
 * @param requestId - Request ID to submit
 * @param userId - User ID submitting the request
 * @returns Updated request
 */
export async function submitRequest(
  requestId: number,
  userId: number
): Promise<PTSRequest> {
  const connection = await getConnection();

  try {
    await connection.beginTransaction();

    // Get current request
    const [requests] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM pts_requests WHERE request_id = ? AND user_id = ?',
      [requestId, userId]
    );

    if (requests.length === 0) {
      throw new Error('Request not found or you do not have permission');
    }

    const request = requests[0] as PTSRequest;

    // Verify status is DRAFT
    if (request.status !== RequestStatus.DRAFT) {
      throw new Error(`Cannot submit request with status: ${request.status}`);
    }

    // Update to PENDING and set current_step to 1
    await connection.execute(
      `UPDATE pts_requests
       SET status = ?, current_step = ?, updated_at = NOW()
       WHERE request_id = ?`,
      [RequestStatus.PENDING, 1, requestId]
    );

    // Log SUBMIT action
    await connection.execute(
      `INSERT INTO pts_request_actions
       (request_id, actor_id, step_no, action, comment)
       VALUES (?, ?, ?, ?, ?)`,
      [requestId, userId, 1, ActionType.SUBMIT, null]
    );

    await connection.commit();

    // Fetch and return updated request
    const [updatedRequests] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM pts_requests WHERE request_id = ?',
      [requestId]
    );

    return updatedRequests[0] as PTSRequest;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Get all requests created by a specific user
 *
 * @param userId - User ID to filter by
 * @returns List of requests with attachments and actions
 */
export async function getMyRequests(userId: number): Promise<RequestWithDetails[]> {
  const requests = await query<RowDataPacket[]>(
    `SELECT r.*, u.citizen_id, u.role
     FROM pts_requests r
     JOIN users u ON r.user_id = u.user_id
     WHERE r.user_id = ?
     ORDER BY r.created_at DESC`,
    [userId]
  );

  const requestRows = Array.isArray(requests) ? (requests as PTSRequest[]) : [];
  const requestsWithDetails: RequestWithDetails[] = [];

  for (const request of requestRows) {
    const details = await getRequestDetails(request.request_id);
    requestsWithDetails.push(details);
  }

  return requestsWithDetails;
}

/**
 * Get pending requests for a specific approver role
 *
 * @param userRole - Role of the approver
 * @returns List of pending requests at the approver's step
 */
export async function getPendingForApprover(userRole: string): Promise<RequestWithDetails[]> {
  // Map role to step number
  const stepNo = ROLE_STEP_MAP[userRole];

  if (!stepNo) {
    throw new Error(`Invalid approver role: ${userRole}`);
  }

  const requests = await query<RowDataPacket[]>(
    `SELECT r.*, u.citizen_id as requester_citizen_id, u.role as requester_role
     FROM pts_requests r
     JOIN users u ON r.user_id = u.user_id
     WHERE r.status = ? AND r.current_step = ?
     ORDER BY r.created_at ASC`,
    [RequestStatus.PENDING, stepNo]
  );

  const requestRows = Array.isArray(requests) ? (requests as any[]) : [];
  const requestsWithDetails: RequestWithDetails[] = [];

  for (const request of requestRows) {
    const details = await getRequestDetails(request.request_id);
    details.requester = {
      citizen_id: request.requester_citizen_id,
      role: request.requester_role,
    };
    requestsWithDetails.push(details);
  }

  return requestsWithDetails;
}

/**
 * Get full request details by ID with access control
 *
 * @param requestId - Request ID
 * @param userId - User ID requesting access
 * @param userRole - User role for permission checking
 * @returns Request with full details
 */
export async function getRequestById(
  requestId: number,
  userId: number,
  userRole: string
): Promise<RequestWithDetails> {
  const requests = await query<RowDataPacket[]>(
    `SELECT r.*, u.citizen_id as requester_citizen_id, u.role as requester_role
     FROM pts_requests r
     JOIN users u ON r.user_id = u.user_id
     WHERE r.request_id = ?`,
    [requestId]
  );

  if (requests.length === 0) {
    throw new Error('Request not found');
  }

  const request = requests[0] as any;

  // Check access: owner OR appropriate approver OR admin
  const isOwner = request.user_id === userId;
  const isApprover =
    ROLE_STEP_MAP[userRole] !== undefined &&
    request.status === RequestStatus.PENDING &&
    request.current_step === ROLE_STEP_MAP[userRole];
  const isAdmin = userRole === 'ADMIN';

  if (!isOwner && !isApprover && !isAdmin) {
    throw new Error('You do not have permission to view this request');
  }

  const details = await getRequestDetails(requestId);
  details.requester = {
    citizen_id: request.requester_citizen_id,
    role: request.requester_role,
  };

  return details;
}

/**
 * Approve a request and move it to the next step
 *
 * @param requestId - Request ID to approve
 * @param actorId - User ID of the approver
 * @param actorRole - Role of the approver
 * @param comment - Optional approval comment
 * @returns Updated request
 */
export async function approveRequest(
  requestId: number,
  actorId: number,
  actorRole: string,
  comment?: string
): Promise<PTSRequest> {
  const connection = await getConnection();

  try {
    await connection.beginTransaction();

    // Get current request
    const [requests] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM pts_requests WHERE request_id = ?',
      [requestId]
    );

    if (requests.length === 0) {
      throw new Error('Request not found');
    }

    const request = requests[0] as PTSRequest;

    // Validate status is PENDING
    if (request.status !== RequestStatus.PENDING) {
      throw new Error(`Cannot approve request with status: ${request.status}`);
    }

    // Validate approver role matches current step
    const expectedRole = STEP_ROLE_MAP[request.current_step];
    if (expectedRole !== actorRole) {
      throw new Error(
        `Invalid approver role. Expected ${expectedRole}, got ${actorRole}`
      );
    }

    const currentStep = request.current_step;
    const nextStep = currentStep + 1;

    // Fetch approver's stored signature (if any)
    let signatureSnapshot: string | null = null;
    try {
      const signatureDataUrl = await signatureService.getSignatureDataUrl(actorId);
      if (signatureDataUrl) {
        signatureSnapshot = signatureDataUrl;
      }
    } catch (sigError) {
      // If signature lookup fails, continue without signature
      console.warn(`Could not fetch signature for user ${actorId}:`, sigError);
    }

    // Log APPROVE action with signature snapshot
    await connection.execute(
      `INSERT INTO pts_request_actions
       (request_id, actor_id, step_no, action, comment, signature_snapshot)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [requestId, actorId, currentStep, ActionType.APPROVE, comment || null, signatureSnapshot]
    );

    // Check if this is the final approval step
    if (nextStep > 5) {
      // All approvals completed - mark as APPROVED
      await connection.execute(
        `UPDATE pts_requests
         SET status = ?, current_step = ?, updated_at = NOW()
         WHERE request_id = ?`,
        [RequestStatus.APPROVED, 6, requestId]
      );

      // ========================================
      // THE BRIDGE: Trigger post-approval logic
      // ========================================
      // Call finalizeRequest within the same transaction to ensure
      // data integrity. If finalization fails, the approval rolls back.
      // ========================================
      try {
        const finalizeResult = await finalizeRequest(requestId, actorId, connection);
        console.log(
          `[approveRequest] Finalization complete for request ${requestId}:`,
          `rateAdjustmentId=${finalizeResult.rateAdjustmentId},`,
          `licenseUpdated=${finalizeResult.licenseUpdated}`
        );
      } catch (finalizeError) {
        console.error(`[approveRequest] Finalization failed for request ${requestId}:`, finalizeError);
        // Re-throw to trigger rollback
        throw new Error(
          `Request approved but finalization failed: ${finalizeError instanceof Error ? finalizeError.message : 'Unknown error'}`
        );
      }
    } else {
      // Move to next approval step
      await connection.execute(
        `UPDATE pts_requests
         SET current_step = ?, updated_at = NOW()
         WHERE request_id = ?`,
        [nextStep, requestId]
      );
    }

    await connection.commit();

    // Fetch and return updated request
    const [updatedRequests] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM pts_requests WHERE request_id = ?',
      [requestId]
    );

    return updatedRequests[0] as PTSRequest;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Reject a request and stop the workflow
 *
 * @param requestId - Request ID to reject
 * @param actorId - User ID of the rejector
 * @param actorRole - Role of the rejector
 * @param comment - Required rejection reason
 * @returns Updated request
 */
export async function rejectRequest(
  requestId: number,
  actorId: number,
  actorRole: string,
  comment: string
): Promise<PTSRequest> {
  const connection = await getConnection();

  try {
    await connection.beginTransaction();

    // Get current request
    const [requests] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM pts_requests WHERE request_id = ?',
      [requestId]
    );

    if (requests.length === 0) {
      throw new Error('Request not found');
    }

    const request = requests[0] as PTSRequest;

    // Validate status is PENDING
    if (request.status !== RequestStatus.PENDING) {
      throw new Error(`Cannot reject request with status: ${request.status}`);
    }

    // Validate approver role matches current step
    const expectedRole = STEP_ROLE_MAP[request.current_step];
    if (expectedRole !== actorRole) {
      throw new Error(
        `Invalid approver role. Expected ${expectedRole}, got ${actorRole}`
      );
    }

    // Validate comment is provided
    if (!comment || comment.trim() === '') {
      throw new Error('Rejection reason is required');
    }

    const currentStep = request.current_step;

    // Log REJECT action
    await connection.execute(
      `INSERT INTO pts_request_actions
       (request_id, actor_id, step_no, action, comment)
       VALUES (?, ?, ?, ?, ?)`,
      [requestId, actorId, currentStep, ActionType.REJECT, comment]
    );

    // Update status to REJECTED
    await connection.execute(
      `UPDATE pts_requests
       SET status = ?, updated_at = NOW()
       WHERE request_id = ?`,
      [RequestStatus.REJECTED, requestId]
    );

    await connection.commit();

    // Fetch and return updated request
    const [updatedRequests] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM pts_requests WHERE request_id = ?',
      [requestId]
    );

    return updatedRequests[0] as PTSRequest;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Return a request to the previous step for revision
 *
 * @param requestId - Request ID to return
 * @param actorId - User ID of the returner
 * @param actorRole - Role of the returner
 * @param comment - Required reason for returning
 * @returns Updated request
 */
export async function returnRequest(
  requestId: number,
  actorId: number,
  actorRole: string,
  comment: string
): Promise<PTSRequest> {
  const connection = await getConnection();

  try {
    await connection.beginTransaction();

    // Get current request
    const [requests] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM pts_requests WHERE request_id = ?',
      [requestId]
    );

    if (requests.length === 0) {
      throw new Error('Request not found');
    }

    const request = requests[0] as PTSRequest;

    // Validate status is PENDING
    if (request.status !== RequestStatus.PENDING) {
      throw new Error(`Cannot return request with status: ${request.status}`);
    }

    // Validate step > 1 (cannot return from first step)
    if (request.current_step <= 1) {
      throw new Error('Cannot return request from the first approval step');
    }

    // Validate approver role matches current step
    const expectedRole = STEP_ROLE_MAP[request.current_step];
    if (expectedRole !== actorRole) {
      throw new Error(
        `Invalid approver role. Expected ${expectedRole}, got ${actorRole}`
      );
    }

    // Validate comment is provided
    if (!comment || comment.trim() === '') {
      throw new Error('Return reason is required');
    }

    const currentStep = request.current_step;
    const previousStep = currentStep - 1;

    // Log RETURN action
    await connection.execute(
      `INSERT INTO pts_request_actions
       (request_id, actor_id, step_no, action, comment)
       VALUES (?, ?, ?, ?, ?)`,
      [requestId, actorId, currentStep, ActionType.RETURN, comment]
    );

    // Update to RETURNED status and decrement step
    await connection.execute(
      `UPDATE pts_requests
       SET status = ?, current_step = ?, updated_at = NOW()
       WHERE request_id = ?`,
      [RequestStatus.RETURNED, previousStep, requestId]
    );

    await connection.commit();

    // Fetch and return updated request
    const [updatedRequests] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM pts_requests WHERE request_id = ?',
      [requestId]
    );

    return updatedRequests[0] as PTSRequest;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Batch approve multiple requests (DIRECTOR Step 4 or HEAD_FINANCE Step 5)
 *
 * Supports batch approval for:
 * - DIRECTOR at Step 4: Moves requests to Step 5 (HEAD_FINANCE)
 * - HEAD_FINANCE at Step 5: Marks requests as APPROVED and triggers finalization
 *
 * @param actorId - User ID of the approver
 * @param actorRole - Role of the approver ('DIRECTOR' or 'HEAD_FINANCE')
 * @param params - Request IDs to approve and optional comment
 * @returns Result containing successful and failed approvals
 */
export async function approveBatch(
  actorId: number,
  actorRole: string,
  params: BatchApproveParams
): Promise<BatchApproveResult> {
  const { requestIds, comment } = params;
  const result: BatchApproveResult = { success: [], failed: [] };

  // Determine expected step based on role
  const expectedStep = ROLE_STEP_MAP[actorRole];
  if (expectedStep === undefined || (expectedStep !== 4 && expectedStep !== 5)) {
    throw new Error(`Batch approval not supported for role: ${actorRole}`);
  }

  const connection = await getConnection();

  try {
    await connection.beginTransaction();

    // Fetch approver's stored signature once (same for all batch approvals)
    let signatureSnapshot: string | null = null;
    try {
      const signatureDataUrl = await signatureService.getSignatureDataUrl(actorId);
      if (signatureDataUrl) {
        signatureSnapshot = signatureDataUrl;
      }
    } catch (sigError) {
      // If signature lookup fails, continue without signature
      console.warn(`Could not fetch signature for user ${actorId}:`, sigError);
    }

    for (const requestId of requestIds) {
      try {
        // Get current request with row lock
        const [rows] = await connection.query<RowDataPacket[]>(
          'SELECT * FROM pts_requests WHERE request_id = ? FOR UPDATE',
          [requestId]
        );

        if (rows.length === 0) {
          result.failed.push({ id: requestId, reason: 'Request not found' });
          continue;
        }

        const request = rows[0] as PTSRequest;

        // Validate: must be at expected step for this role
        if (request.current_step !== expectedStep) {
          result.failed.push({
            id: requestId,
            reason: `Not at Step ${expectedStep} (currently at Step ${request.current_step})`,
          });
          continue;
        }

        // Validate: must have PENDING status
        if (request.status !== RequestStatus.PENDING) {
          result.failed.push({
            id: requestId,
            reason: `Status is ${request.status}, not PENDING`,
          });
          continue;
        }

        // Log APPROVE action with signature snapshot
        await connection.execute(
          `INSERT INTO pts_request_actions
           (request_id, actor_id, step_no, action, comment, signature_snapshot)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [requestId, actorId, expectedStep, ActionType.APPROVE, comment || null, signatureSnapshot]
        );

        if (expectedStep === 5) {
          // HEAD_FINANCE final approval - mark as APPROVED
          await connection.execute(
            `UPDATE pts_requests
             SET status = ?, current_step = 6, updated_at = NOW()
             WHERE request_id = ?`,
            [RequestStatus.APPROVED, requestId]
          );

          // ========================================
          // THE BRIDGE: Trigger post-approval logic
          // ========================================
          try {
            const finalizeResult = await finalizeRequest(requestId, actorId, connection);
            console.log(
              `[approveBatch] Finalization complete for request ${requestId}:`,
              `rateAdjustmentId=${finalizeResult.rateAdjustmentId}`
            );
          } catch (finalizeError) {
            console.error(`[approveBatch] Finalization failed for request ${requestId}:`, finalizeError);
            result.failed.push({
              id: requestId,
              reason: `Finalization failed: ${finalizeError instanceof Error ? finalizeError.message : 'Unknown error'}`,
            });
            continue; // Skip adding to success
          }
        } else {
          // DIRECTOR approval - move to Step 5 (HEAD_FINANCE)
          await connection.execute(
            `UPDATE pts_requests
             SET current_step = 5, updated_at = NOW()
             WHERE request_id = ?`,
            [requestId]
          );
        }

        result.success.push(requestId);
      } catch (err) {
        console.error(`Error processing request ${requestId}:`, err);
        result.failed.push({ id: requestId, reason: 'Database error' });
      }
    }

    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// ============================================
// THE BRIDGE - Post-Approval Logic
// ============================================
// This section handles the data flow from Part 2 (Requests)
// to Part 3 (Calculation Master Data) upon final approval.
// ============================================

/**
 * Finalize a request after final approval (Step 5 -> APPROVED)
 *
 * THE BRIDGE: This function connects the workflow system to calculation master data.
 * It is called automatically within the same transaction when a request reaches
 * final approval to ensure data integrity.
 *
 * Actions performed:
 * - Action A: Insert PTS rate adjustment (if requested_amount > 0 and effective_date exists)
 * - Action B: Update employee licenses (placeholder for LICENSE attachments)
 *
 * @param requestId - The request ID being finalized
 * @param finalApproverId - User ID of the final approver (HEAD_FINANCE)
 * @param connection - Active database connection (for transaction integrity)
 * @returns FinalizeResult with created IDs and status
 * @throws Error if any operation fails (triggers rollback in parent)
 */
export async function finalizeRequest(
  requestId: number,
  finalApproverId: number,
  connection: PoolConnection
): Promise<FinalizeResult> {
  const result: FinalizeResult = {
    rateAdjustmentId: null,
    licenseUpdated: false,
  };

  try {
    // Fetch the request with full details
    const [requests] = await connection.query<RowDataPacket[]>(
      `SELECT r.*, u.citizen_id
       FROM pts_requests r
       JOIN users u ON r.user_id = u.user_id
       WHERE r.request_id = ?`,
      [requestId]
    );

    if (requests.length === 0) {
      throw new Error(`Request ${requestId} not found during finalization`);
    }

    const request = requests[0] as PTSRequest & { citizen_id: string };

    // Verify the request is in APPROVED status
    if (request.status !== RequestStatus.APPROVED) {
      throw new Error(
        `Cannot finalize request ${requestId}: status is ${request.status}, expected APPROVED`
      );
    }

    console.log(`[finalizeRequest] Processing request ${requestId} for citizen ${request.citizen_id}`);

    // ========================================
    // ACTION A: Rate Adjustment
    // ========================================
    // Insert into pts_rate_adjustments if:
    // - requested_amount exists and is > 0
    // - effective_date exists
    // ========================================
    if (
      request.requested_amount !== null &&
      request.requested_amount > 0 &&
      request.effective_date !== null
    ) {
      // Determine adjustment type based on request type
      let adjustmentType: string;
      switch (request.request_type) {
        case RequestType.NEW_ENTRY:
          adjustmentType = 'NEW_ENTRY';
          break;
        case RequestType.EDIT_INFO_NEW_RATE:
          adjustmentType = 'RATE_CHANGE';
          break;
        case RequestType.EDIT_INFO_SAME_RATE:
          // For same rate edits, we might still want to record it as a correction
          adjustmentType = 'CORRECTION';
          break;
        default:
          adjustmentType = 'RATE_CHANGE';
      }

      const [insertResult] = await connection.execute<ResultSetHeader>(
        `INSERT INTO pts_rate_adjustments
         (citizen_id, pts_rate, effective_date, source_ref, note)
         VALUES (?, ?, ?, ?, ?)`,
        [
          request.citizen_id,
          request.requested_amount,
          request.effective_date,
          `REQ-${requestId}`, // store request reference as string
          JSON.stringify({
            type: adjustmentType,
            desc: `Auto-generated from approved request #${requestId}`,
            approvedBy: finalApproverId,
          }),
        ]
      );

      result.rateAdjustmentId = insertResult.insertId;
      console.log(
        `[finalizeRequest] Created rate adjustment #${result.rateAdjustmentId} ` +
          `for citizen ${request.citizen_id}: ${request.requested_amount} THB, ` +
          `effective ${request.effective_date}`
      );
    } else {
      console.log(
        `[finalizeRequest] Skipping rate adjustment: ` +
          `amount=${request.requested_amount}, date=${request.effective_date}`
      );
    }

    // ========================================
    // ACTION B: License Update (Placeholder)
    // ========================================
    // TODO: If the request has attachments of type 'LICENSE',
    // we should logically update the employee_licenses table.
    // This requires additional metadata (license_type, license_number, expiry_date)
    // to be captured in the request form or attachment metadata.
    //
    // For now, we log a placeholder message if LICENSE attachments exist.
    // ========================================
    const [licenseAttachments] = await connection.query<RowDataPacket[]>(
      `SELECT attachment_id, original_filename
       FROM pts_attachments
       WHERE request_id = ? AND file_type = ?`,
      [requestId, FileType.LICENSE]
    );

    if (licenseAttachments.length > 0) {
      // TODO: Implement actual license update logic when schema supports it
      // This would require:
      // 1. Parsing license metadata from attachment or form data
      // 2. INSERT/UPDATE into employee_licenses view/table
      // Example:
      // await connection.execute(
      //   `INSERT INTO employee_licenses (citizen_id, license_type, license_number, issue_date, expiry_date)
      //    VALUES (?, ?, ?, ?, ?)
      //    ON DUPLICATE KEY UPDATE ...`,
      //   [request.citizen_id, licenseType, licenseNumber, issueDate, expiryDate]
      // );

      console.log(
        `[finalizeRequest] Found ${licenseAttachments.length} LICENSE attachment(s) for request ${requestId}. ` +
          `License update logic is a TODO - requires metadata schema extension.`
      );

      // Mark as "updated" for audit trail (even though it's a placeholder)
      result.licenseUpdated = false; // Set to true when implemented
    }

    console.log(`[finalizeRequest] Completed finalization for request ${requestId}`);
    return result;

  } catch (error) {
    console.error(`[finalizeRequest] Error finalizing request ${requestId}:`, error);
    // Re-throw to trigger rollback in parent transaction
    throw error;
  }
}

/**
 * Helper function to get request details including attachments and actions
 *
 * @param requestId - Request ID
 * @returns Request with full details
 */
async function getRequestDetails(requestId: number): Promise<RequestWithDetails> {
  // Get request
  const requests = await query<RowDataPacket[]>(
    'SELECT * FROM pts_requests WHERE request_id = ?',
    [requestId]
  );

  if (requests.length === 0) {
    throw new Error('Request not found');
  }

  const request = requests[0] as any;

  // Parse work_attributes from JSON string to object if needed
  if (request.work_attributes && typeof request.work_attributes === 'string') {
    request.work_attributes = JSON.parse(request.work_attributes);
  }

  // Get attachments
  const attachments = await query<RowDataPacket[]>(
    'SELECT * FROM pts_attachments WHERE request_id = ? ORDER BY uploaded_at DESC',
    [requestId]
  );

  // Get actions with actor info
  const actions = await query<RowDataPacket[]>(
    `SELECT a.*, u.citizen_id as actor_citizen_id, u.role as actor_role
     FROM pts_request_actions a
     JOIN users u ON a.actor_id = u.user_id
     WHERE a.request_id = ?
     ORDER BY a.action_date ASC`,
    [requestId]
  );

  const actionsWithActor = (actions as any[]).map((action) => ({
    action_id: action.action_id,
    request_id: action.request_id,
    actor_id: action.actor_id,
    action: action.action,
    action_type: action.action, // alias for frontend
    step_no: action.step_no,
    from_step: action.step_no,
    to_step: action.step_no,
    comment: action.comment,
    action_date: action.action_date,
    created_at: action.action_date,
    actor: {
      citizen_id: action.actor_citizen_id,
      role: action.actor_role,
    },
  }));

  return {
    ...request,
    attachments: (attachments as any[]).map((att) => ({
      attachment_id: att.attachment_id,
      request_id: att.request_id,
      file_type: att.file_type,
      file_path: att.file_path,
      original_filename: att.original_filename,
      file_name: att.original_filename, // alias for frontend
      file_size: att.file_size,
      mime_type: att.mime_type,
      uploaded_at: att.uploaded_at,
    })) as RequestAttachment[],
    actions: actionsWithActor,
  };
}
