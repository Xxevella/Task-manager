import { Task } from "@/types/taskType";
import { Children, createContext, use, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNotification } from "./NotificationContext";


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
    const [handlerMessage, setHandlerMessage] = useState<string|null>(null);
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
        await saveTasks([...tasks, task]);
    }

    const updateTask = async(updatedTask: Task) => {
        await saveTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    }
    const deleteTask = async(id: string) => {
        await saveTasks((tasks.filter(task => task.id !== id)));
    }
    return(
        <TasksContext.Provider value={{tasks, addTask, updateTask, deleteTask}}>
            {children}
        </TasksContext.Provider>
    );
}