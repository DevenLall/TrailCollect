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

  const hashIndex = result.url.indexOf('#');
  if (hashIndex === -1) {
    throw new Error('No session data was returned.');
  }

  const params = new URLSearchParams(result.url.substring(hashIndex + 1));
  const access_token = params.get('access_token');
  const refresh_token = params.get('refresh_token');

  if (!access_token || !refresh_token) {
    throw new Error('Missing session tokens.');
  }

  const { error: sessionError } = await supabase.auth.setSession({ access_token, refresh_token });
  if (sessionError) throw sessionError;
}
