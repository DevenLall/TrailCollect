import { useState } from 'react';
import { StyleSheet, Text, View, Image, Modal, TextInput, Pressable, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { supabase } from '../lib/supabase';

WebBrowser.maybeCompleteAuthSession();

type Props = {
  visible: boolean;
  onSubmit: () => void;
};

export default function SignUpSheet({ visible, onSubmit }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreateAccount = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Information', 'Please enter both an email and password.');
      return;
    }
    if (!agreed) {
      Alert.alert('Terms Required', 'You must agree to the Terms of Service & Privacy Policy to continue.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (error) {
      Alert.alert('Sign Up Failed', error.message);
      return;
    }
    onSubmit();
  };

  const handleGoogleSignIn = async () => {
  const redirectTo = Linking.createURL('/');
  console.log('REDIRECT TO:', redirectTo);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });

  if (error) {
    Alert.alert('Google Sign-In Failed', error.message);
    return;
  }

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  console.log('AUTH SESSION RESULT:', result);

  if (result.type === 'success') {
    const url = new URL(result.url);
    const code = url.searchParams.get('code');

    if (!code) {
      Alert.alert('Google Sign-In Failed', 'No authorization code was returned.');
      return;
    }

    const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

    if (sessionError) {
      Alert.alert('Google Sign-In Failed', sessionError.message);
      return;
    }

    onSubmit();
  }
  else {
  Alert.alert('Google Sign-In', `Sign-in did not complete (${result.type}).`);
}
};

  return (
    <>
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.backdrop}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Image source={require('../assets/trailcollect-icon.png')} style={styles.cardIcon} />
              <Text style={styles.cardWordmark}>TRAILCOLLECT</Text>
            </View>

            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to track and collect your trail completions</Text>

            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={18} color="#6B7280" />
              <TextInput
                style={styles.input}
                placeholder="name@example.com"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color="#6B7280" />
              <TextInput
                style={styles.input}
                placeholder="Must be at least 8 characters"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <Pressable onPress={() => setShowPassword((prev) => !prev)}>
                <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={18} color="#6B7280" />
              </Pressable>
            </View>

            <View style={styles.checkboxRow}>
              <Pressable
                onPress={() => setAgreed((prev) => !prev)}
                style={[styles.checkbox, agreed && styles.checkboxChecked]}
              />
              <Text style={styles.checkboxLabel}>
                I agree to the{' '}
                <Text style={styles.link} onPress={() => setShowTerms(true)}>
                  Terms of Service & Privacy Policy
                </Text>
              </Text>
            </View>

            <Pressable style={styles.button} onPress={handleCreateAccount} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? 'Creating Account...' : 'Create Account'}</Text>
            </Pressable>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialRow}>
              <Pressable style={styles.socialButton} onPress={handleGoogleSignIn}>
                <Text style={styles.socialButtonText}>Google</Text>
              </Pressable>
              <Pressable style={styles.socialButton}>
                <Text style={styles.socialButtonText}>Strava</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showTerms} animationType="slide">
        <SafeAreaView style={styles.termsContainer}>
          <View style={styles.termsHeader}>
            <Text style={styles.termsTitle}>Terms of Service & Privacy Policy</Text>
            <Pressable onPress={() => setShowTerms(false)}>
              <Ionicons name="close" size={24} color="#011627" />
            </Pressable>
          </View>
          <ScrollView style={styles.termsScroll}>
            <Text style={styles.termsText}>
              This is placeholder text standing in for TrailCollect's real Terms of Service
              and Privacy Policy. These are legal documents with real weight, so the actual
              wording needs to be written or reviewed by a lawyer before this app goes out
              to real users — this screen exists right now just to prove the tap-through
              flow works correctly.
            </Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end' },
  card: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  cardIcon: { width: 28, height: 28, resizeMode: 'contain', marginRight: 8 },
  cardWordmark: { fontSize: 14, fontFamily: 'BowlbyOneSC_400Regular', color: '#011627', letterSpacing: 1 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#011627', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#6B7280', marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', color: '#011627', marginBottom: 6 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    gap: 8,
  },
  input: { flex: 1, fontSize: 14, color: '#011627' },
  checkboxRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20, gap: 8 },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: '#9CA3AF', marginTop: 2 },
  checkboxChecked: { backgroundColor: '#011627', borderColor: '#011627' },
  checkboxLabel: { flex: 1, fontSize: 12, color: '#6B7280' },
  link: { color: '#2563EB', textDecorationLine: 'underline' },
  button: { backgroundColor: '#011627', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 8 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  dividerText: { fontSize: 11, color: '#9CA3AF', letterSpacing: 0.5 },
  socialRow: { flexDirection: 'row', gap: 12 },
  socialButton: { flex: 1, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  socialButtonText: { fontSize: 14, fontWeight: '600', color: '#011627' },
  termsContainer: { flex: 1, backgroundColor: '#FFFFFF' },
  termsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  termsTitle: { fontSize: 18, fontWeight: 'bold', color: '#011627', flex: 1, marginRight: 12 },
  termsScroll: { paddingHorizontal: 20 },
  termsText: { fontSize: 14, color: '#374151', lineHeight: 22 },
});