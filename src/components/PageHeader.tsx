import type { ReactNode } from 'react';
import { UserButton } from '@clerk/nextjs';
import { SearchInput } from './SearchInput';

type Props = {
  eyebrow: string;
  title: string;
  lede: string;
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  actions?: ReactNode;
  showUserButton?: boolean;
};

export function PageHeader({
  eyebrow,
  title,
  lede,
  search,
  onSearchChange,
  searchPlaceholder,
  actions,
  showUserButton = true,
}: Props) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-6">
      <div>
        <div className="mb-2 text-[11px] font-extrabold tracking-[0.08em] text-accent">
          {eyebrow}
        </div>
        <h1 className="mb-2 text-2xl font-extrabold tracking-tight md:text-[30px]">{title}</h1>
        <p className="max-w-md text-sm leading-relaxed text-muted">{lede}</p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {onSearchChange && (
          <SearchInput value={search ?? ''} onChange={onSearchChange} placeholder={searchPlaceholder} />
        )}

        {actions}

        {showUserButton && <UserButton />}
      </div>
    </div>
  );
}
