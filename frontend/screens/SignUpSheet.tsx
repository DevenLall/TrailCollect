import { useState } from 'react';
import { StyleSheet, Text, View, Image, Modal, TextInput, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  visible: boolean;
  onSubmit: () => void;
};

export default function SignUpSheet({ visible, onSubmit }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleCreateAccount = () => {
    // For now we only check that something was typed in each field —
    // real validation (email format, password rules) comes later.
    if (email.trim() === '' || password.trim() === '') {
      Alert.alert('Missing information', 'Please enter an email and password to continue.');
      return;
    }
    onSubmit();
  };

  return (
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

          <Pressable style={styles.checkboxRow} onPress={() => setAgreed((prev) => !prev)}>
            <View style={[styles.checkbox, agreed && styles.checkboxChecked]} />
            <Text style={styles.checkboxLabel}>I agree to the Terms of Service & Privacy Policy</Text>
          </Pressable>

          <Pressable style={styles.button} onPress={handleCreateAccount}>
            <Text style={styles.buttonText}>Create Account</Text>
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialRow}>
            <Pressable style={styles.socialButton}>
              <Text style={styles.socialButtonText}>Google</Text>
            </Pressable>
            <Pressable style={styles.socialButton}>
              <Text style={styles.socialButtonText}>Strava</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
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
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: '#9CA3AF', marginRight: 8 },
  checkboxChecked: { backgroundColor: '#011627', borderColor: '#011627' },
  checkboxLabel: { flex: 1, fontSize: 12, color: '#6B7280' },
  button: { backgroundColor: '#011627', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 8 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  dividerText: { fontSize: 11, color: '#9CA3AF', letterSpacing: 0.5 },
  socialRow: { flexDirection: 'row', gap: 12 },
  socialButton: { flex: 1, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  socialButtonText: { fontSize: 14, fontWeight: '600', color: '#011627' },
});