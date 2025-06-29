import ErrorHandler from "@/components/errorHandler";
import { useNotification } from "@/context/NotificationContext";
import { TasksContext } from "@/context/TasksContext";
import { HeaderTitle } from "@react-navigation/elements";
import { useNavigation } from "expo-router";
import { useContext, useLayoutEffect } from "react";
import { View } from "react-native";
import MapView, { MapMarker, Marker } from "react-native-maps";

export default function Map() {
    const navigation = useNavigation();
    const context = useContext(TasksContext);
    const {showNotification} = useNotification();
    if(!context) {
        return showNotification("Context not found");
    }
    const {tasks} = context;

    useLayoutEffect(() => {
        navigation.setOptions({
          headerTitle: "Map"
        });
      })

    const taskWithCoords = tasks.filter(task => task.locationCoords !== null);

    const markers = taskWithCoords.map(task=>({
        id: task.id,
        title: task.title,
        coordinate:{
            latitude: task.locationCoords?.latitude as number,
            longitude: task.locationCoords?.longitude as number
        },
    }));

    const initialRegion = markers.length > 0 ? {
        latitude: markers[0].coordinate.latitude!,
        longitude: markers[0].coordinate.longitude!,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05
    }:
    {
        latitude: 53.893009,
        longitude: 27.567444,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05
    }

    return (
        <View style={{flex:1}}> 
            <MapView initialRegion={initialRegion} style={{flex:1}}>
                {markers.map(marker =>{
                    if(typeof marker.coordinate.latitude !== "number"
                        || typeof marker.coordinate.longitude !== "number"
                    ){
                        return null;
                    }
                    return(
                        <MapMarker
                        key={marker.id}
                        coordinate={marker.coordinate}
                        title={marker.title}
                        />
                    )
                }  
                )}
            </MapView>
        </View>
    );
}