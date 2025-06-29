import { TasksContext } from "@/context/TasksContext";
import { useNavigation } from "expo-router";
import { useContext, useLayoutEffect } from "react";
import { Text, View } from "react-native";

export default function logs(){
    const navigation = useNavigation();
    const context = useContext(TasksContext)
    if(!context)
    {
        return null;
    }
    const {logs} = context

     useLayoutEffect(() => {
            navigation.setOptions({
              headerTitle: "History"
            });
          })

    return(
        <View>
            {logs.map((log)=>(
                <Text key={log.id} style={{marginVertical:5}}>
                    ["{log.action}"] -- [{new Date(log.timestamp).toLocaleString()}] -- Задача "{log.taskTitle}" -- Id: {log.id}
                </Text>
            ))}
        </View>
    );
}