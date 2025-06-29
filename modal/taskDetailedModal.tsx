import { useNotification } from "@/context/NotificationContext";
import { FileInfo } from "@/types/fileInfo";
import { Task } from "@/types/taskType";
import { useEffect, useRef, useState } from "react";
import * as DocumentPicker from 'expo-document-picker';
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
let height1 = height*1.31;

type Props = {
    visible: boolean;
    task: Task;
    onClose:() => void;
    onSave: (updatedTask: Task) => void;
    onDelete: (taskId: string) => void;
}

type Status = "Completed" | "Cancelled" | "In Progress";

const statusOptions:{
    label: Status;
    icon: string;
}[] = [
    {label: "Completed", icon: "✓"},
    {label: "Cancelled", icon: "✗"},
    {label: "In Progress", icon: ""},
];

export default function TaskDetailModal({
  visible,
  task,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [dateTime, setDateTime] = useState(new Date(task.dateTime));
  const [location, setLocation] = useState(task.location);
  const [status, setStatus] = useState<Status>(task.status as Status);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [file, setFile] = useState<FileInfo>(null);

  const {showNotification} = useNotification();
  const slideAnimation = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible) {
      setTitle(task.title);
      setDescription(task.description);
      setDateTime(new Date(task.dateTime));
      setLocation(task.location);
      setStatus(task.status as Status);

      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnimation, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, task]);

  if (!visible) return null;

  const handleConfirmDate = (date: Date) => {
    setDateTime(date);
    setPickerVisible(false);
  };

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
    
  const toggleStatus = () => {
    const currentIndex = statusOptions.findIndex((o) => o.label === status);
    const nextIndex = (currentIndex + 1) % statusOptions.length;
    setStatus(statusOptions[nextIndex].label);
  };

  const handleSave = () => {
    if (!title.trim()) {
        showNotification("Please enter a title",3000);
      return;
    }
    onSave({
      ...task,
      title,
      description,
      dateTime: dateTime.toISOString(),
      location,
      status,
      file
    });
    onClose();
  };

  const handleDelete = () => {
    onDelete(task.id);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={{
            flex:1,
            backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <TouchableWithoutFeedback onPress={() => {}}>
            <Animated.View
              style={{
                position: "absolute",
                width: width * 0.9,
                height: height * 0.94,
                backgroundColor: "white",
                borderRadius: 24,
                padding: 20,
                transform: [{ translateY: slideAnimation }],
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
                elevation: 10,
                top: height * 0.04,
              }}
            >
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: 15,
                  color: "#000",
                }}
              >
                Task Details
              </Text>

              <Text style={{ marginBottom: 4, fontWeight: "600", marginLeft:10,}}>Title</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Title"
                style={{
                  borderWidth: 2,
                  borderColor: "blue",
                  borderRadius: 20,
                  padding: 10,
                  marginBottom: 12,
                }}
              />

              <Text style={{ marginBottom: 4, fontWeight: "600", marginLeft:10, }}>
                Description
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Description"
                multiline
                numberOfLines={3}
                style={{
                  borderWidth: 2,
                  borderColor: "blue",
                  borderRadius: 20,
                  padding: 10,
                  marginBottom: 12,
                  textAlignVertical: "top",
                }}
              />
              <Text style={{ marginBottom: 4, fontWeight: "600", marginLeft:10, }}>
                Date & Time
              </Text>
              <TouchableOpacity
                onPress={() => setPickerVisible(true)}
                style={{
                  borderWidth: 2,
                  borderColor: "blue",
                  borderRadius: 20,
                  padding: 10,
                  marginBottom: 12,
                }}
              >
                <Text>{dateTime.toLocaleString()}</Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isPickerVisible}
                mode="datetime"
                date={dateTime}
                onConfirm={handleConfirmDate}
                onCancel={() => setPickerVisible(false)}
              />

              <Text style={{ marginBottom: 4, fontWeight: "600", marginLeft:10, }}>Location</Text>
              <TextInput
                value={location}
                onChangeText={setLocation}
                placeholder="Location"
                style={{
                  borderWidth: 2,
                  borderColor: "blue",
                  borderRadius: 20,
                  padding: 10,
                  marginBottom: 12,
                }}
              />

              <Text style={{ marginBottom: 4, fontWeight: "600", marginLeft:10, }}>Added At</Text>
              <Text
                style={{
                  borderWidth: 2,
                  borderColor: "gray",
                  borderRadius: 20,
                  padding: 10,
                  marginBottom: 12,
                  color: "gray",
                }}
              >
                {new Date(task.addedAt).toLocaleString()}
              </Text>

              <Text style={{ marginBottom: 8, fontWeight: "600", alignSelf: "center" }}>Status</Text>
              <TouchableOpacity
                onPress={toggleStatus}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderWidth: 2,
                  borderColor: "blue",
                  borderRadius: 20,
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  justifyContent: "center",
                  width: 140,
                  alignSelf: "center",
                  userSelect: "none",
                  height: 48,
                }}
                activeOpacity={0.7}
              >
                <Text style={{ fontSize: 20, marginRight: 10, }}>
                  {statusOptions.find((s) => s.label === status)?.icon || ""}
                </Text>
                <Text style={{ fontSize: 18 }}>{status}</Text>
              </TouchableOpacity>

              <View style={{alignItems: 'center', marginTop: 10, flexDirection: 'row'}}>
                <TouchableOpacity
                 onPress={pickFile}
                >
                 <Image source={require('../assets/images/attach.png')} style={{width: 30, height: 30, marginTop: 10, marginLeft: 10}} />
                </TouchableOpacity>
                {task.file?.uri && (
                  <Text
                  numberOfLines={1}
                  ellipsizeMode="tail" 
                  style={{maxWidth: 200, marginLeft: 20}}
                  >{task.file.name}</Text>
                )}
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  onPress={handleDelete}
                  style={{
                    backgroundColor: "red",
                    borderRadius: 24,
                    paddingVertical: 12,
                    paddingHorizontal: 30,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Delete
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSave}
                  style={{
                    backgroundColor: "#14db19",
                    borderRadius: 24,
                    paddingVertical: 12,
                    paddingHorizontal: 30,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}