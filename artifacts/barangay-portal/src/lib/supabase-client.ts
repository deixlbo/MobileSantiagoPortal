import { createClient } from '@supabase/supabase-js';

// Support both Vite and Next.js environment variables
const supabaseUrl = 
  (import.meta.env as any)?.VITE_SUPABASE_URL || 
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  import.meta.env.VITE_SUPABASE_URL ||
  '';

const supabaseKey = 
  (import.meta.env as any)?.VITE_SUPABASE_ANON_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// COMMON SUPABASE PATTERNS

/**
 * CREATE - Insert a single record
 * @example
 * const { data, error } = await insert('users', { email: 'test@test.com', full_name: 'Test User' });
 */
export const insert = async <T extends Record<string, any>>(
  table: string,
  data: T
) => {
  return supabase.from(table).insert([data]).select();
};

/**
 * CREATE - Insert multiple records
 * @example
 * const { data, error } = await insertMany('announcements', [{ title: '...' }, { title: '...' }]);
 */
export const insertMany = async <T extends Record<string, any>>(
  table: string,
  data: T[]
) => {
  return supabase.from(table).insert(data).select();
};

/**
 * READ - Get all records
 * @example
 * const { data, error } = await selectAll('users');
 */
export const selectAll = async (table: string) => {
  return supabase.from(table).select('*');
};

/**
 * READ - Get single record by ID
 * @example
 * const { data, error } = await selectById('users', 'uuid-123');
 */
export const selectById = async (table: string, id: string) => {
  return supabase.from(table).select('*').eq('id', id).single();
};

/**
 * READ - Get records with filter
 * @example
 * const { data, error } = await selectWhere('users', 'user_type', 'admin');
 */
export const selectWhere = async (
  table: string,
  column: string,
  value: any
) => {
  return supabase.from(table).select('*').eq(column, value);
};

/**
 * READ - Get records with multiple filters
 * @example
 * const { data, error } = await selectWhereMultiple('documents', [
 *   { column: 'status', value: 'pending' },
 *   { column: 'resident_id', value: 'uuid-123' }
 * ]);
 */
export const selectWhereMultiple = async (
  table: string,
  filters: Array<{ column: string; value: any }>
) => {
  let query = supabase.from(table).select('*');
  filters.forEach(({ column, value }) => {
    query = query.eq(column, value);
  });
  return query;
};

/**
 * READ - Get records with comparison filters (gt, lt, etc.)
 * @example
 * const { data, error } = await selectWithComparison('blotter', 'severity', 'high', 'eq');
 */
export const selectWithComparison = async (
  table: string,
  column: string,
  value: any,
  operator: 'eq' | 'gt' | 'lt' | 'gte' | 'lte' | 'like' = 'eq'
) => {
  let query = supabase.from(table).select('*');
  
  switch (operator) {
    case 'gt':
      query = query.gt(column, value);
      break;
    case 'lt':
      query = query.lt(column, value);
      break;
    case 'gte':
      query = query.gte(column, value);
      break;
    case 'lte':
      query = query.lte(column, value);
      break;
    case 'like':
      query = query.like(column, `%${value}%`);
      break;
    default:
      query = query.eq(column, value);
  }
  
  return query;
};

/**
 * READ - Search with LIKE operator
 * @example
 * const { data, error } = await search('users', 'full_name', 'John');
 */
export const search = async (
  table: string,
  column: string,
  searchTerm: string
) => {
  return supabase
    .from(table)
    .select('*')
    .like(column, `%${searchTerm}%`);
};

/**
 * READ - Get sorted records
 * @example
 * const { data, error } = await selectSorted('announcements', 'created_at', { ascending: false });
 */
export const selectSorted = async (
  table: string,
  column: string,
  options: { ascending?: boolean; limit?: number } = {}
) => {
  let query = supabase
    .from(table)
    .select('*')
    .order(column, { ascending: options.ascending ?? true });
  
  if (options.limit) {
    query = query.limit(options.limit);
  }
  
  return query;
};

/**
 * READ - Get paginated records
 * @example
 * const { data, error } = await selectPaginated('users', 0, 10);
 */
export const selectPaginated = async (
  table: string,
  page: number = 0,
  pageSize: number = 10
) => {
  const from = page * pageSize;
  const to = from + pageSize - 1;
  
  return supabase
    .from(table)
    .select('*', { count: 'exact' })
    .range(from, to);
};

/**
 * UPDATE - Update a single record
 * @example
 * const { data, error } = await updateById('users', 'uuid-123', { full_name: 'New Name' });
 */
export const updateById = async <T extends Record<string, any>>(
  table: string,
  id: string,
  updates: Partial<T>
) => {
  return supabase
    .from(table)
    .update({ ...updates, updated_at: new Date() })
    .eq('id', id)
    .select();
};

/**
 * UPDATE - Update multiple records by filter
 * @example
 * const { data, error } = await updateWhere('documents', 'status', 'pending', { status: 'approved' });
 */
export const updateWhere = async <T extends Record<string, any>>(
  table: string,
  filterColumn: string,
  filterValue: any,
  updates: Partial<T>
) => {
  return supabase
    .from(table)
    .update({ ...updates, updated_at: new Date() })
    .eq(filterColumn, filterValue)
    .select();
};

/**
 * DELETE - Delete a single record
 * @example
 * const { error } = await deleteById('users', 'uuid-123');
 */
export const deleteById = async (table: string, id: string) => {
  return supabase.from(table).delete().eq('id', id);
};

/**
 * DELETE - Delete records by filter
 * @example
 * const { error } = await deleteWhere('announcements', 'posted_by', 'uuid-123');
 */
export const deleteWhere = async (
  table: string,
  column: string,
  value: any
) => {
  return supabase.from(table).delete().eq(column, value);
};

/**
 * COUNT - Get count of records
 * @example
 * const { count, error } = await countRecords('users');
 */
export const countRecords = async (table: string) => {
  const { count, error } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true });
  
  return { count: count ?? 0, error };
};

/**
 * COUNT - Get count with filter
 * @example
 * const { count, error } = await countWhere('users', 'user_type', 'admin');
 */
export const countWhere = async (
  table: string,
  column: string,
  value: any
) => {
  const { count, error } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true })
    .eq(column, value);
  
  return { count: count ?? 0, error };
};
