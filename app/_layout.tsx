import { NotificationProvider } from "@/context/NotificationContext";
import { TasksProvider } from "@/context/TasksContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import './global.css';
import { useEffect } from "react";
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async() =>({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  useEffect(() => {
    (async () => {
      const {status} = await Notifications.requestPermissionsAsync();
      if(status !== "granted"){
        alert("Notification permission not granted");
        return;
      }

      await Notifications.setNotificationChannelAsync("task-reminder",{
        name: "Task Reminder",
        importance: Notifications.AndroidImportance.HIGH,
        lightColor: "#FF00FF",
      });
    })();
  },[])

  return(
    <NotificationProvider>
      <ThemeProvider>
        <TasksProvider>
          <Stack/>
        </TasksProvider>
      </ThemeProvider>
    </NotificationProvider>
  );
}
