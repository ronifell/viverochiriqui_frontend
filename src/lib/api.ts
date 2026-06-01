import type {
  Category,
  ListResponse,
  Pagination,
  Product,
} from './types';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') ||
  'http://localhost:4000';

export class ApiError extends Error {
  status: number;
  details?: unknown;
  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

interface RequestOptions extends RequestInit {
  token?: string | null;
  query?: Record<string, string | number | boolean | undefined | null>;
  json?: unknown;
}

const buildUrl = (
  path: string,
  query?: RequestOptions['query']
): string => {
  const url = new URL(`${API_URL}${path.startsWith('/') ? path : `/${path}`}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === '') continue;
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
};

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const headers = new Headers(opts.headers);
  if (opts.json !== undefined) {
    headers.set('Content-Type', 'application/json');
  }
  if (opts.token) headers.set('Authorization', `Bearer ${opts.token}`);

  const res = await fetch(buildUrl(path, opts.query), {
    ...opts,
    headers,
    body: opts.json !== undefined ? JSON.stringify(opts.json) : opts.body,
    cache: opts.cache ?? 'no-store',
  });

  const isJson = res.headers
    .get('content-type')
    ?.includes('application/json');
  const payload = isJson ? await res.json() : null;

  if (!res.ok) {
    throw new ApiError(
      res.status,
      payload?.error || res.statusText || 'Request failed',
      payload?.details
    );
  }
  return payload as T;
}

export const api = {
  // Categories
  listCategories: (token?: string | null) =>
    request<ListResponse<Category>>('/api/categories', { token }),

  // Products
  listProducts: (
    params: {
      category?: string;
      q?: string;
      featured?: 1 | 0;
      stock?: string;
      sort?: string;
      page?: number;
      limit?: number;
    } = {},
    token?: string | null
  ) =>
    request<ListResponse<Product> & { pagination: Pagination }>(
      '/api/products',
      { token, query: params }
    ),
  getProduct: (id: string, token?: string | null) =>
    request<{ data: Product }>(`/api/products/${id}`, { token }),

  // Auth
  wholesaleLogin: (password: string) =>
    request<{ token: string; role: 'wholesale' }>('/api/auth/wholesale', {
      method: 'POST',
      json: { password },
    }),
  adminLogin: (email: string, password: string) =>
    request<{
      token: string;
      role: 'admin';
      user: { id: string; email: string; name: string | null };
    }>('/api/auth/admin', {
      method: 'POST',
      json: { email, password },
    }),

  // Admin: products
  createProduct: (token: string, body: Partial<Product>) =>
    request<{ data: Product }>('/api/products', {
      method: 'POST',
      token,
      json: body,
    }),
  updateProduct: (token: string, id: string, body: Partial<Product>) =>
    request<{ data: Product }>(`/api/products/${id}`, {
      method: 'PATCH',
      token,
      json: body,
    }),
  deleteProduct: (token: string, id: string) =>
    request<{ ok: true }>(`/api/products/${id}`, {
      method: 'DELETE',
      token,
    }),

  addProductImage: (
    token: string,
    productId: string,
    body: { url: string; alt_text?: string; is_primary?: boolean; is_video?: boolean; sort_order?: number }
  ) =>
    request<{ data: { id: string } }>(`/api/products/${productId}/images`, {
      method: 'POST',
      token,
      json: body,
    }),
  removeProductImage: (token: string, productId: string, imageId: string) =>
    request<{ ok: true }>(
      `/api/products/${productId}/images/${imageId}`,
      { method: 'DELETE', token }
    ),
  setPrimaryImage: (token: string, productId: string, imageId: string) =>
    request<{ ok: true }>(
      `/api/products/${productId}/images/${imageId}/primary`,
      { method: 'POST', token }
    ),

  // Admin: categories
  createCategory: (token: string, body: Partial<Category>) =>
    request<{ data: Category }>('/api/categories', {
      method: 'POST',
      token,
      json: body,
    }),
  updateCategory: (token: string, id: string, body: Partial<Category>) =>
    request<{ data: Category }>(`/api/categories/${id}`, {
      method: 'PATCH',
      token,
      json: body,
    }),
  deleteCategory: (token: string, id: string) =>
    request<{ ok: true }>(`/api/categories/${id}`, {
      method: 'DELETE',
      token,
    }),

  // Admin: uploads
  upload: async (token: string, files: File[]) => {
    const fd = new FormData();
    for (const f of files) fd.append('files', f);
    const res = await fetch(buildUrl('/api/admin/upload'), {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      throw new ApiError(res.status, e.error || 'Upload failed');
    }
    return res.json() as Promise<{
      data: { url: string; is_video: boolean; size: number; mime: string }[];
    }>;
  },
};

export const apiBaseUrl = API_URL;
