import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import SignUpSheet from '../screens/SignUpSheet';

type Props = NativeStackScreenProps<RootStackParamList, 'Loading'>;

export default function LoadingScreen({ navigation }: Props) {
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSignUp(true);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  const handleSignUpComplete = () => {
    navigation.replace('Permissions');
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageSection}>
        <Image source={require('../assets/Hiker.png')} style={styles.icon} />
      </View>
      <View style={styles.textSection}>
        <Text style={styles.wordmark}>TrailCollect</Text>
        <Text style={styles.tagline}>Collect Every Trail</Text>
      </View>

      <SignUpSheet visible={showSignUp} onSubmit={handleSignUpComplete} />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C4C6E7',
  },
  imageSection: {
    flex: 0.6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 400,
    height: 400,
    resizeMode: 'contain',
  },
  textSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmark: {
    fontSize: 50,
    fontFamily: 'BowlbyOneSC_400Regular',
    color: '#011627',
    marginBottom: 6,
  },
  tagline: {
    fontSize: 14,
    color: '#011627',
  },
});