import { Pressable, StyleSheet, Text, View } from 'react-native';
import { palette } from '../theme/palette';

export function FilterChips({
  items,
  selected,
  onSelect
}: {
  items: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <View style={styles.row}>
      {items.map((item) => {
        const active = selected === item;
        return (
          <Pressable
            key={item}
            onPress={() => onSelect(item)}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={[styles.text, active && styles.textActive]}>{item}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: palette.chip
  },
  chipActive: {
    backgroundColor: palette.primary
  },
  text: {
    color: palette.chipText,
    fontSize: 13,
    fontFamily: 'Manrope_700Bold'
  },
  textActive: {
    color: '#FFFFFF'
  }
});
