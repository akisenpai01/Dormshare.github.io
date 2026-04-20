import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDormShare } from '../context/DormShareContext';
import { palette } from '../theme/palette';

export function AuthScreen() {
  const { isBusy, signIn, signUp } = useDormShare();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('student@upes.ac.in');
  const [password, setPassword] = useState('password123');
  const [hostelBlock, setHostelBlock] = useState('A');

  async function handleSubmit() {
    try {
      if (mode === 'signin') {
        await signIn(email, password);
        return;
      }

      await signUp({ name, email, password, hostelBlock });
    } catch (error) {
      Alert.alert('Unable to continue', error instanceof Error ? error.message : 'Please try again.');
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={['#EEF2FF', '#FFFFFF', '#F6F7FE']} style={styles.background}>
        <View style={styles.hero}>
          <Text style={styles.brand}>DormShare</Text>
          <Text style={styles.title}>Borrow smarter. Lend easier. Keep campus moving.</Text>
          <Text style={styles.subtitle}>
            Cross-platform access to your campus library of things with live handoff verification and clean lending flows.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.switcher}>
            <Pressable style={[styles.switchPill, mode === 'signin' && styles.switchPillActive]} onPress={() => setMode('signin')}>
              <Text style={[styles.switchText, mode === 'signin' && styles.switchTextActive]}>Sign in</Text>
            </Pressable>
            <Pressable style={[styles.switchPill, mode === 'signup' && styles.switchPillActive]} onPress={() => setMode('signup')}>
              <Text style={[styles.switchText, mode === 'signup' && styles.switchTextActive]}>Create account</Text>
            </Pressable>
          </View>

          {mode === 'signup' ? (
            <>
              <TextInput value={name} onChangeText={setName} placeholder="Full name" placeholderTextColor={palette.textSoft} style={styles.input} />
              <TextInput value={hostelBlock} onChangeText={setHostelBlock} placeholder="Hostel block" placeholderTextColor={palette.textSoft} style={styles.input} />
            </>
          ) : null}

          <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" placeholder="UPES email" placeholderTextColor={palette.textSoft} style={styles.input} />
          <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="Password" placeholderTextColor={palette.textSoft} style={styles.input} />

          <Pressable onPress={handleSubmit} style={styles.cta}>
            <LinearGradient colors={[palette.primary, '#7C93FF']} style={styles.ctaFill}>
              <Text style={styles.ctaText}>{isBusy ? 'Please wait...' : mode === 'signin' ? 'Enter DormShare' : 'Launch my account'}</Text>
            </LinearGradient>
          </Pressable>

          <Text style={styles.footnote}>Use `EXPO_PUBLIC_API_BASE_URL` to point this app at your deployed backend.</Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: palette.background
  },
  background: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 18
  },
  hero: {
    paddingTop: 28,
    gap: 16
  },
  brand: {
    color: palette.primary,
    fontSize: 16,
    letterSpacing: 1.5,
    fontFamily: 'Manrope_800ExtraBold'
  },
  title: {
    color: palette.text,
    fontSize: 38,
    lineHeight: 46,
    fontFamily: 'Manrope_800ExtraBold'
  },
  subtitle: {
    color: palette.textMuted,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Manrope_500Medium'
  },
  card: {
    marginTop: 30,
    backgroundColor: 'rgba(255,255,255,0.86)',
    borderRadius: 28,
    padding: 20,
    gap: 14
  },
  switcher: {
    flexDirection: 'row',
    backgroundColor: palette.chip,
    borderRadius: 18,
    padding: 4
  },
  switchPill: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12
  },
  switchPillActive: {
    backgroundColor: palette.surface
  },
  switchText: {
    color: palette.textMuted,
    textAlign: 'center',
    fontFamily: 'Manrope_700Bold'
  },
  switchTextActive: {
    color: palette.text
  },
  input: {
    backgroundColor: palette.surface,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 15,
    color: palette.text,
    fontFamily: 'Manrope_600SemiBold'
  },
  cta: {
    marginTop: 8
  },
  ctaFill: {
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center'
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Manrope_800ExtraBold'
  },
  footnote: {
    color: palette.textSoft,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'Manrope_500Medium'
  }
});
