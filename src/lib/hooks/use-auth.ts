'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useRouter } from '@/i18n/navigation';

export function useAuth() {
  const { profile, role, isLoading, setProfile, clearProfile } =
    useAuthStore();
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    async function fetchSession() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (mounted) clearProfile();
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (mounted) {
        setProfile(profileData ?? null);
      }
    }

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session?.user) {
        if (mounted) clearProfile();
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (mounted) {
        setProfile(profileData ?? null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, setProfile, clearProfile]);

  const signOut = async () => {
    await supabase.auth.signOut();
    clearProfile();
    router.push('/login');
  };

  return {
    user: profile,
    profile,
    role,
    isLoading,
    signOut,
  };
}
