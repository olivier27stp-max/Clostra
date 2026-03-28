'use client';

import { cn } from '@/lib/utils/cn';
import { Search, X, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterDropdownConfig {
  key: string;
  label: string;
  options: FilterOption[];
}

interface FilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: FilterDropdownConfig[];
  activeFilters?: Record<string, string>;
  onFilterChange?: (key: string, value: string) => void;
  onClearAll?: () => void;
  className?: string;
}

function FilterDropdown({
  config,
  value,
  onChange,
}: {
  config: FilterDropdownConfig;
  value?: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = config.options.find((o) => o.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors',
          value
            ? 'border-brand/25 bg-brand/5 text-brand'
            : 'border-border-subtle text-text-secondary hover:border-border hover:text-text-primary'
        )}
      >
        {selected?.label || config.label}
        <ChevronDown className="h-3 w-3" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="animate-scale-in absolute left-0 top-full z-40 mt-1 min-w-[160px] rounded-lg border border-border-subtle bg-surface-elevated p-1 shadow-xl shadow-black/30">
            <button
              onClick={() => {
                onChange('');
                setOpen(false);
              }}
              className={cn(
                'flex w-full rounded-md px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-surface-hover',
                !value ? 'text-brand' : 'text-text-secondary'
              )}
            >
              All
            </button>
            {config.options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={cn(
                  'flex w-full rounded-md px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-surface-hover',
                  value === option.value ? 'text-brand' : 'text-text-secondary'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters = [],
  activeFilters = {},
  onFilterChange,
  onClearAll,
  className,
}: FilterBarProps) {
  const hasActiveFilters = Object.values(activeFilters).some(Boolean);

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {/* Search */}
      <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
        <Input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="pl-8"
        />
      </div>

      {/* Filter dropdowns */}
      {filters.map((config) => (
        <FilterDropdown
          key={config.key}
          config={config}
          value={activeFilters[config.key]}
          onChange={(value) => onFilterChange?.(config.key, value)}
        />
      ))}

      {/* Clear all */}
      {hasActiveFilters && onClearAll && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-text-muted"
        >
          <X className="mr-1 h-3 w-3" />
          Clear
        </Button>
      )}
    </div>
  );
}
