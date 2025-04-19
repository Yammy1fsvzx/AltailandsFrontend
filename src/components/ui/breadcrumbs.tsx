'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronRightIcon } from 'lucide-react'; // Or another separator icon

import { cn } from '@/lib/utils';

// Interface for BreadcrumbItem props
interface BreadcrumbItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  href?: string; 
  isCurrent?: boolean;
  children: React.ReactNode;
}

// Breadcrumbs Container Component
const Breadcrumbs = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, children, ...props }, ref) => (
  <nav aria-label="Breadcrumb" ref={ref} className={cn("text-sm", className)} {...props}>
    <ol className="flex items-center space-x-1.5">
      {/* Add separators automatically between children */} 
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return null;
        return (
          <React.Fragment key={index}>
            {child}
            {/* Add separator unless it's the last item */}
            {index < React.Children.count(children) - 1 && (
              <li aria-hidden="true">
                <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
              </li>
            )}
          </React.Fragment>
        );
      })}
    </ol>
  </nav>
));
Breadcrumbs.displayName = 'Breadcrumbs';

// Breadcrumb Item Component
const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  BreadcrumbItemProps
>(({ className, children, href, isCurrent = false, ...props }, ref) => {
  return (
    <li
      ref={ref}
      className={cn(
        'flex items-center',
        isCurrent ? 'text-emerald-600 font-medium' : 'text-muted-foreground hover:text-foreground',
        className
      )}
      aria-current={isCurrent ? 'page' : undefined}
      {...props}
    >
      {isCurrent || !href ? (
        // Render as span if current or no href
        <span>{children}</span>
      ) : (
        // Render as Link if not current and href exists
        <Link href={href} className="transition-colors">
          {children}
        </Link>
      )}
    </li>
  );
});
BreadcrumbItem.displayName = 'BreadcrumbItem';

export { Breadcrumbs, BreadcrumbItem };
