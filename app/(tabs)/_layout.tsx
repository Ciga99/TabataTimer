import { TabIcon } from '@/components/ui/tabIcon';
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
        tabBarShowLabel: false, 
        tabBarStyle: styles.tabBarStyle,
      }}>
      <Tabs.Screen
        name="tabata"
        options={{
          title: 'Tabata',
          tabBarIcon: ({ color, focused }) => <TabIcon name="house.fill" color={color} focused={focused} />
        }} />
      <Tabs.Screen
        name="presets"
        options={{
          title: 'Presets',
          tabBarIcon: ({ color, focused }) => <TabIcon name="paperplane.fill" color={color} focused={focused} />
        }} />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => <TabIcon name="gearshape.fill" color={color} focused={focused} />
        }} />
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