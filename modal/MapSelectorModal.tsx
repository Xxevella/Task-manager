import { mapProps } from "@/types/mapProps";
import { useEffect, useState } from "react";
import { Button, Modal, View } from "react-native";
import MapView, { LatLng, Marker } from "react-native-maps";

export default function MapSelectorModal({
    visible,
    initialLocation,
    onCancel,
    onConfirm
}:mapProps) {

    const [selectedLocation, setSelectedLocation] = useState<LatLng | null>(initialLocation);
    
    useEffect(() => {
        setSelectedLocation(initialLocation);
    },[initialLocation]);
    const onMapPress = (e: { nativeEvent: { coordinate: LatLng } }) => {
        setSelectedLocation(e.nativeEvent.coordinate);
    }

    const confirmHandler = () => {
        if (selectedLocation) {
            onConfirm(selectedLocation);
        }   
    }

    return (
        <Modal visible={visible} animationType="slide" transparent={false}>
            <View style={{flex: 1}}>
                <MapView
                style={{flex: 1}}
                 initialRegion={{
                    latitude: initialLocation?.latitude || 53.893009,
                    longitude: initialLocation?.longitude || 27.567444,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                 }}
                 onPress={onMapPress}
                >
                    {selectedLocation && (
                        <Marker coordinate={selectedLocation}/>
                    )}   
                </MapView>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Button title="Cancel" onPress={onCancel}/>
                    <Button title="Confirm" onPress={confirmHandler} disabled={!selectedLocation}/>
                </View>
            </View>
        </Modal>
    );
}