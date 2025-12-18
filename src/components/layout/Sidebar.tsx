'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Search,
  Film,
  Tv,
  Library,
  Settings,
  Flame,
  Menu
} from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Search, label: 'Search', href: '/search' },
  { icon: Flame, label: 'Trending', href: '/trending' },
  { icon: Film, label: 'Movies', href: '/movies' },
  { icon: Tv, label: 'TV Shows', href: '/tv' },
  { icon: Library, label: 'Library', href: '/library' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[var(--z-sticky)] bg-[var(--bg-elevated)] border-t border-[var(--border-subtle)] px-4 pb-safe">
        <div className="flex justify-around items-center h-16">
          {NAV_ITEMS.slice(0, 5).map(({ icon: Icon, href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-1 p-2 rounded-full transition-colors ${isActive ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'
                  }`}
              >
                <Icon size={24} strokeWidth={2} />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Sidebar Rail */}
      <aside
        className={`hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-[var(--z-sticky)] bg-[var(--bg-glass)] backdrop-blur-xl border-r border-[var(--border-subtle)] transition-all duration-300 ease-in-out ${isExpanded ? 'w-64' : 'w-20'
          }`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Logo Area */}
        <div className={`h-20 flex items-center ${isExpanded ? 'px-6' : 'justify-center'}`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center shrink-0">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span
              className={`font-bold text-lg tracking-wide whitespace-nowrap transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
                }`}
            >
              Wyvern
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 flex flex-col gap-2 px-3 py-6">
          {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-label={label}
                className={`flex items-center gap-4 p-3 rounded-[var(--radius-md)] transition-all duration-200 group relative ${isActive
                    ? 'bg-[var(--accent)] text-white shadow-[0_0_15px_rgba(236,117,50,0.3)]'
                    : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-white'
                  }`}
              >
                <Icon
                  size={24}
                  strokeWidth={2}
                  className={`shrink-0 transition-transform duration-200 ${!isActive && 'group-hover:scale-110'
                    }`}
                />
                <span
                  className={`font-medium whitespace-nowrap transition-all duration-200 ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 absolute left-12'
                    }`}
                >
                  {label}
                </span>

                {/* Tooltip for collapsed state */}
                {!isExpanded && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-[var(--bg-elevated)] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none border border-[var(--border-subtle)]">
                    {label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer / User / Settings */}
        <div className="p-3 mt-auto">
          <button className="flex items-center gap-4 p-3 w-full rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:bg-white/5 hover:text-white transition-all">
            <Settings size={24} strokeWidth={2} className="shrink-0" />
            <span
              className={`font-medium whitespace-nowrap transition-all duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
                }`}
            >
              Settings
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
