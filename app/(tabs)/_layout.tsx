import { IconSymbol } from '@/components/ui/icon-symbol';
import { TabIcon } from '@/components/ui/tabIcon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

function WorkingTabBar() {
  return (
    <View style={styles.workingTabBarContainer}>
      <TouchableOpacity style={styles.workingButton} activeOpacity={0.8}>
        <IconSymbol name="stop" size={24} color="white" />
        <Text style={styles.workingButtonText}>STOP</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isWorking = false;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        headerTitle: 'TABATA TIMER',
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        headerTintColor: Colors[colorScheme ?? 'light'].text,
        headerShadowVisible: false,
        tabBarShowLabel: false,
        tabBarStyle: isWorking ? { display: 'none' } : styles.tabBarStyle,
      }}
      tabBar={isWorking ? () => <WorkingTabBar /> : undefined}
    >
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
  workingTabBarContainer: {
    position: 'absolute',
    bottom: 30,
    marginHorizontal: 50,
    left: 0,
    right: 0,
  },
  workingButton: {
    backgroundColor: '#E53935',
    borderRadius: 50,
    height: 70,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  workingButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});