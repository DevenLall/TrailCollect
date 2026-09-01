import { StyleSheet, Text, View } from 'react-native';

export default function PermissionsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Permissions screen — built next</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    color: '#011627',
  },
});