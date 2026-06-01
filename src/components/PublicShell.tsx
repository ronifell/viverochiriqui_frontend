import { Header } from './Header';
import { BottomNav } from './BottomNav';

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fafdf8]">
      <Header />
      <main className="container-app pb-28 pt-3 lg:pb-8 lg:pt-6">{children}</main>
      <BottomNav />
    </div>
  );
}
