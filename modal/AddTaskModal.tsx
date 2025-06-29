import { useNotification } from "@/context/NotificationContext";
import { Task } from "@/types/taskType";
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Image, Modal, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import 'react-native-get-random-values';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DropDownPicker from 'react-native-dropdown-picker'
import { v4 as uuidv4 } from "uuid";
import { Label } from "@react-navigation/elements";
import * as DocumentPicker from 'expo-document-picker';
import { FileInfo } from "@/types/fileInfo";
import MapSelectorModal from "./MapSelectorModal";

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
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([
      {label: "Office", value: "office"},
      {label: "Home", value: "home"},
      {label: "Other", value: "other"},
    ])
    const [file, setFile] = useState<FileInfo>(null);
    const [mapVisible, setMapVisible] = useState(false);
    const [locationCoords, setLocationCoords] = useState<{latitude: number, longitude: number} | null>(null);

    const openMap = () => setMapVisible(true);
    const closeMap = () => setMapVisible(false);

    const onLocationConfirm = (coord:{latitude: number, longitude: number}) => {
      setLocationCoords(coord);
      closeMap();
    }
    const pickFile = async () =>
    {
      const response = await DocumentPicker.getDocumentAsync({});
      if(!response.canceled)
      {
        setFile({
          name: response.assets[0].name,
          uri: response.assets[0].uri,
          size: response.assets[0].size
        });
        console.log(response)
      }
    }

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
        setFile(null);
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
            status: "In Progress",
            file
          });
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
      <TouchableWithoutFeedback onPress={handleClose}>
        <View
          className="flex-1 bg-black bg-opacity-50 items-center justify-center px-5"
          style={{ paddingVertical: 40 }}
        >
          <TouchableWithoutFeedback onPress={() => {}}>
            <Animated.View
              style={{
                width: width * 0.9,
                height: height * 0.8,
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
              <Text className="text-3xl font-bold text-center text-black">
                Add Task
              </Text>

              <View>
                <Text className="text-lg" style={{marginLeft: 10, marginTop: 10}}>Title</Text>
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
              <DropDownPicker
                open={open}
                value={location}
                items={items}
                setOpen={setOpen}
                setValue={setLocation}
                setItems={setItems}
                placeholder="or select from list"
                style={{height: 50,borderRadius: 24, borderColor: 'blue', borderWidth: 2,marginTop: 10, padding: 10}}
              />
              <View style={{alignItems: 'center', marginTop: 10, flexDirection: 'row'}}>
                <TouchableOpacity
                 onPress={pickFile}
                >
                 <Image source={require('../assets/images/attach.png')} style={{width: 30, height: 30, marginTop: 10, marginLeft: 10}} />
                </TouchableOpacity>
                {file?.uri && (
                  <Text
                  numberOfLines={1}
                  ellipsizeMode="tail" 
                  style={{maxWidth: 200, marginLeft: 20}}
                  >{file.name}</Text>
                )}
              </View>
              <View>
                <TouchableOpacity
                 onPress={openMap}
                >
                 <Text>Select location</Text>
                </TouchableOpacity>
                {locationCoords && (
                  <Text>Выбрана точка:
                     {locationCoords.latitude.toFixed(5)},
                     {locationCoords.longitude.toFixed(5)}
                  </Text>
                )}
                <MapSelectorModal 
                 visible={mapVisible}
                 initialLocation={locationCoords}
                 onCancel={() => setMapVisible(false)}
                 onConfirm={onLocationConfirm} />
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