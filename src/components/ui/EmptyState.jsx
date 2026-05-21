import React from 'react';
import { PackageOpen } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function EmptyState({ 
  icon: Icon = PackageOpen, 
  title = "No data found", 
  description = "There is currently nothing to display here.", 
  actionLabel, 
  onAction 
}) {
  return (
    <div className="flex w-full flex-col items-center justify-center rounded-[32px] border border-dashed border-border bg-bg/50 py-16 px-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-surface shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        <Icon size={32} className="text-muted" strokeWidth={1.5} />
      </div>
      
      <h3 className="mb-2 text-[20px] font-bold text-text">
        {title}
      </h3>
      
      <p className="mb-6 max-w-md text-[14px] leading-relaxed text-muted">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
