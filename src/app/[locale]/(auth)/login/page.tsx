'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ClostraLogo } from '@/components/ui/clostra-logo';

export default function LoginPage() {
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F6F8] px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <ClostraLogo size={44} />
          <h1 className="mt-4 text-lg font-semibold text-text-primary">{tCommon('app_name')}</h1>
          <p className="mt-1 text-sm text-text-tertiary">{t('welcome_back')}</p>
        </div>

        {/* Form */}
        <div className="rounded-xl border border-border-subtle bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary">{t('email')}</label>
              <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-text-secondary">{t('password')}</label>
                <button type="button" className="text-xs font-medium text-brand hover:text-brand-hover transition-colors">{t('forgot_password')}</button>
              </div>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
            </div>
            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>{t('sign_in')}</Button>
          </form>
        </div>

        {/* Locale */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-text-muted">
          <Link href={pathname} locale="fr" className="hover:text-text-secondary transition-colors">FR</Link>
          <span>|</span>
          <Link href={pathname} locale="en" className="hover:text-text-secondary transition-colors">EN</Link>
        </div>
      </div>
    </div>
  );
}
