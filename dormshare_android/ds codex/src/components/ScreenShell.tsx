import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { palette } from '../theme/palette';

export function ScreenShell({
  children,
  scroll = true
}: {
  children: ReactNode;
  scroll?: boolean;
}) {
  const content = (
    <View style={styles.inner}>
      <LinearGradient colors={['#FFFFFF', '#F4F6FF']} style={styles.glowTop} />
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      {scroll ? <ScrollView contentContainerStyle={styles.scroll}>{content}</ScrollView> : content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: palette.background
  },
  scroll: {
    paddingBottom: 120
  },
  inner: {
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 18
  },
  glowTop: {
    position: 'absolute',
    top: 0,
    left: -40,
    right: -40,
    height: 220,
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
    opacity: 0.6
  }
});
