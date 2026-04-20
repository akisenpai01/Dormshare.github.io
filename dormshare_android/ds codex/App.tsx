import { ActivityIndicator, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold, Manrope_800ExtraBold } from '@expo-google-fonts/manrope';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DormShareProvider, useDormShare } from './src/context/DormShareContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { palette } from './src/theme/palette';

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: palette.background,
    card: palette.surface,
    text: palette.text,
    border: 'transparent',
    primary: palette.primary,
    notification: palette.accent
  }
};

function AppContent() {
  const { isBootstrapping } = useDormShare();

  if (isBootstrapping) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.background }}>
        <ActivityIndicator size="large" color={palette.primary} />
        <Text style={{ marginTop: 16, color: palette.textMuted, fontFamily: 'Manrope_600SemiBold' }}>
          Preparing DormShare
        </Text>
      </View>
    );
  }

  return <AppNavigator />;
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <DormShareProvider>
        <NavigationContainer theme={navTheme}>
          <StatusBar style="dark" />
          <AppContent />
        </NavigationContainer>
      </DormShareProvider>
    </SafeAreaProvider>
  );
}
