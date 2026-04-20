import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenShell } from '../components/ScreenShell';
import { SectionHeader } from '../components/SectionHeader';
import { useDormShare } from '../context/DormShareContext';
import { palette } from '../theme/palette';

const statusTone = {
  pending: palette.warning,
  active: palette.primary,
  returned: palette.success
};

export function ActivityScreen() {
  const { transactions, refreshData, isBusy } = useDormShare();

  return (
    <ScreenShell scroll={false}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={isBusy} onRefresh={refreshData} tintColor={palette.primary} />}
      >
        <SectionHeader eyebrow="LIVE ACTIVITY" title="Deals in motion" action={`${transactions.length} items`} />

        {transactions.map((transaction) => (
          <View key={transaction.id} style={styles.card}>
            <View style={styles.cardRow}>
              <View>
                <Text style={styles.itemName}>{transaction.itemName ?? transaction.itemId}</Text>
                <Text style={styles.date}>{transaction.date}</Text>
              </View>
              <Text style={[styles.status, { color: statusTone[transaction.status] }]}>{transaction.status.toUpperCase()}</Text>
            </View>
            <Text style={styles.meta}>
              {transaction.tokenCost} tokens exchanged between borrower `{transaction.borrowerId}` and lender `{transaction.lenderId}`.
            </Text>
          </View>
        ))}
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 14,
    paddingBottom: 120
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: 24,
    padding: 18,
    gap: 10
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12
  },
  itemName: {
    color: palette.text,
    fontSize: 18,
    fontFamily: 'Manrope_700Bold'
  },
  date: {
    color: palette.textMuted,
    marginTop: 4,
    fontFamily: 'Manrope_500Medium'
  },
  status: {
    fontSize: 12,
    fontFamily: 'Manrope_800ExtraBold'
  },
  meta: {
    color: palette.textMuted,
    lineHeight: 20,
    fontFamily: 'Manrope_500Medium'
  }
});
