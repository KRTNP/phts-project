import { apiClient } from '@/lib/axios';
import { ApiResponse } from '@/types/auth';

export interface PayrollPeriod {
  period_id: number;
  year: number;
  month: number;
  status: string;
  total_amount?: number;
  total_headcount?: number;
}

const extractErrorMessage = (error: unknown, fallbackMessage: string) => {
  const err = error as { response?: { data?: { error?: string; message?: string } } };
  return err.response?.data?.error || err.response?.data?.message || fallbackMessage;
};

const normalizePeriod = (period: any): PayrollPeriod => ({
  period_id: period.period_id ?? period.id,
  year: period.year ?? period.period_year,
  month: period.month ?? period.period_month,
  status: period.status,
  total_amount: period.total_amount ?? period.totalAmount,
  total_headcount: period.total_headcount ?? period.totalHeadcount,
});

export async function getPeriods(): Promise<PayrollPeriod[]> {
  try {
    const response = await apiClient.get<ApiResponse<any[]>>('/api/payroll/periods');

    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Failed to fetch periods');
    }

    if ('success' in response.data) {
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Failed to fetch periods');
      }
      return response.data.data.map(normalizePeriod);
    }

    if (Array.isArray((response as any).data)) {
      return (response as any).data.map(normalizePeriod);
    }

    return [];
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error, 'ไม่สามารถดึงข้อมูลงวดได้'));
  }
}

/**
 * Get current active payroll period
 */
export async function getCurrentPeriod(): Promise<PayrollPeriod> {
  try {
    const response = await apiClient.get<ApiResponse<any>>('/api/payroll/period/current');

    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Failed to fetch current period');
    }

    if ('success' in response.data) {
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Failed to fetch current period');
      }
      return normalizePeriod(response.data.data);
    }

    return normalizePeriod(response.data);
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error, 'ไม่สามารถดึงข้อมูลงวดปัจจุบันได้'));
  }
}

/**
 * Calculate monthly payroll for a specific period
 */
export async function calculateMonthly(periodId: number): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient.post<ApiResponse<any>>(`/api/payroll/calculate/${periodId}`);

    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Failed to calculate payroll');
    }

    return response.data;
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error, 'ไม่สามารถประมวลผลเงินเดือนได้'));
  }
}

/**
 * Submit period for approval (close period and send to HR)
 */
export async function submitPeriod(periodId: number): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient.post<ApiResponse<any>>(`/api/payroll/period/${periodId}/submit`);

    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Failed to submit period');
    }

    return response.data;
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error, 'ไม่สามารถปิดงวดและส่งต่อได้'));
  }
}
