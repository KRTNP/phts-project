/**
 * Frontend Signature API client
 *
 * Fetches and manages signatures via HTTP endpoints (no direct DB access).
 */
import { apiClient } from '@/lib/axios';

/**
 * Signature response from API
 */
export interface SignatureData {
  user_id: number;
  image_base64: string;
  mime_type: string;
  data_url: string;
  created_at: string;
}

/**
 * API response wrapper
 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class SignatureApi {
  /**
   * Get current user's stored signature
   * @returns Signature data with base64 image and data URL
   */
  static async getMySignature(): Promise<SignatureData | null> {
    try {
      const response = await apiClient.get<ApiResponse<SignatureData>>(
        '/api/signatures/my-signature'
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return null;
    } catch (error: any) {
      // 404 means no signature stored - not an error
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Error fetching signature:', error);
      throw error;
    }
  }

  /**
   * Check if current user has a stored signature
   * @returns True if user has a signature stored
   */
  static async hasSignature(): Promise<boolean> {
    try {
      const response = await apiClient.get<ApiResponse<{ has_signature: boolean }>>(
        '/api/signatures/check'
      );

      return response.data.success && response.data.data?.has_signature === true;
    } catch (error) {
      console.error('Error checking signature:', error);
      return false;
    }
  }

  /**
   * Upload signature from base64 string
   * @param imageBase64 - Base64 encoded image (with or without data URL prefix)
   * @returns Signature ID
   */
  static async uploadSignature(imageBase64: string): Promise<number> {
    try {
      const response = await apiClient.post<ApiResponse<{ signature_id: number; message: string }>>(
        '/api/signatures/upload',
        { image_base64: imageBase64 }
      );

      if (response.data.success && response.data.data) {
        return response.data.data.signature_id;
      }
      throw new Error(response.data.error || 'Failed to upload signature');
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  }

  /**
   * Upload signature from file
   * @param file - Image file (PNG, JPEG)
   * @returns Signature ID
   */
  static async uploadSignatureFile(file: File): Promise<number> {
    try {
      const formData = new FormData();
      formData.append('signature', file);

      const response = await apiClient.post<ApiResponse<{ signature_id: number; message: string }>>(
        '/api/signatures/upload-file',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success && response.data.data) {
        return response.data.data.signature_id;
      }
      throw new Error(response.data.error || 'Failed to upload signature file');
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  }

  /**
   * Delete current user's stored signature
   * @returns True if deleted successfully
   */
  static async deleteSignature(): Promise<boolean> {
    try {
      const response = await apiClient.delete<ApiResponse<{ message: string }>>(
        '/api/signatures'
      );

      return response.data.success === true;
    } catch (error: any) {
      // 404 means no signature to delete
      if (error.response?.status === 404) {
        return false;
      }
      throw error;
    }
  }
}
