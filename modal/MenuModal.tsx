import { menuProps } from "@/types/menuProps";
import { useState } from "react";
import { FlatList, Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { router, useRouter } from "expo-router";

export default function MenuModal({
    visible,
    onClose,
    onMapSelect,
    onLogsSelect
}:menuProps)
{

    const options = [
        {label: "History", onPress: onLogsSelect},
        {label: "Map", onPress: onMapSelect},
    ];

    return(
        <Modal visible={visible} animationType="none" transparent={true}>
            <TouchableWithoutFeedback onPress={onClose}>
             <View style={{flex: 1, alignItems: "flex-end"}}>
                <View style={{width: 150, height: 100, backgroundColor: "transparent", marginRight: 20, marginTop: 50}}>
                    <FlatList
                        data={options}
                        renderItem={({item}) => (
                            <TouchableOpacity onPress={item.onPress} 
                             style={{padding: 10, backgroundColor: "white", borderColor: "#3b82f6", borderWidth: 1, borderRadius: 5}}>
                                <Text>{item.label}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
             </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
} 