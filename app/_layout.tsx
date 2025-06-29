import { Stack } from "expo-router";
import React, { useEffect } from "react";
import './global.css';
import { TasksProvider } from "@/context/TasksContext";
import { NotificationProvider } from "@/context/NotificationContext";
import * as Notifications from "expo-notifications";


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
      <TasksProvider>
        <Stack/>
      </TasksProvider>
    </NotificationProvider>
  );
}
