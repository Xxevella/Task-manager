import * as Notifications from "expo-notifications";


export async function taskNotification(taskId: string, taskTitle:string, taskDateString:string){
    const taskDate = new Date (taskDateString);
    const now = new Date();
    const notifyTime = new Date(taskDate.getTime()- 30 * 60 * 1000);

    if(notifyTime <= now)
    {
        console.log("Notification was expired")
        return
    }
    const {status} = await Notifications.requestPermissionsAsync();
          if(status !== "granted"){
            alert("Notification permission not granted");
            return;
          }

    const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
            title: "Task Reminder",
            body: `${taskTitle} is in 30 minutes`,
            sound: "default",
            priority: Notifications.AndroidNotificationPriority.HIGH,
            data: {
                taskId: taskId
            },
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: notifyTime
        }
    })

    console.log("Уведомление запланировано на", notifyTime.toLocaleString());

    return notificationId;
}