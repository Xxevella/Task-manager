import ErrorHandler from "@/components/errorHandler";
import { createContext, useContext, useState } from "react";

type NotificationContextType = {
    showNotification: (message: string, duration?: number, backgroundColor?: string) => void
};

const NotificationContext = createContext<NotificationContextType | null>(null);

export function useNotification() {
    const context = useContext(NotificationContext);

    if(!context) {
        throw new Error("Context not found");
    }
    return context;
}

export function NotificationProvider({children}: {children: React.ReactNode}) {

    const [message, setMessage] = useState<string|null>(null)
    const [duration, setDuration] = useState<number|null>(null)
    const [color, setColor] = useState<string|null>(null)

    const showNotification = (message: string, duration = 3000, backgroundColor = "red") => {
        setMessage(message);
        setDuration(duration);
        setColor(backgroundColor)
    }
    return (
        <NotificationContext.Provider value={{showNotification}}>
            {children}
            {message && (
                <ErrorHandler message={message} duration={duration} onHide={() => setMessage(null)} backgroundColor={color || "red"} />
            )}
        </NotificationContext.Provider>
    );
}