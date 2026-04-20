import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { palette } from '../../theme/palette';
import { Item } from '../../types';

export function ProductCard({
  item,
  compact = false,
  onPress
}: {
  item: Item;
  compact?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.card, compact && styles.compactCard]}>
      {item.badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.badge}</Text>
        </View>
      ) : null}
      <Image source={{ uri: item.imageUrl }} style={[styles.image, compact && styles.compactImage]} />
      <Text style={styles.name}>{item.name}</Text>
      <View style={styles.footer}>
        <Text style={styles.meta}>{item.pickupLocation}</Text>
        <Text style={styles.price}>${item.tokenCost}/day</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: palette.surface,
    borderRadius: 24,
    padding: 12,
    shadowColor: '#8D98C6',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 2
  },
  compactCard: {
    minWidth: 156
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: palette.surfaceSoft,
    marginBottom: 8
  },
  badgeText: {
    color: palette.success,
    fontSize: 10,
    fontFamily: 'Manrope_800ExtraBold'
  },
  image: {
    width: '100%',
    height: 172,
    borderRadius: 20,
    marginBottom: 12
  },
  compactImage: {
    height: 116
  },
  name: {
    color: palette.text,
    fontSize: 17,
    fontFamily: 'Manrope_700Bold'
  },
  footer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8
  },
  meta: {
    flex: 1,
    color: palette.textMuted,
    fontSize: 12,
    fontFamily: 'Manrope_500Medium'
  },
  price: {
    color: palette.primary,
    fontSize: 13,
    fontFamily: 'Manrope_800ExtraBold'
  }
});
