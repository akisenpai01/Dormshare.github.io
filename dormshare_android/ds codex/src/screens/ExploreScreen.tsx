import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { FilterChips } from '../components/FilterChips';
import { ScreenShell } from '../components/ScreenShell';
import { SectionHeader } from '../components/SectionHeader';
import { ProductCard } from '../components/cards/ProductCard';
import { useDormShare } from '../context/DormShareContext';
import { categories } from '../data/demo';
import { palette } from '../theme/palette';

export function ExploreScreen() {
  const navigation = useNavigation<any>();
  const { marketItems, session } = useDormShare();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Items');

  const filteredItems = useMemo(() => {
    return marketItems.filter((item) => {
      const matchesQuery = item.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = selectedCategory === 'All Items' || item.category === selectedCategory;
      return matchesQuery && matchesCategory;
    });
  }, [marketItems, query, selectedCategory]);

  const heroItem = filteredItems[0];
  const gridItems = filteredItems.slice(1, 5);

  return (
    <ScreenShell>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>DormShare</Text>
          <Text style={styles.subGreeting}>What do you need to borrow today?</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{session?.user.name.slice(0, 1) ?? 'D'}</Text>
        </View>
      </View>

      <View style={styles.search}>
        <Ionicons name="search" size={18} color={palette.textSoft} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
          placeholder="What do you need to borrow?"
          placeholderTextColor={palette.textSoft}
        />
      </View>

      <FilterChips items={categories} selected={selectedCategory} onSelect={setSelectedCategory} />

      <SectionHeader eyebrow="TRENDING NOW" title="CampusDrops" action="See all" />

      {heroItem ? (
        <Pressable onPress={() => navigation.navigate('ItemDetails', { item: heroItem })} style={styles.heroCard}>
          <Image source={{ uri: heroItem.imageUrl }} style={styles.heroImage} />
          <View style={styles.heroBody}>
            <Text style={styles.heroName}>{heroItem.name}</Text>
            <View style={styles.heroMetaRow}>
              <Text style={styles.heroLocation}>{heroItem.pickupLocation}</Text>
              <Text style={styles.heroPrice}>${heroItem.tokenCost}/day</Text>
            </View>
          </View>
        </Pressable>
      ) : null}

      <View style={styles.grid}>
        {gridItems.map((item) => (
          <ProductCard key={item.id} item={item} compact onPress={() => navigation.navigate('ItemDetails', { item })} />
        ))}
      </View>

      <View style={styles.storyCard}>
        <Text style={styles.storyEyebrow}>COMMUNITY SPOTLIGHT</Text>
        <Text style={styles.storyTitle}>Borrowing is better for the planet.</Text>
        <Text style={styles.storyBody}>Join 400+ students reducing waste this semester through shared access.</Text>
        <Pressable style={styles.storyButton}>
          <Text style={styles.storyButtonText}>Learn more</Text>
        </Pressable>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  greeting: {
    color: palette.text,
    fontSize: 15,
    fontFamily: 'Manrope_800ExtraBold'
  },
  subGreeting: {
    marginTop: 4,
    color: palette.textMuted,
    fontSize: 13,
    fontFamily: 'Manrope_500Medium'
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.primary
  },
  avatarText: {
    color: '#FFFFFF',
    fontFamily: 'Manrope_800ExtraBold'
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: palette.surface,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  searchInput: {
    flex: 1,
    color: palette.text,
    fontSize: 14,
    fontFamily: 'Manrope_600SemiBold'
  },
  heroCard: {
    backgroundColor: palette.surface,
    borderRadius: 28,
    padding: 12,
    shadowColor: '#8D98C6',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 }
  },
  heroImage: {
    width: '100%',
    height: 220,
    borderRadius: 22
  },
  heroBody: {
    padding: 12,
    gap: 6
  },
  heroName: {
    color: palette.text,
    fontSize: 22,
    fontFamily: 'Manrope_800ExtraBold'
  },
  heroMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10
  },
  heroLocation: {
    flex: 1,
    color: palette.textMuted,
    fontSize: 13,
    fontFamily: 'Manrope_500Medium'
  },
  heroPrice: {
    color: palette.primary,
    fontSize: 14,
    fontFamily: 'Manrope_800ExtraBold'
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14
  },
  storyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 20,
    gap: 10
  },
  storyEyebrow: {
    color: palette.accent,
    fontSize: 11,
    fontFamily: 'Manrope_800ExtraBold'
  },
  storyTitle: {
    color: palette.text,
    fontSize: 28,
    lineHeight: 30,
    fontFamily: 'Manrope_800ExtraBold'
  },
  storyBody: {
    color: palette.textMuted,
    fontSize: 14,
    lineHeight: 21,
    fontFamily: 'Manrope_500Medium'
  },
  storyButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
    backgroundColor: palette.accent,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12
  },
  storyButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Manrope_800ExtraBold'
  }
});
