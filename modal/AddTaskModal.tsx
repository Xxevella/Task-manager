import { useNotification } from "@/context/NotificationContext";
import { Task } from "@/types/taskType";
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Modal, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import 'react-native-get-random-values';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { v4 as uuidv4 } from "uuid";

export default function AddTaskModal({
    visible,
    onClose,
    onAddTask,
}: {
    visible: boolean,
    onClose: () => void;
    onAddTask: (newTask: Task) => void;
}){
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dateTime, setDateTime] = useState<Date>(new Date());
    const [location, setLocation] = useState("");
    const [isActivePicker, setIsActivePicker] = useState(false);

    const {showNotification} = useNotification();

    const width = Dimensions.get('window').width
    const height = Dimensions.get('window').height

    const slideAnimation = useRef(new Animated.Value(height)).current;   

    useEffect(() => {
        if(visible){
            Animated.timing(slideAnimation, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }else{
            Animated.timing(slideAnimation, {
                toValue: height,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);
    if(!visible) return null;

    function resetForm() {
        setTitle("");
        setDescription("");
        setDateTime(new Date());
        setLocation("");
    }

    const handleAdd = () => {
        if(!title.trim())
        {   
            showNotification("Please enter a title",3000);
            return;
        }
        const dateTimeString = dateTime.toString().split('.')[0];
        onAddTask({
            id: uuidv4(),
            title,
            description,
            dateTime: dateTimeString,  
            location,
            addedAt: new Date().toISOString().split('.')[0],
            status: "In Progress"});
        resetForm();
        onClose()
    }

    const handleClose = () => {
        resetForm();
        onClose();
    }

    const handleConfirm = (date: Date) => {
        setDateTime(date);
        setIsActivePicker(false);
    }

    return(
        <Modal visible={visible} transparent animationType="none">
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          className="flex-1 bg-black bg-opacity-50 items-center justify-center px-5"
          style={{ paddingVertical: 40 }}
        >
          <TouchableWithoutFeedback onPress={() => {}}>
            <Animated.View
              style={{
                width: width * 0.9,
                height: height * 0.7,
                backgroundColor: "white",
                borderRadius: 24,
                padding: 20,
                transform: [{ translateY: slideAnimation }],
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
                elevation: 10,
              }}
            >
              <Text className="text-3xl font-bold text-center mb-6 text-black">
                Add Task
              </Text>

              <View>
                <Text className="text-lg" style={{marginLeft: 10}}>Title</Text>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Enter title"
                  style={{borderRadius: 24, borderColor: 'blue', borderWidth: 2, padding: 10}}
                />
              </View>

              <View style={{marginTop: 10}}>
                <Text className="text-lg" style={{marginLeft: 10}}>Description</Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Enter description"
                  multiline
                  numberOfLines={3}
                  style={{borderRadius: 24, borderColor: 'blue', borderWidth: 2, padding: 10}}
                />
              </View>

              <View style={{marginTop: 10}}>
                <Text className="text-lg" style={{marginLeft: 10}}>Date & Time</Text>
                <TouchableOpacity
                  onPress={() => setIsActivePicker(true)}
                  className="border border-blue-500 rounded-2xl px-4 py-2"
                >
                  <Text className="text-black" style={{borderRadius: 24, borderColor: 'blue', borderWidth: 2, padding: 10}}>
                    {dateTime.toLocaleString()}
                  </Text>
                </TouchableOpacity>

                {isActivePicker && (
                  <DateTimePickerModal
                    isVisible={isActivePicker}
                    mode="datetime"
                    date={dateTime}
                    onConfirm={handleConfirm}
                    onCancel={() => setIsActivePicker(false)}
                  />
                )}
              </View>

              <View style={{marginTop: 10}}>
                <Text className="text-lg" style={{marginLeft: 10}}>Location</Text>
                <TextInput
                  value={location}
                  onChangeText={setLocation}
                  placeholder="Enter location"
                  style={{borderRadius: 24, borderColor: 'blue', borderWidth: 2, padding: 10}}
                />
              </View>

              <View className="flex-row justify-between">
                <TouchableOpacity
                  onPress={() => {
                    resetForm();
                    onClose();
                  }}
                  style={{backgroundColor:'red', borderRadius: 24, padding: 10, width: 100, alignItems: 'center', marginTop: 20}}
                >
                  <Text className="text-gray-700 font-semibold">Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleAdd}
                  style={{backgroundColor:'#14db19', borderRadius: 24, padding: 10, width: 100, alignItems: 'center', marginTop: 20}}
                >
                  <Text className="text-white font-semibold">Add Task</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
    );
}