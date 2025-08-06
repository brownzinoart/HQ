import { Navigation } from './Navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 py-8">
        {children}
      </main>
    </div>
  );
}