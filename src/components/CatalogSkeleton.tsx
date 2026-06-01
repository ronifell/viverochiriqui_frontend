import { PublicShell } from '@/components/PublicShell';

export function CatalogSkeleton() {
  return (
    <PublicShell>
      <div className="animate-pulse space-y-4">
        <div className="h-12 rounded-2xl bg-brand-50" />
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 w-16 shrink-0 rounded-2xl bg-brand-50" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-72 rounded-2xl bg-brand-50" />
          ))}
        </div>
      </div>
    </PublicShell>
  );
}
