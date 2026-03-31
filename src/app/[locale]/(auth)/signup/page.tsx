'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ClostraLogo } from '@/components/ui/clostra-logo';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('passwords_mismatch'));
      return;
    }

    setIsLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
      return;
    }

    // After signup, redirect to onboarding to fill profile
    router.push('/onboarding');
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F6F8] px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <ClostraLogo size={44} />
          <h1 className="mt-4 text-lg font-semibold text-text-primary">{t('create_account')}</h1>
          <p className="mt-1 text-sm text-text-tertiary">{t('create_account_subtitle')}</p>
        </div>

        {/* Form */}
        <div className="rounded-xl border border-border-subtle bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-600">
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary">{t('email')}</label>
              <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-text-secondary">{t('password')}</label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" minLength={6} />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="confirm-password" className="block text-sm font-medium text-text-secondary">{t('confirm_password')}</label>
              <Input id="confirm-password" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required autoComplete="new-password" />
            </div>
            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>{t('sign_up')}</Button>
          </form>

          <p className="mt-4 text-center text-xs text-text-muted">
            {t('already_have_account')}{' '}
            <Link href="/login" className="font-medium text-brand hover:text-brand-hover transition-colors">
              {t('sign_in')}
            </Link>
          </p>
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
