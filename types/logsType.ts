export type Logs = {
    id: string;
    timestamp: string;
    action: "added" | "updated" | "deleted";
    taskId: string;
    taskTitle: string;
}