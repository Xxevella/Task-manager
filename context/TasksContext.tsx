import { Logs } from "@/types/logsType";
import { Task } from "@/types/taskType";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";
import { useNotification } from "./NotificationContext";


const StorageKey = '@tasks_storage';
const LogsStorageKey = 'logs_storage'

type TasksContextType = {
    tasks: Task[];
    addTask: (task: Task) => Promise<void>;
    updateTask: (task: Task) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    logs: Logs[];
};

export const TasksContext = createContext<TasksContextType | undefined>(undefined)

type TasksProviderProps = {
    children: React.ReactNode;
};

export function TasksProvider({children}:TasksProviderProps) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [logs, setLogs] = useState<Logs[]>([]);
    const {showNotification} = useNotification();

    useEffect(() => {
        (async () => {
            try {
                const storedTasks = await AsyncStorage.getItem(StorageKey);
                if (storedTasks) {
                    setTasks(JSON.parse(storedTasks));
                }
                const storedLogs = await AsyncStorage.getItem(LogsStorageKey)
                if(storedLogs)
                {
                    setLogs(JSON.parse(storedLogs))
                }
            }
            catch (error) {
                showNotification("Error loading tasks");
            }
        })();
    },[]);

    const saveTasks = async(newTasks: Task[]) => {
        try {
            setTasks(newTasks);
            await AsyncStorage.setItem(StorageKey, JSON.stringify(newTasks));
        }
        catch (error) {
            showNotification("Error saving tasks");
        }
    }

    const saveLogs = async(newLogs: Logs[]) =>{
        try{
            setLogs(newLogs);
            await AsyncStorage.setItem(LogsStorageKey, JSON.stringify(newLogs))
        }
        catch(error)
        {
            showNotification("Error saving logs")
        }
    }

    const AddLog = async(action: Logs["action"], task:Task) =>{
        const newLog: Logs = {
                id: `${task.id}_log`,
                timestamp: new Date().toISOString(),
                action,
                taskId:task.id,
                taskTitle: task.title
        };
        const updatedLogs = [newLog, ...logs];
        await saveLogs(updatedLogs);
    }

    const addTask = async(task: Task) => {
        // const notificationId = await taskNotification(task.id, task.title, task.dateTime);
        // task.notificationId = notificationId;
        try{
            await saveTasks([...tasks, task]);
            await AddLog("added", task)
        }
        catch (error) {
            // if(notificationId) {
            //     await Notifications.cancelScheduledNotificationAsync(notificationId);
            // }
            showNotification("Error saving tasks");
        }
    }

    const updateTask = async(updatedTask: Task) => {
        // const oldTask = tasks.find(task => task.id === updatedTask.id);
        // if(oldTask?.notificationId) {
        //     await Notifications.cancelScheduledNotificationAsync(oldTask.notificationId);
        // }
        // const newNotificationId = await taskNotification(updatedTask.id, updatedTask.title, updatedTask.dateTime);
        // updatedTask.notificationId = newNotificationId;
        try{
            await saveTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
            await AddLog("updated", updatedTask)
        }
        catch (error) {
            // if(newNotificationId) {
            //     await Notifications.cancelScheduledNotificationAsync(newNotificationId);
            // }
            showNotification("Error saving tasks");
        }
    }
    const deleteTask = async(id: string) => {
        const taskToDelete = tasks.find(task => task.id === id);
        // if(taskToDelete?.notificationId) {
        //     await Notifications.cancelScheduledNotificationAsync(taskToDelete.notificationId);
        // }
        try{
          const newTasks = tasks.filter(task => task.id !== id);
          await saveTasks(newTasks);
          if(taskToDelete)
          {
              AddLog("deleted", taskToDelete)
          }
        }
        catch{
            showNotification("Error deleting tasks");
        }
    }
    
    return(
        <TasksContext.Provider value={{tasks, addTask, updateTask, deleteTask, logs}}>
            {children}
        </TasksContext.Provider>
    );
}