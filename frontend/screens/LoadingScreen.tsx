import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import SignUpSheet from '../screens/SignUpSheet';
import LoginSheet from '../screens/LoginSheet';

type Props = NativeStackScreenProps<RootStackParamList, 'Loading'>;

export default function LoadingScreen({ navigation }: Props) {
  const [authView, setAuthView] = useState<'none' | 'signup' | 'login'>('none');

  useEffect(() => {
    const timer = setTimeout(() => {
      setAuthView('signup');
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  const handleSignUpComplete = () => {
    navigation.replace('ProfileCreation');
  };

  const handleLoginComplete = () => {
    navigation.replace('Home');
  };

  const handleSignUpPasswordVerified = (email: string) => {
    navigation.navigate('Otp', { email, origin: 'signup' });
  };

  const handleLoginPasswordVerified = (email: string) => {
    navigation.navigate('Otp', { email, origin: 'login' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageSection}>
        <Image source={require('../assets/Hiker.png')} style={styles.image} />
      </View>
      <View style={styles.textSection}>
        <Text style={styles.wordmark}>TRAILCOLLECT</Text>
        <Text style={styles.tagline}>Collect every summit. Track every trail.</Text>
      </View>

      <SignUpSheet
        visible={authView === 'signup'}
        onSubmit={handleSignUpComplete}
        onPasswordVerified={handleSignUpPasswordVerified}
        onSwitchToLogin={() => setAuthView('login')}
      />
      <LoginSheet
        visible={authView === 'login'}
        onSubmit={handleLoginComplete}
        onPasswordVerified={handleLoginPasswordVerified}
        onSwitchToSignUp={() => setAuthView('signup')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#C4C6E7' },
  imageSection: { flex: 0.6, alignItems: 'center', justifyContent: 'center' },
  image: { width: 400, height: 400, resizeMode: 'contain' },
  textSection: { alignItems: 'center', paddingHorizontal: 24 },
  wordmark: { fontSize: 40, fontFamily: 'BowlbyOneSC_400Regular', color: '#011627', marginBottom: 8 },
  tagline: { fontSize: 14, color: '#4B5563', textAlign: 'center' },
});