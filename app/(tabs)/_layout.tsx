import { IconSymbol } from '@/components/ui/icon-symbol';
import { TabIcon } from '@/components/ui/tabIcon';
import { Colors } from '@/constants/theme';
import { useAudio } from '@/context/AudioContext';
import { useWorkout } from '@/context/WorkoutContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTranslation } from '@/hooks/use-translation';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

function WorkingTabBar() {
  const { stopWorkout } = useWorkout();
  const { playUserAction } = useAudio();
  const t = useTranslation();

  const handleStop = () => {
    playUserAction('reset');
    stopWorkout();
  };

  return (
    <View style={styles.workingTabBarContainer}>
      <TouchableOpacity style={styles.workingButton} activeOpacity={0.8} onPress={handleStop}>
        <IconSymbol name="stop" size={24} color="white" />
        <Text style={styles.workingButtonText}>{t.stop}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { workoutState } = useWorkout();
  const isWorking = workoutState.isWorking;
  const t = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        headerTitle: t.headerTitle,
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
        tabBarStyle: isWorking ? { display: 'none' } : [styles.tabBarStyle, { backgroundColor: Colors[colorScheme ?? 'light'].card }],
      }}
      tabBar={isWorking ? () => <WorkingTabBar /> : undefined}
    >
      <Tabs.Screen
        name="tabata"
        options={{
          title: t.tabTabata,
          tabBarIcon: ({ color, focused }) => <TabIcon name="house.fill" color={color} focused={focused} />
        }} />
      <Tabs.Screen
        name="presets"
        options={{
          title: t.tabPresets,
          tabBarIcon: ({ color, focused }) => <TabIcon name="paperplane.fill" color={color} focused={focused} />
        }} />
      <Tabs.Screen
        name="settings"
        options={{
          title: t.tabSettings,
          tabBarIcon: ({ color, focused }) => <TabIcon name="gearshape.fill" color={color} focused={focused} />
        }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    position: 'absolute',
    bottom: 10,
    marginHorizontal: 50,
    borderRadius: 50,
    height: 50,
    justifyContent: 'center',
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
    backgroundColor: '#ff3b30',
    borderRadius: 50,
    height: 70,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  workingButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});