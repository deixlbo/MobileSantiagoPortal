import { useState, useCallback } from 'react';
import * as supabaseClient from './supabase-client';

/**
 * Custom hook for common Supabase operations
 * Provides a clean interface for CRUD operations with loading and error states
 */
export function useSupabase<T extends Record<string, any>>(table: string) {
  const [data, setData] = useState<T[] | T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (err: any) => {
    const message = err?.message || 'An error occurred';
    setError(message);
    console.error(`[Supabase ${table}] Error:`, err);
  };

  // CREATE
  const create = useCallback(
    async (record: T) => {
      setLoading(true);
      setError(null);
      try {
        const { data: result, error: err } = await supabaseClient.insert(table, record);
        if (err) throw err;
        setData(result);
        return result;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [table]
  );

  // CREATE MANY
  const createMany = useCallback(
    async (records: T[]) => {
      setLoading(true);
      setError(null);
      try {
        const { data: result, error: err } = await supabaseClient.insertMany(table, records);
        if (err) throw err;
        setData(result);
        return result;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [table]
  );

  // READ ALL
  const readAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: result, error: err } = await supabaseClient.selectAll(table);
      if (err) throw err;
      setData(result);
      return result;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [table]);

  // READ BY ID
  const readById = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const { data: result, error: err } = await supabaseClient.selectById(table, id);
        if (err) throw err;
        setData(result);
        return result;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [table]
  );

  // READ WHERE
  const readWhere = useCallback(
    async (column: string, value: any) => {
      setLoading(true);
      setError(null);
      try {
        const { data: result, error: err } = await supabaseClient.selectWhere(table, column, value);
        if (err) throw err;
        setData(result);
        return result;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [table]
  );

  // SEARCH
  const search = useCallback(
    async (column: string, searchTerm: string) => {
      setLoading(true);
      setError(null);
      try {
        const { data: result, error: err } = await supabaseClient.search(table, column, searchTerm);
        if (err) throw err;
        setData(result);
        return result;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [table]
  );

  // UPDATE
  const update = useCallback(
    async (id: string, updates: Partial<T>) => {
      setLoading(true);
      setError(null);
      try {
        const { data: result, error: err } = await supabaseClient.updateById(table, id, updates);
        if (err) throw err;
        setData(result);
        return result;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [table]
  );

  // DELETE
  const delete_ = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const { error: err } = await supabaseClient.deleteById(table, id);
        if (err) throw err;
        return true;
      } catch (err) {
        handleError(err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [table]
  );

  return {
    data,
    loading,
    error,
    // Create
    create,
    createMany,
    // Read
    readAll,
    readById,
    readWhere,
    search,
    // Update
    update,
    // Delete
    delete: delete_,
  };
}
