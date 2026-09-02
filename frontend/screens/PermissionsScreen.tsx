import { useState } from 'react';
import { StyleSheet, Text, View, Image, Switch, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Permissions'>;

export default function PermissionsScreen({ navigation }: Props) {
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [motionEnabled, setMotionEnabled] = useState(false);

  const allPermissionsEnabled = locationEnabled && motionEnabled;

  const handleContinue = () => {
    navigation.replace('Home');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="chevron-back" size={24} color="#011627" />
        </Pressable>
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>Step 2 of 2</Text>
        </View>
      </View>
      <View style={styles.iconSection}>
        <Image source={require('../assets/trailcollect-icon.png')} style={styles.icon} />
        <Text style={styles.wordmark}>TRAILCOLLECT</Text>
        <Text style={styles.iconSubtitle}>You can always change it later</Text>
      </View>
      <Text style={styles.title}>Permissions</Text>
      <Text style={styles.subtitle}>
        Configure permissions to unlock real-time trail tracking and keep your explorer journey updated.
      </Text>
      <View style={styles.permissionRow}>
        <Ionicons name="location-outline" size={20} color="#011627" />
        <View style={styles.permissionText}>
          <Text style={styles.permissionTitle}>Location Access</Text>
          <Text style={styles.permissionDescription}>
            Allows the app to record your path, calculate trail statistics, and track your altitude as you explore.
          </Text>
        </View>
        <Switch value={locationEnabled} onValueChange={setLocationEnabled} trackColor={{ false: '#D1D5DB', true: '#22C55E' }} />
      </View>
      <View style={styles.permissionRow}>
        <Ionicons name="pulse-outline" size={20} color="#011627" />
        <View style={styles.permissionText}>
          <Text style={styles.permissionTitle}>Motion and Fitness</Text>
          <Text style={styles.permissionDescription}>
            Allows the app to use the barometer sensor, used to track your elevation when hiking.
          </Text>
        </View>
        <Switch value={motionEnabled} onValueChange={setMotionEnabled} trackColor={{ false: '#D1D5DB', true: '#22C55E' }} />
      </View>
      <Pressable
        style={[styles.button, !allPermissionsEnabled && styles.buttonDisabled]}
        onPress={handleContinue}
        disabled={!allPermissionsEnabled}
      >
        <Text style={[styles.buttonText, !allPermissionsEnabled && styles.buttonTextDisabled]}>Continue</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#C4C6E7' },
  content: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  stepBadge: { backgroundColor: '#011627', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  stepBadgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  iconSection: { alignItems: 'center', marginBottom: 32 },
  icon: { width: 72, height: 72, resizeMode: 'contain', marginBottom: 8 },
  wordmark: { fontSize: 18, fontFamily: 'BowlbyOneSC_400Regular', color: '#011627', marginBottom: 4 },
  iconSubtitle: { fontSize: 13, color: '#4B5563' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#011627', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#4B5563', marginBottom: 24 },
  permissionRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginBottom: 16, gap: 12 },
  permissionText: { flex: 1 },
  permissionTitle: { fontSize: 15, fontWeight: '600', color: '#011627', marginBottom: 4 },
  permissionDescription: { fontSize: 12, color: '#6B7280' },
  button: { backgroundColor: '#011627', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { backgroundColor: '#B8BAC7' },
  buttonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  buttonTextDisabled: { color: '#EFEFF3' },
});