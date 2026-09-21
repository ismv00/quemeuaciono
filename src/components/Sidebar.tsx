'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { OrganizationSwitcher, UserButton } from '@clerk/nextjs';
import { Calendar, LayoutGrid, PhoneCall, Settings, Users } from 'lucide-react';

const navItems = [
  { label: 'Calendário', icon: Calendar, path: '' },
  { label: 'Analistas', icon: Users, path: '/analistas' },
  { label: 'Relatórios', icon: LayoutGrid, path: '/relatorios' },
  { label: 'Configurações', icon: Settings, path: '/configuracoes' },
];

export function Sidebar() {
  const pathname = usePathname();
  const params = useParams<{ empresa: string }>();
  const empresa = params.empresa;

  return (
    <nav
      aria-label="Navegação principal"
      className="hidden w-64 shrink-0 flex-col bg-sidebar px-5 py-7 lg:flex"
    >
      <div className="mb-8 flex items-center gap-2.5 px-1.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-accent">
          <PhoneCall size={18} className="text-white" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[15px] font-extrabold text-white">Quem eu aciono?</span>
          <span className="text-[11px] font-semibold text-sidebar-muted">Plantão técnico</span>
        </div>
      </div>

      <div className="mb-6">
        <OrganizationSwitcher
          hidePersonal
          afterSelectOrganizationUrl="/:slug"
          afterCreateOrganizationUrl="/:slug"
          appearance={{ elements: { rootBox: 'w-full', organizationSwitcherTrigger: 'w-full' } }}
        />
      </div>

      <div className="flex flex-col gap-1">
        {navItems.map(({ label, icon: Icon, path }) => {
          const href = `/${empresa}${path}`;
          const active = pathname === href || (path !== '' && pathname.startsWith(`${href}/`));
          const itemClass = `flex items-center gap-3 rounded-[10px] px-3.5 py-2.5 text-sm font-semibold ${
            active ? 'bg-sidebar-active text-white' : 'text-sidebar-muted'
          }`;

          return (
            <Link key={label} href={href} aria-current={active ? 'page' : undefined} className={itemClass}>
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </div>

      <div className="grow" />

      <div className="mb-4 flex w-fit items-center gap-2 rounded-full bg-sidebar-pill px-3 py-2 text-[11px] font-bold text-sidebar-text">
        <span className="h-2.5 w-2.5 rounded-full border-[3px] border-accent" />
        Suporte 24/7 nos fins de semana
      </div>

      <div className="flex items-center gap-2.5 rounded-xl bg-sidebar-profile p-2.5">
        <UserButton
          appearance={{ elements: { userButtonBox: 'flex-row-reverse', userButtonOuterIdentifier: 'text-white' } }}
          showName
        />
      </div>
    </nav>
  );
}
