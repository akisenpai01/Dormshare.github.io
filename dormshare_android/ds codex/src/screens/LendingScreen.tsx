import { LinearGradient } from 'expo-linear-gradient';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { ScreenShell } from '../components/ScreenShell';
import { useDormShare } from '../context/DormShareContext';
import { palette } from '../theme/palette';

export function LendingScreen() {
  const { libraryItems, session } = useDormShare();

  return (
    <ScreenShell scroll={false}>
      <FlatList
        data={libraryItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <LinearGradient colors={[palette.primary, '#86A0FF']} style={styles.insightCard}>
              <Text style={styles.insightEyebrow}>PORTFOLIO INSIGHTS</Text>
              <Text style={styles.insightTitle}>Total Earned/Saved</Text>
              <Text style={styles.insightValue}>$1,248.50</Text>
              <Text style={styles.insightSub}>+12% from last semester</Text>
              <View style={styles.insightStats}>
                <View>
                  <Text style={styles.insightStatLabel}>Items out</Text>
                  <Text style={styles.insightStatValue}>08</Text>
                </View>
                <View>
                  <Text style={styles.insightStatLabel}>Trust score</Text>
                  <Text style={styles.insightStatValue}>{session?.user.trustScore.toFixed(0) ?? '94'}</Text>
                </View>
              </View>
            </LinearGradient>

            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>MyLibrary</Text>
              <Text style={styles.sectionAction}>Manage all</Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.libraryCard}>
            <Image source={{ uri: item.imageUrl }} style={styles.libraryImage} />
            <View style={styles.libraryBody}>
              <View style={styles.libraryHeader}>
                <Text style={styles.libraryName}>{item.name}</Text>
                <Text style={styles.libraryPrice}>${item.tokenCost}/day</Text>
              </View>
              <Text style={styles.libraryMeta}>{item.category}</Text>
              <View style={styles.libraryFooter}>
                <Text style={styles.libraryFooterText}>
                  {item.status === 'borrowed' ? 'Borrowed by Alex M.' : '2 views today'}
                </Text>
                <Text style={[styles.libraryPill, item.status === 'borrowed' && styles.libraryPillDanger]}>
                  {item.status === 'borrowed' ? 'Overdue' : 'Boost listing'}
                </Text>
              </View>
            </View>
          </View>
        )}
        ListFooterComponent={
          <View style={styles.footerCard}>
            <Text style={styles.footerTitle}>Grow your side hustle</Text>
            <Text style={styles.footerBody}>
              Most campus rentals live less than 48 hours. Add clear photos, a bright pickup line, and a fast reply promise.
            </Text>
          </View>
        }
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: 120,
    gap: 16
  },
  header: {
    gap: 18
  },
  insightCard: {
    borderRadius: 30,
    padding: 22
  },
  insightEyebrow: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontFamily: 'Manrope_800ExtraBold'
  },
  insightTitle: {
    color: '#FFFFFF',
    fontSize: 31,
    lineHeight: 34,
    marginTop: 10,
    fontFamily: 'Manrope_800ExtraBold'
  },
  insightValue: {
    color: '#FFFFFF',
    fontSize: 42,
    marginTop: 8,
    fontFamily: 'Manrope_800ExtraBold'
  },
  insightSub: {
    color: 'rgba(255,255,255,0.8)',
    marginTop: 6,
    fontFamily: 'Manrope_600SemiBold'
  },
  insightStats: {
    flexDirection: 'row',
    gap: 26,
    marginTop: 18
  },
  insightStatLabel: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 11,
    fontFamily: 'Manrope_700Bold'
  },
  insightStatValue: {
    color: '#FFFFFF',
    fontSize: 24,
    marginTop: 4,
    fontFamily: 'Manrope_800ExtraBold'
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  sectionTitle: {
    color: palette.text,
    fontSize: 28,
    fontFamily: 'Manrope_800ExtraBold'
  },
  sectionAction: {
    color: palette.primary,
    fontFamily: 'Manrope_800ExtraBold'
  },
  libraryCard: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 12
  },
  libraryImage: {
    width: 112,
    height: 112,
    borderRadius: 18
  },
  libraryBody: {
    flex: 1,
    justifyContent: 'space-between'
  },
  libraryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12
  },
  libraryName: {
    flex: 1,
    color: palette.text,
    fontSize: 18,
    fontFamily: 'Manrope_700Bold'
  },
  libraryPrice: {
    color: palette.primary,
    fontFamily: 'Manrope_800ExtraBold'
  },
  libraryMeta: {
    color: palette.textMuted,
    fontFamily: 'Manrope_500Medium'
  },
  libraryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10
  },
  libraryFooterText: {
    color: palette.textMuted,
    fontSize: 12,
    fontFamily: 'Manrope_600SemiBold'
  },
  libraryPill: {
    backgroundColor: palette.surfaceSoft,
    color: palette.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    overflow: 'hidden',
    fontSize: 11,
    fontFamily: 'Manrope_800ExtraBold'
  },
  libraryPillDanger: {
    color: palette.danger
  },
  footerCard: {
    backgroundColor: palette.surface,
    borderRadius: 28,
    padding: 20,
    marginBottom: 24
  },
  footerTitle: {
    color: palette.text,
    fontSize: 24,
    marginBottom: 8,
    fontFamily: 'Manrope_800ExtraBold'
  },
  footerBody: {
    color: palette.textMuted,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'Manrope_500Medium'
  }
});
