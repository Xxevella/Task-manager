import { menuProps } from "@/types/menuProps";
import { FlatList, Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

export default function MenuModal({
    visible,
    onClose,
    onMapSelect,
    onLogsSelect,
    onToggleTheme,
    theme
}:menuProps)
{

    const options = [
        {label: "History", onPress: onLogsSelect},
        {label: "Map", onPress: onMapSelect},
        {label: "Theme", onPress: onToggleTheme}
    ];

    const isDark = theme === "dark"
    const buttonBackground = isDark ? "#333" : "white"
    const buttonBorderColor = "#3b82f6"
    const textColor = isDark ? "white" : "black" 

    return(
            <Modal visible={visible} animationType="none" transparent={true}>
            <TouchableWithoutFeedback onPress={onClose}>
              <View style={{flex: 1, alignItems: "flex-end"}}>
                <View style={{width: 150, height: 160, backgroundColor: "transparent", marginRight: 20, marginTop: 50}}>
                    <FlatList
                        data={options}
                        renderItem={({item}) => (
                            <TouchableOpacity onPress={item.onPress} 
                             style={{padding: 10,
                              backgroundColor: buttonBackground,
                              borderColor: buttonBorderColor,
                              borderWidth: 1, borderRadius: 5}}>
                                <Text style={{color:textColor}}>{item.label}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
              </View>
             
            </TouchableWithoutFeedback>
          </Modal>
          
    )
} 