import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';



export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarShowLabel: false, // Nasconde il testo sotto le icone
        tabBarStyle: styles.tabBarStyle,
      }}>
      <Tabs.Screen
        name="tabata"
        options={{
          title: 'Tabata',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color}
       />,
        }}
      />
      <Tabs.Screen
        name="presets"
        options={{
          title: 'Presets',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color}/>,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gearshape.fill" color={color}
          />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    position: 'absolute',
    bottom: 30,
    marginHorizontal: 50, 
    elevation: 0,
    borderRadius: 50,
    height: 70,
    alignContent: 'center',
  },
});