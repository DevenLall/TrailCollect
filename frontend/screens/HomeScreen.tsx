import { StyleSheet, Text, View, Image, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.topSection}>
        <View style={styles.headerRow}>
          <Pressable style={styles.iconButton} onPress={() => navigation.goBack()} hitSlop={10}>
            <Ionicons name="chevron-back" size={20} color="#011627" />
          </Pressable>
          <Text style={styles.headerTitle}>Explorer Profile</Text>
          <Pressable style={styles.iconButton} hitSlop={10}>
            <Ionicons name="settings-outline" size={20} color="#011627" />
          </Pressable>
        </View>

        <View style={styles.avatarCircle}>
          <Ionicons name="person" size={40} color="#FFFFFF" />
        </View>
        <Text style={styles.name}>DEVEN LALL</Text>
        <View style={styles.levelBadge}>
          <Ionicons name="star" size={12} color="#FFFFFF" />
          <Text style={styles.levelBadgeText}>Trailhead Wanderer  lvl 1</Text>
        </View>
      </View>

      <ScrollView style={styles.bottomSection} contentContainerStyle={styles.bottomContent}>
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>COMPLETED</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>TOTAL KM</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>BADGES</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>ABOUT EXPLORER</Text>
        <View style={styles.bioCard}>
          <Text style={styles.bioText}>This is my bio!</Text>
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>RECENT BADGES</Text>
          <Pressable hitSlop={8}>
            <Text style={styles.viewAll}>View All</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>RECENT COMPLETED TRAILS</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#C4C6E7' },
  topSection: { alignItems: 'center', paddingHorizontal: 24, paddingBottom: 24 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 24 },
  iconButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#011627' },
  avatarCircle: { width: 88, height: 88, borderRadius: 44, backgroundColor: '#A7A9D6', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  name: { fontSize: 22, fontFamily: 'BowlbyOneSC_400Regular', color: '#011627', marginBottom: 10 },
  levelBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#011627', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  levelBadgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  bottomSection: { flex: 1, backgroundColor: '#F5F5FA', borderTopLeftRadius: 28, borderTopRightRadius: 28 },
  bottomContent: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#011627', marginBottom: 2 },
  statLabel: { fontSize: 10, color: '#6B7280', letterSpacing: 0.3 },
  statDivider: { width: 1, backgroundColor: '#E5E7EB' },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#011627', marginBottom: 12, letterSpacing: 0.3 },
  bioCard: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginBottom: 28 },
  bioText: { fontSize: 14, color: '#374151' },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  viewAll: { fontSize: 13, color: '#4B5563', fontWeight: '500' },
});