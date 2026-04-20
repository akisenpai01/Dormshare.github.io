import { StyleSheet, Text, View } from 'react-native';
import { palette } from '../theme/palette';

export function SectionHeader({
  eyebrow,
  title,
  action
}: {
  eyebrow?: string;
  title: string;
  action?: string;
}) {
  return (
    <View style={styles.row}>
      <View>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title}>{title}</Text>
      </View>
      {action ? <Text style={styles.action}>{action}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  eyebrow: {
    color: palette.accent,
    fontSize: 11,
    letterSpacing: 1.2,
    fontFamily: 'Manrope_800ExtraBold',
    marginBottom: 4
  },
  title: {
    color: palette.text,
    fontSize: 31,
    lineHeight: 34,
    fontFamily: 'Manrope_800ExtraBold'
  },
  action: {
    color: palette.primary,
    fontSize: 13,
    fontFamily: 'Manrope_700Bold'
  }
});
