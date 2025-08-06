'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils/cn';
import { NAV_ITEMS } from '@/lib/constants';

export function Navigation() {
  const pathname = usePathname();
  const { user, isViewer } = useAuth();

  return (
    <nav className="glass border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center hover-scale">
              <Image
                src="/hedgehox-logo.svg"
                alt="Hedgehox Logo"
                width={160}
                height={40}
                className="mr-12"
              />
            </Link>
            
            <div className="hidden sm:flex sm:space-x-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 hover-lift',
                    pathname === item.href
                      ? 'bg-white/80 text-primary-700 shadow-lg backdrop-blur-sm'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-white/40'
                  )}
                >
                  <span className="relative z-10">{item.label}</span>
                  {pathname === item.href && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-400/20 to-secondary-400/20 rounded-xl"></div>
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 bg-white/40 backdrop-blur-sm rounded-xl px-4 py-2">
              <div className="text-right">
                <div className="text-sm font-medium text-slate-800">
                  {user?.name || user?.email}
                </div>
                <div className={cn(
                  'text-xs font-medium',
                  isViewer 
                    ? 'text-secondary-600' 
                    : 'text-primary-600'
                )}>
                  {isViewer ? 'Viewer' : 'Contributor'}
                </div>
              </div>
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm',
                isViewer 
                  ? 'bg-gradient-to-r from-secondary-400 to-secondary-600' 
                  : 'bg-gradient-to-r from-primary-400 to-primary-600'
              )}>
                {(user?.name || user?.email || '').charAt(0).toUpperCase()}
              </div>
            </div>
            
            <button
              onClick={() => signOut({ callbackUrl: '/auth/signin' })}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 bg-white/40 hover:bg-white/60 rounded-xl transition-all duration-300 hover-lift backdrop-blur-sm"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}