'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ShoppingBag, Package, Users, LogOut, BarChart3 } from 'lucide-react';
import { signOut } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: BarChart3,
  },
  {
    name: 'Products',
    href: '/dashboard/products',
    icon: Package,
  },
  {
    name: 'Rentals',
    href: '/dashboard/rentals',
    icon: Users,
  },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const isActivePath = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <div className="sticky top-0 h-screen w-72 flex-shrink-0 bg-white border-r border-gray-200 shadow-sm">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center px-6 py-5 border-b border-gray-200">
          <div className="flex items-center">
            <div className="p-2.5 bg-blue-600 rounded-xl shadow-sm">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <div className="ml-3 leading-tight">
              <h1 className="text-lg font-semibold text-gray-900">Staff Rental</h1>
              <p className="text-xs text-gray-500">Product Tracker</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => {
            const active = isActivePath(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center px-3.5 py-2.5 text-sm font-medium rounded-lg transition-colors',
                  active
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                )}
              >
                <item.icon className={cn('h-5 w-5 mr-3', active ? 'text-white' : 'text-gray-500')} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="px-4 py-4 border-t border-gray-200">
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-3.5 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:text-gray-900 hover:bg-gray-50 transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3 text-gray-500" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};