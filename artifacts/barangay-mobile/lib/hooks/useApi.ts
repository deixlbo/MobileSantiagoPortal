'use client';

import { useState, useCallback } from 'react';
import type { ApiResponse } from '@/lib/types';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export function useApi<T>(
  endpoint: string,
  options?: UseApiOptions
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const request = useCallback(
    async (method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', body?: any) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(endpoint, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: body ? JSON.stringify(body) : undefined,
        });

        const result: ApiResponse<T> = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Request failed');
        }

        setData(result.data || null);
        options?.onSuccess?.(result.data);

        return result.data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        options?.onError?.(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [endpoint, options]
  );

  return { data, loading, error, request };
}
