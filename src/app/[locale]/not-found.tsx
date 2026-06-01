import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-brand-50 px-4 py-10 text-center">
      <div className="max-w-sm">
        <h1 className="font-display text-3xl font-extrabold text-brand-900">
          404
        </h1>
        <p className="mt-2 text-sm text-brand-700/80">
          Página no encontrada / Page not found
        </p>
        <Link href="/" className="btn-primary mt-4">
          Inicio / Home
        </Link>
      </div>
    </div>
  );
}
