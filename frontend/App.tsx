import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './screens/SplashScreen';
import LoadingScreen from './screens/LoadingScreen';

// Lists every screen this navigator knows about with what data 
// each one expects when you navigate to it. "undefined" means no data needed.
export type RootStackParamList = {
  Splash: undefined;
  Loading: undefined;
};

// Creates a stack navigator, to list the pages in order in the stack
// typed against our param list above.
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    // Required top-level wrapper — manages navigation state for the whole app.
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash" // which screen shows first on launch
        screenOptions={{ headerShown: false }} // hide the default header bar — our screens are fully custom designs
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Loading" component={LoadingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}