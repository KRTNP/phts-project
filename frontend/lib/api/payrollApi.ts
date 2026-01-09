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

export interface PayrollPayout {
  payout_id: number;
  citizen_id: string;
  first_name?: string | null;
  last_name?: string | null;
  position_name?: string | null;
  eligible_days?: number | null;
  deducted_days?: number | null;
  rate?: number | null;
  total_payable?: number | null;
  remark?: string | null;
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

export async function getPeriod(year: number, month: number): Promise<PayrollPeriod> {
  try {
    const response = await apiClient.get<ApiResponse<any>>('/api/payroll/period', {
      params: { year, month },
    });

    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Failed to fetch period');
    }

    if ('success' in response.data) {
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Failed to fetch period');
      }
      return normalizePeriod(response.data.data);
    }

    return normalizePeriod(response.data);
  } catch (error: unknown) {
    throw new Error(
      extractErrorMessage(error, 'ไม่สามารถดึงข้อมูลงวดเดือนได้'),
    );
  }
}

export async function getPeriods(): Promise<PayrollPeriod[]> {
  try {
    const response = await apiClient.get<ApiResponse<any>>('/api/payroll/periods');
    const payload: any = response.data;

    if (!payload || typeof payload !== 'object') {
      throw new Error('Failed to fetch periods');
    }

    if ('success' in payload) {
      if (!payload.success || !payload.data) {
        throw new Error(payload.error || 'Failed to fetch periods');
      }
      return Array.isArray(payload.data)
        ? payload.data.map(normalizePeriod)
        : [normalizePeriod(payload.data)];
    }

    if (Array.isArray(payload)) {
      return payload.map(normalizePeriod);
    }

    return [normalizePeriod(payload)];
  } catch (error: unknown) {
    throw new Error(
      extractErrorMessage(error, 'ไม่สามารถดึงข้อมูลงวดเดือนทั้งหมดได้'),
    );
  }
}

/**
 * Get current active payroll period
 */
export async function getCurrentPeriod(): Promise<PayrollPeriod> {
  const now = new Date();
  return getPeriod(now.getFullYear(), now.getMonth() + 1);
}

/**
 * Calculate monthly payroll on-demand (requires year, month, citizen_id)
 */
export async function calculateMonthly(
  year: number,
  month: number,
  citizenId?: string
): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient.post<ApiResponse<any>>('/api/payroll/calculate', {
      year,
      month,
      ...(citizenId ? { citizen_id: citizenId } : {}),
    });

    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Failed to calculate payroll');
    }

    return response.data;
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error, 'ไม่สามารถคำนวณเงินเดือนได้'));
  }
}

/**
 * Calculate and persist payroll for a specific period.
 */
export async function calculatePeriod(periodId: number): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient.post<ApiResponse<any>>(
      `/api/payroll/period/${periodId}/calculate`
    );

    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Failed to calculate payroll');
    }

    return response.data;
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error, 'ไม่สามารถคำนวณงวดเงินเดือนได้'));
  }
}

export async function getPeriodPayouts(periodId: number): Promise<PayrollPayout[]> {
  const response = await apiClient.get<ApiResponse<PayrollPayout[]>>(
    `/api/payroll/period/${periodId}/payouts`,
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to fetch payouts');
  }

  return response.data.data;
}

export async function approvePeriodByHR(periodId: number): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient.post<ApiResponse<any>>(
      `/api/payroll/period/${periodId}/approve-hr`
    );
    return response.data;
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error, 'ไม่สามารถอนุมัติ (HR) ได้'));
  }
}

export async function approvePeriodByHeadFinance(periodId: number): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient.post<ApiResponse<any>>(
      `/api/payroll/period/${periodId}/approve-head-finance`
    );
    return response.data;
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error, 'ไม่สามารถอนุมัติ (Head Finance) ได้'));
  }
}

export async function approvePeriodByDirector(periodId: number): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient.post<ApiResponse<any>>(
      `/api/payroll/period/${periodId}/approve-director`
    );
    return response.data;
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error, 'ไม่สามารถอนุมัติ (Director) ได้'));
  }
}

export async function rejectPeriod(periodId: number): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient.post<ApiResponse<any>>(
      `/api/payroll/period/${periodId}/reject`
    );
    return response.data;
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error, 'ไม่สามารถปฏิเสธงวดได้'));
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
    throw new Error(extractErrorMessage(error, 'ไม่สามารถส่งงวดเดือนไปอนุมัติได้'));
  }
}
