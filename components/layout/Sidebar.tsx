'use client';

import React from 'react';
import Link from 'next/link';

export interface SidebarProps {
  items?: Array<{
    label: string;
    href: string;
    icon?: string;
  }>;
}

export function Sidebar({ items = [] }: SidebarProps) {
  return (
    <aside className="sidebar">
      <nav>
        {items.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.icon && <span className="icon">{item.icon}</span>}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
