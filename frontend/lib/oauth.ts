import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import type { Provider } from '@supabase/supabase-js';
import { supabase } from './supabase';

WebBrowser.maybeCompleteAuthSession();

export async function signInWithOAuthProvider(provider: Provider): Promise<void> {
  const redirectTo = Linking.createURL('/');

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo, skipBrowserRedirect: true },
  });

  if (error) throw error;

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

  if (result.type !== 'success') {
    throw new Error(`Sign-in did not complete (${result.type}).`);
  }

  if (__DEV__) {
    console.log('[oauth] redirect URL:', result.url);
  }

  const url = new URL(result.url);

  const code = url.searchParams.get('code');
  if (code) {
    const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
    if (sessionError) throw sessionError;
    return;
  }

  const hashIndex = result.url.indexOf('#');
  if (hashIndex !== -1) {
    const hashParams = new URLSearchParams(result.url.substring(hashIndex + 1));
    const access_token = hashParams.get('access_token');
    const refresh_token = hashParams.get('refresh_token');

    if (access_token && refresh_token) {
      const { error: sessionError } = await supabase.auth.setSession({ access_token, refresh_token });
      if (sessionError) throw sessionError;
      return;
    }
  }

  const oauthError = url.searchParams.get('error_description') || url.searchParams.get('error');
  throw new Error(oauthError ?? 'No session data was returned.');
}
