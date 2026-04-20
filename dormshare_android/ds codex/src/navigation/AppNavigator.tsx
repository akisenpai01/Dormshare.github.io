import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import { useDormShare } from '../context/DormShareContext';
import { ActivityScreen } from '../screens/ActivityScreen';
import { AuthScreen } from '../screens/AuthScreen';
import { ExploreScreen } from '../screens/ExploreScreen';
import { HandoffScreen } from '../screens/HandoffScreen';
import { ItemDetailsScreen } from '../screens/ItemDetailsScreen';
import { LendingScreen } from '../screens/LendingScreen';
import { palette } from '../theme/palette';
import { Item } from '../types';

export type RootStackParamList = {
  MainTabs: undefined;
  ItemDetails: { item: Item };
};

export type HomeTabParamList = {
  Explore: undefined;
  Lending: undefined;
  Activity: undefined;
  Handoff: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<HomeTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.textSoft,
        tabBarStyle: {
          position: 'absolute',
          marginHorizontal: 18,
          marginBottom: 18,
          height: 68,
          paddingBottom: 8,
          paddingTop: 8,
          borderRadius: 24,
          backgroundColor: 'rgba(255,255,255,0.96)',
          borderTopWidth: 0,
          elevation: 0,
          shadowColor: '#7A8BD4',
          shadowOpacity: 0.16,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 10 }
        },
        tabBarIcon: ({ color, size, focused }) => {
          const iconMap: Record<keyof HomeTabParamList, keyof typeof Ionicons.glyphMap> = {
            Explore: 'compass',
            Lending: 'layers',
            Activity: 'receipt',
            Handoff: 'scan-circle'
          };

          return <Ionicons name={iconMap[route.name]} size={focused ? size + 2 : size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Lending" component={LendingScreen} />
      <Tab.Screen name="Activity" component={ActivityScreen} />
      <Tab.Screen name="Handoff" component={HandoffScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { session, signOut } = useDormShare();

  if (!session) {
    return <AuthScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: { backgroundColor: palette.background },
        headerShadowVisible: false,
        headerStyle: { backgroundColor: palette.background },
        headerTitleStyle: { color: palette.text, fontFamily: 'Manrope_700Bold' }
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{
          title: 'DormShare',
          headerRight: () => (
            <TouchableOpacity onPress={signOut}>
              <Ionicons name="log-out-outline" size={22} color={palette.textMuted} />
            </TouchableOpacity>
          )
        }}
      />
      <Stack.Screen
        name="ItemDetails"
        component={ItemDetailsScreen}
        options={{
          title: 'Item Details',
          headerBackTitleVisible: false
        }}
      />
    </Stack.Navigator>
  );
}
