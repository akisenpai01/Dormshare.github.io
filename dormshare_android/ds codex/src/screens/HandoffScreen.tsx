import QRCode from 'react-native-qrcode-svg';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenShell } from '../components/ScreenShell';
import { useDormShare } from '../context/DormShareContext';
import { handoffCode } from '../data/demo';
import { palette } from '../theme/palette';

export function HandoffScreen() {
  const { transactions, verifyHandoff } = useDormShare();
  const pendingTransaction = transactions.find((transaction) => transaction.status === 'pending') ?? transactions[0];

  async function handleVerification() {
    if (!pendingTransaction) {
      Alert.alert('No pending handoff', 'Once a borrow request is accepted it will appear here.');
      return;
    }

    await verifyHandoff(pendingTransaction.id);
    Alert.alert('Handoff verified', 'The transaction is now active and the item is marked as borrowed.');
  }

  return (
    <ScreenShell>
      <View style={styles.header}>
        <Text style={styles.brand}>DormShare</Text>
        <Text style={styles.dot}>LENDER VIEW</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>HandoffVerification</Text>
        <Text style={styles.subtitle}>Show this code to the borrower to confirm the item transfer.</Text>

        <View style={styles.qrShell}>
          <View style={styles.qrCard}>
            <QRCode value={pendingTransaction ? `${handoffCode}/${pendingTransaction.id}` : handoffCode} size={132} />
          </View>
          <Text style={styles.live}>LIVE VERIFICATION ACTIVE</Text>
        </View>

        <Text style={styles.instructionsTitle}>INSTRUCTIONS</Text>
        <Text style={styles.instructionsBody}>
          Ask the borrower to open DormShare and scan the code above. Once matched, verify the handoff to activate the rental.
        </Text>

        <View style={styles.stepper}>
          {['Request accepted', 'Handoff pending', 'Verified'].map((step, index) => {
            const activeIndex = pendingTransaction?.status === 'active' ? 2 : 1;
            const active = index <= activeIndex;

            return (
              <View key={step} style={styles.stepItem}>
                <View style={[styles.stepDot, active && styles.stepDotActive]} />
                <Text style={[styles.stepLabel, active && styles.stepLabelActive]}>{step}</Text>
              </View>
            );
          })}
        </View>

        <Pressable onPress={handleVerification} style={styles.button}>
          <Text style={styles.buttonText}>Verify handoff</Text>
        </Pressable>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  brand: {
    color: palette.text,
    fontSize: 16,
    fontFamily: 'Manrope_800ExtraBold'
  },
  dot: {
    color: palette.primary,
    backgroundColor: palette.surfaceSoft,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 11,
    fontFamily: 'Manrope_800ExtraBold'
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 24,
    gap: 16
  },
  title: {
    color: palette.text,
    fontSize: 34,
    lineHeight: 36,
    fontFamily: 'Manrope_800ExtraBold'
  },
  subtitle: {
    color: palette.textMuted,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: 'Manrope_500Medium'
  },
  qrShell: {
    alignItems: 'center',
    backgroundColor: palette.background,
    borderRadius: 28,
    padding: 22,
    gap: 16
  },
  qrCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18
  },
  live: {
    color: palette.textMuted,
    fontSize: 11,
    fontFamily: 'Manrope_800ExtraBold'
  },
  instructionsTitle: {
    color: palette.primary,
    fontSize: 13,
    letterSpacing: 1.1,
    textAlign: 'center',
    fontFamily: 'Manrope_800ExtraBold'
  },
  instructionsBody: {
    color: palette.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: 'Manrope_500Medium'
  },
  stepper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: palette.background,
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 12
  },
  stepItem: {
    alignItems: 'center',
    gap: 8,
    flex: 1
  },
  stepDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#CBD2EC'
  },
  stepDotActive: {
    backgroundColor: palette.primary
  },
  stepLabel: {
    color: palette.textSoft,
    fontSize: 10,
    textAlign: 'center',
    fontFamily: 'Manrope_700Bold'
  },
  stepLabelActive: {
    color: palette.text
  },
  button: {
    marginTop: 8,
    backgroundColor: palette.primary,
    borderRadius: 22,
    paddingVertical: 16,
    alignItems: 'center'
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Manrope_800ExtraBold'
  }
});
