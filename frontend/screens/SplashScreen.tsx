import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import { useFonts, BowlbyOneSC_400Regular } from '@expo-google-fonts/bowlby-one-sc';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export default function SplashScreen({ navigation }: Props) {
  //load the font for the wordmark
  const [fontsLoaded] = useFonts({
    BowlbyOneSC_400Regular,
  });

  //if font not loaded, then return null to avoid rendering the app
  useEffect(() => {
    if (!fontsLoaded) return;

  //timer to navigate to the loading screen after 2 seconds
    const timer = setTimeout(() => {
      navigation.replace('Loading');
    }, 2000);

  //cleanup function to clear the timer when the component unmounts
    return () => clearTimeout(timer);
  }, [fontsLoaded, navigation]);

  //if font not loaded, return null to avoid rendering the app
  if (!fontsLoaded) {
    return null;
  }

  //return the main view of the app
  return (
    <View style={styles.container}>
      <Image source={require('../assets/trailcollect-icon.png')} style={styles.icon} />
      <Text style={styles.wordmark}>TrailCollect</Text>
      <Text style={styles.tagline}>Collect Every Trail</Text>
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C4C6E7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 96,
    height: 96,
    marginBottom: 24,
    resizeMode: 'contain',
  },
  wordmark: {
    fontSize: 36,
    fontFamily: 'BowlbyOneSC_400Regular',
    color: '#011627',
    marginBottom: 6,
  },
  tagline: {
    fontSize: 14,
    color: '#011627',
  },
});