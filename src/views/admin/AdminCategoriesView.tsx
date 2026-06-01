'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { AdminShell } from '@/components/admin/AdminShell';
import { api, ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import type { Category } from '@/lib/types';
import { cn } from '@/lib/format';

export function AdminCategoriesView() {
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const adminToken = useAuth((s) => s.adminToken);

  const [items, setItems] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Category | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = async () => {
    if (!adminToken) return;
    const r = await api.listCategories(adminToken);
    setItems(r.data);
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminToken]);

  const startNew = () => {
    setEditing({
      id: '',
      slug: '',
      name_es: '',
      name_en: '',
      icon: '',
      sort_order: items.length + 1,
      is_active: true,
    });
    setCreating(true);
  };

  const onSave = async () => {
    if (!editing || !adminToken) return;
    setError(null);
    try {
      if (creating) {
        await api.createCategory(adminToken, editing);
      } else {
        await api.updateCategory(adminToken, editing.id, editing);
      }
      setEditing(null);
      setCreating(false);
      reload();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Save failed');
    }
  };

  const onDelete = async (id: string) => {
    if (!adminToken) return;
    if (!confirm(t('confirmDelete'))) return;
    await api.deleteCategory(adminToken, id);
    reload();
  };

  return (
    <AdminShell>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-brand-900">{t('categories')}</h1>
        <button
          onClick={startNew}
          className="btn-primary !py-2 !px-3 !text-xs"
        >
          <Plus className="h-4 w-4" />
          {t('newCategory')}
        </button>
      </div>

      <ul className="mt-4 space-y-2">
        {items.map((c) => (
          <li
            key={c.id}
            className={cn(
              'flex items-center gap-3 rounded-2xl bg-white p-3 shadow-soft ring-1 ring-brand-100',
              !c.is_active && 'opacity-60'
            )}
          >
            <button
              onClick={() => {
                setEditing(c);
                setCreating(false);
              }}
              className="flex-1 text-left"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-brand-900">
                  {locale === 'es' ? c.name_es : c.name_en}
                </span>
                <span className="text-[11px] text-brand-700/60">
                  {c.slug}
                </span>
              </div>
              <div className="text-[11px] text-brand-700/60">
                {locale === 'es' ? c.name_en : c.name_es}
                {c.product_count !== undefined &&
                  ` · ${c.product_count} ${t('products').toLowerCase()}`}
              </div>
            </button>
            <button
              onClick={() => onDelete(c.id)}
              className="rounded-full p-2 text-accent-600 hover:bg-accent-50"
              aria-label="delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>

      {editing && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-brand-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-card">
            <h2 className="text-base font-bold text-brand-900">
              {creating ? t('newCategory') : t('editCategory')}
            </h2>
            <div className="mt-3 space-y-2">
              <Field label={t('categoryFields.slug')}>
                <input
                  className="input"
                  value={editing.slug}
                  onChange={(e) =>
                    setEditing({ ...editing, slug: e.target.value })
                  }
                />
              </Field>
              <Field label={t('categoryFields.name_es')}>
                <input
                  className="input"
                  value={editing.name_es}
                  onChange={(e) =>
                    setEditing({ ...editing, name_es: e.target.value })
                  }
                />
              </Field>
              <Field label={t('categoryFields.name_en')}>
                <input
                  className="input"
                  value={editing.name_en}
                  onChange={(e) =>
                    setEditing({ ...editing, name_en: e.target.value })
                  }
                />
              </Field>
              <div className="grid grid-cols-2 gap-2">
                <Field label={t('categoryFields.icon')}>
                  <input
                    className="input"
                    value={editing.icon || ''}
                    onChange={(e) =>
                      setEditing({ ...editing, icon: e.target.value })
                    }
                    placeholder="leaf, sun, tree…"
                  />
                </Field>
                <Field label={t('categoryFields.sort_order')}>
                  <input
                    type="number"
                    className="input"
                    value={editing.sort_order}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        sort_order: parseInt(e.target.value, 10) || 0,
                      })
                    }
                  />
                </Field>
              </div>
              <label className="flex items-center justify-between gap-2 rounded-xl bg-brand-50 px-3 py-2">
                <span className="text-xs font-semibold text-brand-800">
                  {t('categoryFields.is_active')}
                </span>
                <input
                  type="checkbox"
                  checked={editing.is_active}
                  onChange={(e) =>
                    setEditing({ ...editing, is_active: e.target.checked })
                  }
                  className="h-4 w-4 accent-brand-600"
                />
              </label>
              {error && (
                <div className="rounded-xl bg-accent-50 p-2 text-xs font-semibold text-accent-700">
                  {error}
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setEditing(null);
                  setCreating(false);
                  setError(null);
                }}
                className="btn-outline"
              >
                {tCommon('cancel')}
              </button>
              <button onClick={onSave} className="btn-primary">
                {t('save')}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .input {
          width: 100%;
          background: #fff;
          border: 1px solid rgb(184 220 182);
          border-radius: 0.75rem;
          padding: 0.625rem 0.75rem;
          font-size: 0.875rem;
          color: rgb(20 58 20);
          outline: none;
        }
        .input:focus {
          border-color: rgb(95 169 92);
        }
      `}</style>
    </AdminShell>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-brand-800">
        {label}
      </span>
      {children}
    </label>
  );
}
