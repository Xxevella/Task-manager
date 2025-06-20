export type AddTaskType ={
    title: string;
    description: string;
    dateTime: Date;
    location: string;
    addedAt: string;
    status: "In Progress" | "Completed" | "Cancelled";
}