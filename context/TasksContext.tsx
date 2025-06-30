import { Logs } from "@/types/logsType";
import { Task } from "@/types/taskType";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";
import { useNotification } from "./NotificationContext";
import NetInfo from "@react-native-community/netinfo"
import * as Notifications from 'expo-notifications';
import { taskNotification } from "@/functions/taskNotification";

const SERVER_URL = "http://192.168.0.156:3000"

const StorageKey = '@tasks_storage';
const LogsStorageKey = 'logs_storage';

const OfflineTaskStorageKey = 'offline_tasks_storage';
const OfflineLogsStorageKey = 'offline_logs_storage';

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
    const [isConnected, setIsConnected] = useState<boolean>(true)
    const {showNotification} = useNotification();

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state =>{
            setIsConnected(!!state.isConnected)
        });
        NetInfo.fetch().then(state => setIsConnected(!!state.isConnected));
        return () => unsubscribe();
    }, [])

    useEffect(() => {
        (async () => {
            try {
                const storedTasks = await AsyncStorage.getItem(StorageKey);
                if (storedTasks) {
                    setTasks(JSON.parse(storedTasks));
                }
                else if(isConnected){
                    const response = await fetch(`${SERVER_URL}/tasks`);
                    if(response.ok)
                    {
                        const serverTasks = await response.json()
                        setTasks(serverTasks)
                        await AsyncStorage.setItem(StorageKey, JSON.stringify(serverTasks))
                    }
                }

                const storedLogs = await AsyncStorage.getItem(LogsStorageKey)
                if(storedLogs)
                {
                    setLogs(JSON.parse(storedLogs))
                }
                else if(isConnected){
                    const response = await fetch(`${SERVER_URL}/logs`);
                    if(response.ok)
                    {
                        const serverLogs = await response.json()
                        setLogs(serverLogs)
                        await AsyncStorage.setItem(LogsStorageKey, JSON.stringify(serverLogs))
                    }
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
            showNotification("Error saving logs",3000, "green")
        }
    }
    const sendTaskToServer = async (task: Task) =>{
        const response = await fetch(`${SERVER_URL}/tasks`,{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(task),
        });
        if(!response.ok) showNotification("Failed to save task on server")
    }

    const sendLogsToServer = async (log: Logs) =>{
        const response = await fetch(`${SERVER_URL}/logs`,{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(log),
        });
        if(!response.ok) showNotification("Failed to save logs on server")
    }

    const addTaskOfflineQueue = async (task: Task, flag: "add" | "update" | "delete") =>{
        try{
            const que = await AsyncStorage.getItem(OfflineTaskStorageKey)
            const queue: Task[] = que ? JSON.parse(que) : [];

            const index = queue.findIndex(t => t.id === task.id)
            if(index !== -1)
            {
                queue[index] = {...task, _flag:flag}
            }
            else{
                queue.push({...task, _flag: flag})
            };
            await AsyncStorage.setItem(OfflineTaskStorageKey, JSON.stringify(queue))
        }
        catch{
            showNotification("Error to add offline tasks")
        }
    }
    
    const fetchTasksFromServer = async() =>{
        try{
            const response = await fetch(`${SERVER_URL}/tasks`)
            if(response.ok){
              const serverTasks = await response.json();
              setTasks(serverTasks);
              await AsyncStorage.setItem(StorageKey, JSON.stringify(serverTasks));
            }
        }
        catch{
            showNotification("Failed fetch task after sync")
        }
        
    }

    const fetchLogsFromServer = async() =>{
        try{
            const response = await fetch(`${SERVER_URL}/logs`)
            if(response.ok){
              const serverLogs = await response.json();
              serverLogs.sort((a:Logs, b:Logs) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              setLogs(serverLogs);
              await AsyncStorage.setItem(LogsStorageKey, JSON.stringify(serverLogs));
            }
        }
        catch{
            showNotification("Failed fetch logs after sync")
        }
        
    }

    const addLogsOfflineQueue = async (log: Logs) =>{
        try{
            const que = await AsyncStorage.getItem(OfflineLogsStorageKey)
            const queue: Logs[] = que ? JSON.parse(que) : [];
            queue.push(log);
            await AsyncStorage.setItem(OfflineLogsStorageKey, JSON.stringify(queue))
        }
        catch{
            showNotification("Error to add offline logs ")
        }
    }
    const synchOfflineTasksWithServer = async () =>{
        try{
            const que = await AsyncStorage.getItem(OfflineTaskStorageKey);
            const queue: Task[] = que ? JSON.parse(que) : []
            for (const task of queue){
                if(!task._flag) continue
                if(task._flag === "delete")
                {
                  const response = await fetch(`${SERVER_URL}/tasks/${task.id}`,{
                  method: "DELETE",
                  })
                  if(!response.ok) throw new Error
                }
                else if(task._flag === "add"){
                    const response = await fetch(`${SERVER_URL}/tasks/`, {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify(task),
                    });
                    if(!response.ok) throw new Error
                }
                else if(task._flag === "update")
                {
                    const response = await fetch(`${SERVER_URL}/tasks/${task.id}`, {
                        method: "PUT",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify(task),
                    });
                    if(!response.ok) throw new Error
                }
            }
            await AsyncStorage.removeItem(OfflineTaskStorageKey);
            await fetchTasksFromServer();
            showNotification("Tasks was synched with server",3000, "green")
        }catch{
            showNotification("Failed to synch tasks")
        }
    }

    const synchOfflineLogsWithServer = async () =>{
        try{
            const que = await AsyncStorage.getItem(OfflineLogsStorageKey);
            const queue: Logs[] = que ? JSON.parse(que) : []
            for (const logs of queue){
                await sendLogsToServer(logs)
            }
            await AsyncStorage.removeItem(OfflineLogsStorageKey);
            await fetchLogsFromServer();
            showNotification("Logs was synched with server",3000, "green")
        }catch{
            showNotification("Failed to synch logs")
        }
    }

    useEffect(() =>{
        if(isConnected)
        {
            showNotification("You are online again", 3000, "green");
            synchOfflineLogsWithServer();
            synchOfflineTasksWithServer();
        }
        else showNotification("You are offline")
    }, [isConnected])


    const AddLog = async(action: Logs["action"], task:Task) =>{
        try{
            const newLog: Logs = {
               id: `${task.id}_log_${Date.now()}`,
               timestamp: new Date().toISOString(),
               action,
               taskId:task.id,
               taskTitle: task.title
            };
            const updatedLogs = [newLog, ...logs];
            await saveLogs(updatedLogs);

            if(isConnected)
            {
                try{
                    await sendLogsToServer(newLog)
                }
                catch{
                    await addLogsOfflineQueue(newLog)
                    showNotification("Error sending logs to server, saved offline");
                }
            }else{
                await addLogsOfflineQueue(newLog)
            }
        }
        catch{
            showNotification("Error adding logs")
        }
    }

    const addTask = async(task: Task) => {
        const notificationId = await taskNotification(task.id, task.title, task.dateTime);
        task.notificationId = notificationId;
        try{
            await saveTasks([...tasks, task]);
            await AddLog("added", task)

            if(isConnected)
            {
                try{
                    await sendTaskToServer(task)
                }
                catch{
                    await addTaskOfflineQueue(task, "add");
                    showNotification("Error sending task to server, saved offline");
                }
            }
            else{
                await addTaskOfflineQueue(task, "add")
            }
        }
        catch (error) {
            if(notificationId) {
                await Notifications.cancelScheduledNotificationAsync(notificationId);
            }
            showNotification("Error saving tasks");
        }
    }

    const updateTask = async(updatedTask: Task) => {
        const oldTask = tasks.find(task => task.id === updatedTask.id);
        if(oldTask?.notificationId) {
            await Notifications.cancelScheduledNotificationAsync(oldTask.notificationId);
        }
        const newNotificationId = await taskNotification(updatedTask.id, updatedTask.title, updatedTask.dateTime);
        updatedTask.notificationId = newNotificationId;
        try{
            const newTasks = tasks.map(task => task.id === updatedTask.id ? updatedTask : task);
            await saveTasks(newTasks);
            await AddLog("updated", updatedTask)
            if(isConnected){
                try{
                    const response = await fetch(`${SERVER_URL}/tasks/${updatedTask.id}`,{
                        method: "PUT",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify(updatedTask),
                    })
                    if(!response.ok) throw new Error()
                }
                catch{
                    await addTaskOfflineQueue(updatedTask, "update");
                    showNotification("Error saving online, saved offline");
                }
            }
            else{
                await addTaskOfflineQueue(updatedTask, "update");
            }
        }
        catch (error) {
            if(newNotificationId) {
                await Notifications.cancelScheduledNotificationAsync(newNotificationId);
            }
            showNotification("Error saving tasks");
        }
    }
    const deleteTask = async(id: string) => {
        const taskToDelete = tasks.find(task => task.id === id);
        if(!taskToDelete)
        {
            showNotification("Task not found")
            return;
        }
        if(taskToDelete?.notificationId) {
            await Notifications.cancelScheduledNotificationAsync(taskToDelete.notificationId);
        }
        try{
          const newTasks = tasks.filter(task => task.id !== id);
          await saveTasks(newTasks);
          AddLog("deleted", taskToDelete)
          if(isConnected)
          {
            try{
                const response = await fetch(`${SERVER_URL}/tasks/${id}`,{
                    method: "DELETE",
                })
                if(!response.ok) throw new Error()
            }
            catch{
                await addTaskOfflineQueue({...taskToDelete, _flag:"delete"}, "delete")
            }
          } else{
            await addTaskOfflineQueue({...taskToDelete, _flag:"delete"}, "delete")
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