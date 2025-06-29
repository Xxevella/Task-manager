import { FileInfo } from "./fileInfo";

export type Task = {
    id: string;
    title: string;
    description: string;
    dateTime: string;
    location: string;
    addedAt: string;
    status: "In Progress" | "Completed" | "Cancelled";
    file: FileInfo;
    notificationId?: string | undefined;
    locationCoords?: {latitude: number, longitude: number};
};