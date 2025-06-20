import { Stack } from "expo-router";
import React from "react";
import './global.css';
import { TasksProvider } from "@/context/TasksContext";
import { NotificationProvider } from "@/context/NotificationContext";

export default function RootLayout() {
  return(
    <NotificationProvider>
      <TasksProvider>
        <Stack/>
      </TasksProvider>
    </NotificationProvider>
  );
}
