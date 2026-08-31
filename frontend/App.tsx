import { StatusBar } from 'expo-status-bar';
import { useFonts, BowlbyOneSC_400Regular } from '@expo-google-fonts/bowlby-one-sc';
import { StyleSheet, Text, View, Image } from 'react-native';


export default function App() {
  const [fontsLoaded] = useFonts({
    BowlbyOneSC_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Image source={require('./assets/trailcollect-icon.png')} style={styles.icon} />
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