import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { supabase } from '../lib/supabase';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileCreation'>;

export default function ProfileCreationScreen({ navigation }: Props) {
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSaveProfile = async () => {
    if (fullName.trim() === '' || age.trim() === '') {
      Alert.alert('Missing information', 'Please enter your full name and age to continue.');
      return;
    }

    const ageNumber = Number(age);
    if (isNaN(ageNumber) || ageNumber < 15) {
      Alert.alert('Age requirement', 'You must be 15 or older to use this service.');
      return;
    }

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      Alert.alert('Not signed in', 'Something went wrong — please sign up again.');
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName.trim(),
        age: ageNumber,
        bio: bio.trim() || null,
      })
      .eq('id', user.id);

    setLoading(false);

    if (error) {
      Alert.alert('Save failed', error.message);
      return;
    }

    navigation.navigate('Permissions');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={20} color="#011627" />
        </Pressable>
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>Step 1 of 2</Text>
        </View>
      </View>

      <Text style={styles.title}>Create Your Profile</Text>
      <Text style={styles.subtitle}>
        Let others get to know you better. You can edit these details anytime later in settings.
      </Text>

      <View style={styles.photoSection}>
        <View style={styles.photoCircle}>
          <Ionicons name="person" size={40} color="#9CA3AF" />
          <View style={styles.cameraBadge}>
            <Ionicons name="camera" size={14} color="#FFFFFF" />
          </View>
        </View>
        <Text style={styles.photoLabel}>Upload Photo</Text>
        <Text style={styles.photoHint}>JPG, PNG up to 5MB</Text>
      </View>

      <Text style={styles.label}>Full Name *</Text>
      <View style={styles.inputWrapper}>
        <Ionicons name="person-outline" size={18} color="#6B7280" />
        <TextInput
          style={styles.input}
          placeholder="e.g. Deven Lall"
          placeholderTextColor="#9CA3AF"
          value={fullName}
          onChangeText={setFullName}
        />
      </View>

      <Text style={styles.label}>Age *</Text>
      <View style={styles.inputWrapper}>
        <Ionicons name="calendar-outline" size={18} color="#6B7280" />
        <TextInput
          style={styles.input}
          placeholder="e.g. 21"
          placeholderTextColor="#9CA3AF"
          value={age}
          onChangeText={setAge}
          keyboardType="number-pad"
        />
      </View>
      <Text style={styles.ageHint}>You must be 18 or older to use this service</Text>

      <Text style={styles.label}>Bio</Text>
      <TextInput
        style={styles.bioInput}
        placeholder="Tell us a bit about yourself, your hobbies, and what brings you here..."
        placeholderTextColor="#9CA3AF"
        value={bio}
        onChangeText={setBio}
        multiline
        numberOfLines={4}
      />

      <Pressable style={styles.button} onPress={handleSaveProfile} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Saving...' : 'Save Profile'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  backButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  stepBadge: { backgroundColor: '#011627', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  stepBadgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#011627', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#6B7280', marginBottom: 24 },
  photoSection: { alignItems: 'center', marginBottom: 24 },
  photoCircle: { width: 88, height: 88, borderRadius: 44, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  photoLabel: { fontSize: 14, fontWeight: '600', color: '#011627' },
  photoHint: { fontSize: 12, color: '#9CA3AF' },
  label: { fontSize: 13, fontWeight: '600', color: '#011627', marginBottom: 6 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 6,
    gap: 8,
  },
  input: { flex: 1, fontSize: 14, color: '#011627' },
  ageHint: { fontSize: 12, color: '#9CA3AF', marginBottom: 16 },
  bioInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#011627',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 24,
  },
  button: { backgroundColor: '#011627', borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
});