'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowLeft, Star, Trash2, Upload, Video } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { AdminShell } from '@/components/admin/AdminShell';
import { api, ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import type { Category, Product, StockStatus } from '@/lib/types';
import { cn } from '@/lib/format';
import { resolveMediaUrl } from '@/lib/media';

interface Props {
  productId: string | null;
}

interface FormState {
  name_es: string;
  name_en: string;
  description_es: string;
  description_en: string;
  category_id: string | '';
  retail_price: string;
  wholesale_price: string;
  pot_size: string;
  stock_status: StockStatus;
  promotion_text: string;
  is_active: boolean;
  is_featured: boolean;
}

const empty: FormState = {
  name_es: '',
  name_en: '',
  description_es: '',
  description_en: '',
  category_id: '',
  retail_price: '0',
  wholesale_price: '0',
  pot_size: '',
  stock_status: 'in_stock',
  promotion_text: '',
  is_active: true,
  is_featured: false,
};

const stockOptions: StockStatus[] = ['in_stock', 'low_stock', 'out_of_stock'];

export function AdminProductForm({ productId }: Props) {
  const t = useTranslations('admin');
  const tProduct = useTranslations('product');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const adminToken = useAuth((s) => s.adminToken);
  const localePrefix = locale === 'es' ? '' : `/${locale}`;

  const [form, setForm] = useState<FormState>(empty);
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(!!productId);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [pendingPreviews, setPendingPreviews] = useState<string[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);

  const isEdit = !!productId;

  useEffect(() => {
    let cancelled = false;
    api.listCategories(adminToken).then((c) => !cancelled && setCategories(c.data));
    if (productId && adminToken) {
      api
        .getProduct(productId, adminToken)
        .then((res) => {
          if (cancelled) return;
          const p = res.data;
          setProduct(p);
          setForm({
            name_es: p.name_es,
            name_en: p.name_en,
            description_es: p.description_es ?? '',
            description_en: p.description_en ?? '',
            category_id: p.category_id ?? '',
            retail_price: String(p.retail_price),
            wholesale_price: String(p.wholesale_price ?? 0),
            pot_size: p.pot_size ?? '',
            stock_status: p.stock_status,
            promotion_text: p.promotion_text ?? '',
            is_active: p.is_active,
            is_featured: p.is_featured,
          });
        })
        .finally(() => !cancelled && setLoading(false));
    }
    return () => {
      cancelled = true;
    };
  }, [productId, adminToken]);

  useEffect(() => {
    return () => {
      pendingPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [pendingPreviews]);

  const attachImages = async (
    targetProduct: Product,
    files: File[],
    altText: string
  ) => {
    if (!adminToken || !files.length) return targetProduct;

    const res = await api.upload(adminToken, files);
    let imageCount = targetProduct.images.length;

    for (const item of res.data) {
      await api.addProductImage(adminToken, targetProduct.id, {
        url: item.url,
        is_video: item.is_video,
        alt_text: altText,
        is_primary: imageCount === 0,
      });
      imageCount += 1;
    }

    const refreshed = await api.getProduct(targetProduct.id, adminToken);
    return refreshed.data;
  };

  const clearPendingFiles = () => {
    pendingPreviews.forEach((url) => URL.revokeObjectURL(url));
    setPendingFiles([]);
    setPendingPreviews([]);
    if (fileInput.current) fileInput.current.value = '';
  };

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((s) => ({ ...s, [k]: v }));

  const onSave = async () => {
    if (!adminToken) return;
    setSaving(true);
    setError(null);
    try {
      const body = {
        name_es: form.name_es,
        name_en: form.name_en,
        description_es: form.description_es || null,
        description_en: form.description_en || null,
        category_id: form.category_id || null,
        retail_price: parseFloat(form.retail_price) || 0,
        wholesale_price: parseFloat(form.wholesale_price) || 0,
        pot_size: form.pot_size || null,
        stock_status: form.stock_status,
        promotion_text: form.promotion_text || null,
        is_active: form.is_active,
        is_featured: form.is_featured,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;

      if (isEdit && productId) {
        const res = await api.updateProduct(adminToken, productId, body);
        setProduct(res.data);
      } else {
        const res = await api.createProduct(adminToken, body);
        let created = res.data;

        if (pendingFiles.length) {
          created = await attachImages(created, pendingFiles, form.name_es);
          clearPendingFiles();
        }

        setProduct(created);
        router.replace(`${localePrefix}/admin/products/${created.id}`);
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!adminToken || !productId) return;
    if (!confirm(t('confirmDelete'))) return;
    await api.deleteProduct(adminToken, productId);
    router.replace(`${localePrefix}/admin/products`);
  };

  const onFiles = async (files: FileList | null) => {
    if (!files?.length || !adminToken) return;

    const arr = Array.from(files);

    if (!product) {
      pendingPreviews.forEach((url) => URL.revokeObjectURL(url));
      setPendingFiles(arr);
      setPendingPreviews(arr.map((file) => URL.createObjectURL(file)));
      if (fileInput.current) fileInput.current.value = '';
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const refreshed = await attachImages(product, arr, form.name_es);
      setProduct(refreshed);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  const removePendingFile = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
    setPendingPreviews((prev) => {
      const next = [...prev];
      const [removed] = next.splice(index, 1);
      if (removed) URL.revokeObjectURL(removed);
      return next;
    });
  };

  const removeImage = async (imageId: string) => {
    if (!adminToken || !product) return;
    await api.removeProductImage(adminToken, product.id, imageId);
    const refreshed = await api.getProduct(product.id, adminToken);
    setProduct(refreshed.data);
  };
  const setPrimary = async (imageId: string) => {
    if (!adminToken || !product) return;
    await api.setPrimaryImage(adminToken, product.id, imageId);
    const refreshed = await api.getProduct(product.id, adminToken);
    setProduct(refreshed.data);
  };

  if (loading) {
    return (
      <AdminShell>
        <div className="h-96 animate-pulse rounded-3xl bg-brand-50" />
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <Link
        href={`${localePrefix}/admin/products`}
        className="mb-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-700"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('products')}
      </Link>

      <h1 className="text-lg font-bold text-brand-900">
        {isEdit ? t('editProduct') : t('newProduct')}
      </h1>

      <div className="mt-3 space-y-3">
        <Field label={t('fields.name_es')}>
          <input
            type="text"
            value={form.name_es}
            onChange={(e) => update('name_es', e.target.value)}
            className="input"
          />
        </Field>
        <Field label={t('fields.name_en')}>
          <input
            type="text"
            value={form.name_en}
            onChange={(e) => update('name_en', e.target.value)}
            className="input"
          />
        </Field>
        <Field label={t('fields.category')}>
          <select
            value={form.category_id}
            onChange={(e) => update('category_id', e.target.value)}
            className="input"
          >
            <option value="">— {t('noCategory')} —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {locale === 'es' ? c.name_es : c.name_en}
              </option>
            ))}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t('fields.retail_price')}>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.retail_price}
              onChange={(e) => update('retail_price', e.target.value)}
              className="input"
            />
          </Field>
          <Field label={t('fields.wholesale_price')}>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.wholesale_price}
              onChange={(e) => update('wholesale_price', e.target.value)}
              className="input"
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t('fields.pot_size')}>
            <input
              type="text"
              value={form.pot_size}
              onChange={(e) => update('pot_size', e.target.value)}
              className="input"
              placeholder="Maceta #12"
            />
          </Field>
          <Field label={t('fields.stock_status')}>
            <select
              value={form.stock_status}
              onChange={(e) =>
                update('stock_status', e.target.value as StockStatus)
              }
              className="input"
            >
              {stockOptions.map((s) => (
                <option key={s} value={s}>
                  {tProduct(`stock.${s}` as 'stock.in_stock')}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label={t('fields.promotion_text')}>
          <input
            type="text"
            value={form.promotion_text}
            onChange={(e) => update('promotion_text', e.target.value)}
            className="input"
            placeholder="Más vendido / Oferta / Nuevo"
          />
        </Field>
        <Field label={t('fields.description_es')}>
          <textarea
            rows={2}
            value={form.description_es}
            onChange={(e) => update('description_es', e.target.value)}
            className="input"
          />
        </Field>
        <Field label={t('fields.description_en')}>
          <textarea
            rows={2}
            value={form.description_en}
            onChange={(e) => update('description_en', e.target.value)}
            className="input"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Toggle
            label={t('fields.is_active')}
            checked={form.is_active}
            onChange={(v) => update('is_active', v)}
          />
          <Toggle
            label={t('fields.is_featured')}
            checked={form.is_featured}
            onChange={(v) => update('is_featured', v)}
          />
        </div>

        {/* Images */}
        <div className="space-y-2 rounded-2xl bg-white p-3 shadow-soft ring-1 ring-brand-100">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-brand-900">
              {t('fields.images')}
            </span>
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={uploading || saving}
              className="btn-outline !py-1.5 !px-3 !text-xs"
            >
              <Upload className="h-3.5 w-3.5" />
              {uploading ? tCommon('loading') : t('fields.uploadImages')}
            </button>
            <input
              ref={fileInput}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={(e) => onFiles(e.target.files)}
              className="hidden"
            />
          </div>

          {!product && pendingPreviews.length === 0 && (
            <p className="text-xs text-brand-700/60">
              {t('fields.imagesCreateHint')}
            </p>
          )}

          {pendingPreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {pendingPreviews.map((preview, index) => (
                <div
                  key={preview}
                  className="group relative aspect-square overflow-hidden rounded-xl bg-brand-50 ring-1 ring-brand-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePendingFile(index)}
                    className="absolute right-1 top-1 rounded-full bg-white/90 p-1 text-accent-600 opacity-0 transition group-hover:opacity-100"
                    aria-label="remove"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  {!product && (
                    <span className="absolute left-1 top-1 rounded-full bg-brand-700/90 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                      {t('fields.pendingUpload')}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {product && product.images.length === 0 && pendingPreviews.length === 0 ? (
            <p className="text-xs text-brand-700/60">No images yet.</p>
          ) : null}

          {product && product.images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {product.images.map((img) => (
                <div
                  key={img.id}
                  className={cn(
                    'group relative aspect-square overflow-hidden rounded-xl bg-brand-50 ring-1',
                    img.is_primary
                      ? 'ring-brand-600'
                      : 'ring-brand-100'
                  )}
                >
                  {img.is_video ? (
                    <div className="grid h-full place-items-center text-brand-700">
                      <Video className="h-6 w-6" />
                    </div>
                  ) : (
                    <Image
                      src={resolveMediaUrl(img.url)}
                      alt={img.alt_text || ''}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  )}
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/50 p-1 opacity-0 transition group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => setPrimary(img.id)}
                      className="rounded-full bg-white/90 p-1 text-brand-700"
                      aria-label="set primary"
                    >
                      <Star
                        className={cn(
                          'h-3.5 w-3.5',
                          img.is_primary && 'fill-current text-brand-700'
                        )}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="rounded-full bg-white/90 p-1 text-accent-600"
                      aria-label="remove"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  {img.is_primary && (
                    <span className="absolute left-1 top-1 rounded-full bg-brand-700 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                      {t('fields.primary')}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="rounded-xl bg-accent-50 p-3 text-xs font-semibold text-accent-700">
            {error}
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="btn-primary flex-1 !py-3"
          >
            {saving ? t('saving') : t('save')}
          </button>
          {isEdit && (
            <button
              type="button"
              onClick={onDelete}
              className="btn !py-3 !px-4 bg-accent-50 text-accent-700 hover:bg-accent-100"
            >
              <Trash2 className="h-4 w-4" />
              {t('delete')}
            </button>
          )}
        </div>
      </div>

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

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 ring-1 ring-brand-100">
      <span className="text-xs font-semibold text-brand-800">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-6 w-10 rounded-full transition',
          checked ? 'bg-brand-600' : 'bg-brand-200'
        )}
        aria-pressed={checked}
      >
        <span
          className={cn(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition',
            checked ? 'left-[1.125rem]' : 'left-0.5'
          )}
        />
      </button>
    </label>
  );
}
