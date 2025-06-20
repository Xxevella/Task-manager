import React, { useEffect } from "react";
import { Animated, Dimensions, Text } from "react-native";

type handlerProps = {
    message: string;
    duration: number | null;
    onHide: () => void;
}

const width = Dimensions.get('window').width

export default function ErrorHandler({message, duration = 3000, onHide}: handlerProps) {
    const opacity = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();

        const timeout = setTimeout(() => {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(()=> onHide());}, duration || 3000);
        return () => clearTimeout(timeout);
    }, [message,duration]);

    return (
        <Animated.View style={{
            position: 'absolute',
            top: 50,
            left: 0,
            right: 0,
            width,
            opacity,
            alignItems: 'center',
            backgroundColor: 'red',
            padding: 10,
            borderRadius: 8,
            zIndex: 1000,
        }}>
            <Text style={{color: 'white'}}>{message}</Text>
        </Animated.View>
    )
};