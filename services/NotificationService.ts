import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const NOTIF_ID = 'tabata-workout-active';

export async function requestNotificationPermissions(): Promise<void> {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync('workout', {
    name: 'Workout Timer',
    importance: Notifications.AndroidImportance.LOW,
    sound: null,
    vibrationPattern: null,
    enableVibrate: false,
  });

  await Notifications.requestPermissionsAsync();
}

export async function showWorkoutNotification(
  phase: string,
  seconds: number
): Promise<void> {
  if (Platform.OS !== 'android') return;

  await Notifications.scheduleNotificationAsync({
    identifier: NOTIF_ID,
    content: {
      title: 'TabataTimer in corso',
      body: `${phase}: ${seconds}s`,
      sticky: true,
      priority: Notifications.AndroidNotificationPriority.LOW,
      android: {
        channelId: 'workout',
        ongoing: true,
        silent: true,
      },
    } as any,
    trigger: null,
  });
}

export async function dismissWorkoutNotification(): Promise<void> {
  if (Platform.OS !== 'android') return;
  try {
    await Notifications.dismissNotificationAsync(NOTIF_ID);
  } catch {
    // Ignora se la notifica non esiste
  }
}
