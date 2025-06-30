import { TasksContext } from "@/context/TasksContext";
import { useTheme } from "@/context/ThemeContext";
import { useNavigation } from "expo-router";
import { useContext, useLayoutEffect } from "react";
import { FlatList, Text, View } from "react-native";

export default function logs(){
    const navigation = useNavigation();
    const context = useContext(TasksContext);
    const {theme} = useTheme();

    const isDark = theme === "dark"
    const textColor = isDark ? "white" : "black"
    const backgroundColor = isDark ? "#121212" : "white"

    if(!context)
    {
        return null;
    }
    const {logs} = context

     useLayoutEffect(() => {
            navigation.setOptions({
              headerTitle: "History",
              headerStyle:{
                backgroundColor: backgroundColor
              },
              headerTintColor: textColor
            });
          })

    const renderItem = ({item}:any) => {
        return(
        <Text style={{marginVertical: 5, color:textColor}}>
             ["{item.action}"] -- [{new Date(item.timestamp).toLocaleString()}] -- Task "{item.taskTitle}" -- Id: {item.id}
        </Text>
        )
    }
    return(
        <View style={{flex:1, padding:10, backgroundColor: backgroundColor}}>
            <FlatList
               data={logs}
               keyExtractor={(item) => item.id}
               renderItem={renderItem}
               showsVerticalScrollIndicator={true}
            />        
        </View>
    );
}