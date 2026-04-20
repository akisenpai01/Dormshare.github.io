import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenShell } from '../components/ScreenShell';
import { useDormShare } from '../context/DormShareContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import { palette } from '../theme/palette';

type Props = NativeStackScreenProps<RootStackParamList, 'ItemDetails'>;

export function ItemDetailsScreen({ route }: Props) {
  const { item } = route.params;
  const { requestBorrow } = useDormShare();

  async function handleBorrow() {
    const transaction = await requestBorrow(item);
    Alert.alert('Borrow request sent', `Request ${transaction.id} is now pending lender handoff.`);
  }

  return (
    <ScreenShell>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />

      <View style={styles.card}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.badge ?? 'VERIFIED CAMPUS LENDER'}</Text>
        </View>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.location}>{item.pickupLocation}</Text>

        <View style={styles.metrics}>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>BATTERY LIFE</Text>
            <Text style={styles.metricValue}>{item.batteryLife ?? '30 Hours'}</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>NOISE CANCELLING</Text>
            <Text style={styles.metricValue}>{item.highlight ?? 'Industry Lead'}</Text>
          </View>
        </View>

        <View style={styles.ownerRow}>
          <View>
            <Text style={styles.ownerName}>{item.ownerName ?? 'Campus Lender'}</Text>
            <Text style={styles.ownerMeta}>Trust score {(item.ownerTrustScore ?? 4.8).toFixed(2)}</Text>
          </View>
          <Text style={styles.ownerLink}>View Profile</Text>
        </View>

        <Text style={styles.description}>{item.description}</Text>

        <Pressable onPress={handleBorrow} style={styles.cta}>
          <Text style={styles.ctaText}>Request to Borrow</Text>
        </Pressable>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 350,
    borderRadius: 30
  },
  card: {
    marginTop: -38,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 20,
    gap: 12
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: palette.surfaceSoft,
    paddingHorizontal: 12,
    paddingVertical: 7
  },
  badgeText: {
    color: palette.primary,
    fontSize: 11,
    fontFamily: 'Manrope_800ExtraBold'
  },
  name: {
    color: palette.text,
    fontSize: 34,
    lineHeight: 38,
    fontFamily: 'Manrope_800ExtraBold'
  },
  location: {
    color: palette.textMuted,
    fontSize: 15,
    fontFamily: 'Manrope_500Medium'
  },
  metrics: {
    flexDirection: 'row',
    gap: 12
  },
  metricBox: {
    flex: 1,
    backgroundColor: palette.background,
    borderRadius: 22,
    padding: 18,
    gap: 8
  },
  metricLabel: {
    color: palette.textSoft,
    fontSize: 11,
    fontFamily: 'Manrope_700Bold'
  },
  metricValue: {
    color: palette.text,
    fontSize: 20,
    fontFamily: 'Manrope_700Bold'
  },
  ownerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8
  },
  ownerName: {
    color: palette.text,
    fontSize: 17,
    fontFamily: 'Manrope_700Bold'
  },
  ownerMeta: {
    color: palette.textMuted,
    fontSize: 12,
    fontFamily: 'Manrope_500Medium'
  },
  ownerLink: {
    color: palette.primary,
    fontFamily: 'Manrope_800ExtraBold'
  },
  description: {
    color: palette.textMuted,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'Manrope_500Medium'
  },
  cta: {
    borderRadius: 22,
    backgroundColor: palette.primary,
    paddingVertical: 17,
    alignItems: 'center'
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Manrope_800ExtraBold'
  }
});
