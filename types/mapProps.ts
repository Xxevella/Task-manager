import { LatLng } from "react-native-maps";

export type mapProps = {
    visible: boolean,
    initialLocation: LatLng | null
    onCancel: () => void
    onConfirm: (location: LatLng) => void
}