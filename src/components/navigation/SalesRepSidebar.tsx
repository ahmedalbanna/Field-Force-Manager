'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, CalendarDays, Users, Presentation, Package, UserCircle, LogOut, Settings, ChevronDown, ChevronRight } from 'lucide-react';
import { AppLogo } from '@/components/AppLogo';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/rep/dashboard', label: 'Dashboard', icon: Home },
  { href: '/rep/my-plan', label: 'My Plan', icon: CalendarDays },
  { href: '/rep/clients', label: 'Clients', icon: Users },
  { href: '/rep/materials', label: 'Promo Materials', icon: Presentation },
  { href: '/rep/products', label: 'Products', icon: Package },
];

const bottomNavItems = [
  { href: '/profile', label: 'Profile', icon: UserCircle },
  { href: '#', label: 'Settings', icon: Settings },
];

export function SalesRepSidebar() {
  const pathname = usePathname();
  const router = useRouter();
   const [openCollapsibles, setOpenCollapsibles] = useState<Record<string, boolean>>({});

  const handleLogout = () => {
    // Mock logout
    router.push('/login');
  };

  const toggleCollapsible = (label: string) => {
    setOpenCollapsibles(prev => ({ ...prev, [label]: !prev[label] }));
  };
  
  const renderNavItem = (item: typeof navItems[0] | typeof bottomNavItems[0], isSubItem = false) => {
    const isActive = pathname === item.href || (item.href !== '/rep/dashboard' && pathname.startsWith(item.href || ''));
    
    // Example for future collapsible items, not used in current SalesRepSidebar structure
    // if ('subItems' in item && item.subItems) { ... }

    return (
      <Link href={item.href || '#'} key={item.label}>
        <Button
          variant="ghost"
           className={cn(
            "w-full justify-start text-base rounded-md",
            isSubItem ? "px-3 py-2" : "px-3 py-2.5",
            isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground"
          )}
          onClick={item.label === 'Settings' ? (e) => e.preventDefault() : undefined}
        >
          <item.icon className="mr-3 h-5 w-5" />
          {item.label}
        </Button>
      </Link>
    );
  };


  return (
    <aside className="fixed inset-y-0 left-0 z-10 flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-lg">
      <div className="p-4 border-b border-sidebar-border">
         <AppLogo className="justify-center" />
      </div>
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        {navItems.map(item => renderNavItem(item))}
      </nav>
      <div className="mt-auto border-t border-sidebar-border p-3 space-y-1">
        {bottomNavItems.map(item => renderNavItem(item))}
        <Button
          variant="ghost"
          className="w-full justify-start text-base px-3 py-2.5 rounded-md hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
