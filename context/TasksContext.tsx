import { Task } from "@/types/taskType";
import { Children, createContext, use, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNotification } from "./NotificationContext";
import { taskNotification } from "@/functions/taskNotification";
import Notifications from "expo-notifications";


const StorageKey = '@tasks_storage';

type TasksContextType = {
    tasks: Task[];
    addTask: (task: Task) => Promise<void>;
    updateTask: (task: Task) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
};

export const TasksContext = createContext<TasksContextType | undefined>(undefined)

type TasksProviderProps = {
    children: React.ReactNode;
};

export function TasksProvider({children}:TasksProviderProps) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const {showNotification} = useNotification();

    useEffect(() => {
        (async () => {
            try {
                const storedTasks = await AsyncStorage.getItem(StorageKey);
                if (storedTasks) {
                    setTasks(JSON.parse(storedTasks));
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

    const addTask = async(task: Task) => {
        // const notificationId = await taskNotification(task.id, task.title, task.dateTime);
        // task.notificationId = notificationId;
        try{
            await saveTasks([...tasks, task]);
            console.log(task)
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
        }
        catch (error) {
            // if(newNotificationId) {
            //     await Notifications.cancelScheduledNotificationAsync(newNotificationId);
            // }
            showNotification("Error saving tasks");
        }
    }
    const deleteTask = async(id: string) => {
        // const taskToDelete = tasks.find(task => task.id === id);
        // if(taskToDelete?.notificationId) {
        //     await Notifications.cancelScheduledNotificationAsync(taskToDelete.notificationId);
        // }
        const newTasks = tasks.filter(task => task.id !== id);
        await saveTasks(newTasks);
    }
    
    return(
        <TasksContext.Provider value={{tasks, addTask, updateTask, deleteTask}}>
            {children}
        </TasksContext.Provider>
    );
}