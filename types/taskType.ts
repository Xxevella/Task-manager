export type Task = {
    id: string;
    title: string;
    description: string;
    dateTime: string;
    location: string;
    addedAt: string;
    status: "In Progress" | "Completed" | "Cancelled";
};