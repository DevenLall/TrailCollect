import { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { requestOtp, verifyOtpCode } from '../lib/otp';

type Props = NativeStackScreenProps<RootStackParamList, 'Otp'>;

const RESEND_COOLDOWN_SECONDS = 59;
const CODE_LENGTH = 6;

function maskEmail(email: string) {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  return `${local.slice(0, 2)}***@${domain}`;
}

function formatCooldown(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function OtpScreen({ navigation, route }: Props) {
  const { email, origin } = route.params;

  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputsRef = useRef<Array<TextInput | null>>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    sendCode();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCooldown = () => {
    setCooldown(RESEND_COOLDOWN_SECONDS);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const sendCode = async () => {
    setSending(true);
    try {
      await requestOtp(email);
      startCooldown();
    } catch (err) {
      Alert.alert('Could Not Send Code', err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSending(false);
    }
  };

  const handleChangeDigit = (text: string, index: number) => {
    const sanitized = text.replace(/[^0-9]/g, '');

    setDigits((prev) => {
      const next = [...prev];
      next[index] = sanitized.slice(-1);
      return next;
    });

    if (sanitized && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && digits[index] === '' && index > 0) {
      inputsRef.current[index - 1]?.focus();
      setDigits((prev) => {
        const next = [...prev];
        next[index - 1] = '';
        return next;
      });
    }
  };

  const handleVerify = async () => {
    const code = digits.join('');
    if (code.length !== CODE_LENGTH) {
      Alert.alert('Enter Code', 'Please enter the 6-digit code we emailed you.');
      return;
    }

    setVerifying(true);
    try {
      await verifyOtpCode(email, code);
      navigation.replace(origin === 'signup' ? 'ProfileCreation' : 'Home');
    } catch (err) {
      Alert.alert('Verification Failed', err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.backButton}>
          <Ionicons name="chevron-back" size={20} color="#011627" />
        </Pressable>
      </View>

      <View style={styles.iconSection}>
        <Image source={require('../assets/trailcollect-icon.png')} style={styles.icon} />
        <View style={styles.wordmarkRow}>
          <Image source={require('../assets/trailcollect-icon.png')} style={styles.miniIcon} />
          <Text style={styles.wordmark}>TRAILCOLLECT</Text>
        </View>
      </View>

      <Text style={styles.title}>Verify Your Email</Text>
      <Text style={styles.subtitle}>
        Enter the 6-digit code sent to <Text style={styles.subtitleEmail}>{maskEmail(email)}</Text>
      </Text>

      <View style={styles.codeRow}>
        {digits.map((digit, index) => (
          <TextInput
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            style={[styles.codeBox, focusedIndex === index && styles.codeBoxFocused]}
            value={digit}
            onChangeText={(text) => handleChangeDigit(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex((prev) => (prev === index ? null : prev))}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
          />
        ))}
      </View>

      <Pressable style={styles.button} onPress={handleVerify} disabled={verifying}>
        <Text style={styles.buttonText}>{verifying ? 'Verifying...' : 'Verify Code'}</Text>
      </Pressable>

      <View style={styles.resendRow}>
        <Text style={styles.resendText}>Didn't get the code? </Text>
        <Pressable onPress={sendCode} disabled={sending || cooldown > 0}>
          <Text style={styles.resendLink}>Resend Code</Text>
        </Pressable>
      </View>

      {cooldown > 0 && (
        <View style={styles.cooldownPill}>
          <Text style={styles.cooldownText}>Resend in {formatCooldown(cooldown)}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#C4C6E7' },
  content: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },
  header: { flexDirection: 'row', marginBottom: 12 },
  backButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  iconSection: { alignItems: 'center', marginBottom: 32 },
  icon: { width: 110, height: 110, resizeMode: 'contain', marginBottom: 16 },
  wordmarkRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  miniIcon: { width: 24, height: 24, resizeMode: 'contain' },
  wordmark: { fontSize: 14, fontFamily: 'BowlbyOneSC_400Regular', color: '#011627', letterSpacing: 1 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#011627', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#4B5563', marginBottom: 28, lineHeight: 20 },
  subtitleEmail: { fontWeight: '700', color: '#011627' },
  codeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 },
  codeBox: {
    width: 46,
    height: 54,
    borderRadius: 12,
    backgroundColor: '#D8D9F0',
    fontSize: 20,
    fontWeight: '700',
    color: '#011627',
  },
  codeBoxFocused: { backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#6366F1' },
  button: { backgroundColor: '#011627', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  resendRow: { flexDirection: 'row', justifyContent: 'center' },
  resendText: { fontSize: 13, color: '#6B7280' },
  resendLink: { fontSize: 13, color: '#011627', fontWeight: '700', textDecorationLine: 'underline' },
  cooldownPill: {
    alignSelf: 'center',
    backgroundColor: '#D8D9F0',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 12,
  },
  cooldownText: { fontSize: 12, color: '#4B5563', fontWeight: '600' },
});
