import { TasksContext } from "@/context/TasksContext";
import { useTheme } from "@/context/ThemeContext";
import AddTaskModal from "@/modal/AddTaskModal";
import MenuModal from "@/modal/MenuModal";
import TaskDetailModal from "@/modal/taskDetailedModal";
import { statusColor } from "@/types/colorType";
import { Task } from "@/types/taskType";
import { format } from 'date-fns';
import { router, useNavigation } from "expo-router";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Dimensions, FlatList, Image, Text, TouchableOpacity, View } from "react-native";

export default function Index() {

  const navigation = useNavigation();
  const context = useContext(TasksContext);
  if (!context) {
    return <Text>Loading...</Text>;
  }
  const {theme, toggleTheme} = useTheme() 
  const {tasks, addTask, updateTask, deleteTask} = context;
  const [sortedTasks, setSortedTasks] = useState(tasks);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailedModalVisible, setIsDetailedModalVisible] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [navigateToMap, setNavigateToMap] = useState(false);
  const [navigateToLogs, setNavigateToLogs] = useState(false);


  //Styles
  const isDark = theme === "dark"
  const backgroundColor = isDark ? "#121212" : "white"
  const textColor = isDark ? "white" : "black"
  const borderColor = isDark ? "#5599FF" : "#3B82F6"

  const menuIcon = isDark ? require("@/assets/images/menuDark.png") : require("@/assets/images/menuLight.png")
  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  })

  useEffect(()=>{
    setSortedTasks(tasks);
  }, [tasks]);

  function sortByAddedAt() {
    const sorted = [...tasks].sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
    setSortedTasks(sorted);
  }
  function sortByStatus(){
    const sortOrder = ["Completed", "In Progress", "Cancelled"];

    const sorted = [...tasks].sort((a, b) =>{
      const indexA = sortOrder.indexOf(a.status);
      const indexB = sortOrder.indexOf(b.status);
      return indexA - indexB;
    });
    setSortedTasks(sorted);
  }
function openMenu() {
  setIsMenuVisible(true);
}

function closeMenu() {
  setIsMenuVisible(false);
}

useEffect(()=>{
  if(!isMenuVisible && navigateToMap){
    router.push("/map")
    setNavigateToMap(false);
  }
}, [isMenuVisible, navigateToMap])

useEffect(()=>{
  if(!isMenuVisible && navigateToLogs){
    router.push("/logs")
    setNavigateToLogs(false);
  }
}, [isMenuVisible, navigateToLogs])

const handleMapDirect = () =>{
  setNavigateToMap(true);
  closeMenu()
}

const handleLogsDirect = () =>{
  setNavigateToLogs(true);
  closeMenu()
}
const handleMenuClose = () =>{
  setIsMenuVisible(false);
}
function openTaskModal(task: Task){
  setSelectedTask(task)
  setIsDetailedModalVisible(true)
}

function closeTaskModal() {
  setIsDetailedModalVisible(false);
  setSelectedTask(null);
}

function handleSaveTask(updatedTask: Task) {
  updateTask(updatedTask);
}

function handleDeleteTask(taskId: string) {
  deleteTask(taskId);
}

  const screenHight = Dimensions.get('window').height
  const screenWidth = Dimensions.get('window').width

  return (

    <View style={{flex:1, backgroundColor: backgroundColor, paddingTop: screenHight*0.07}}>
      <View style={{
          justifyContent: "center",
          borderWidth: 2,
          borderColor: borderColor,
          borderRadius: 24,
          height: 80,
          width: screenWidth * 0.9,
          alignSelf: "center",
          alignItems: "center",
          position: "relative",
        }}
        >
        <Text style={{color:textColor, fontSize: 24}}>Task Manager</Text>
        <TouchableOpacity onPress={openMenu} style={{position: 'absolute', top: 25, right: 10}}>
        <Image
          source={menuIcon}
          style={{width: 30, height: 30}}
        />
      </TouchableOpacity>
      <MenuModal visible={isMenuVisible}
       onClose={handleMenuClose} 
       onMapSelect={handleMapDirect} 
       onLogsSelect={handleLogsDirect} 
       onToggleTheme={toggleTheme}
       theme={theme}
      />
      </View>
        <TouchableOpacity
         onPress={()=>setIsAddModalVisible(true)}
         className="bg-green-500 mt-20 rounded-3xl h-10 w-40 justify-center"
         style={{marginRight: screenWidth*0.05, alignSelf: 'flex-end'}}
        >
        <Text className="text-black text-center text-lg">Create Task</Text>
      </TouchableOpacity>
      <View className="flex-row justify-between mt-10">
        <TouchableOpacity
         onPress={()=>sortByAddedAt()}
         className="bg-yellow-400 rounded-3xl h-10 w-40 justify-center"
         style={{marginLeft: screenWidth*0.05}}
        >  
        <Text className="text-black text-center text-lg">By Added At</Text>
      </TouchableOpacity>
        <TouchableOpacity
         onPress={()=>sortByStatus()}
         className="bg-yellow-400 rounded-3xl h-10 w-40 justify-center"
         style={{marginRight: screenWidth*0.05}}
        >
        <Text className="text-black text-center text-lg">By Status</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, width: screenWidth * 0.9, alignSelf: 'center', marginTop: 10, paddingBottom: 50}}>
        <FlatList
        data={sortedTasks}
        keyExtractor={task => task.id}
        renderItem={({item}) =>{
          const date = format(new Date(item.dateTime), 'yyyy-MM-dd HH:mm')
          const color = statusColor[item.status]
          return(
            <TouchableOpacity className="flex-1 flex-row justify-between items-center
             mt-5 border-2 rounded-3xl px-5"
             style={{borderColor:borderColor}}
             onPress={()=>openTaskModal(item)}
             >
              <Text
               numberOfLines={1}
               ellipsizeMode="tail" 
               className="text-lg" 
               style={{maxWidth: screenWidth*0.12, color:textColor}}
              >
                {item.title}
              </Text>
              <Text className="text-lg" style={{color:textColor}}>{date}</Text>
              <Text className="text-lg" style={{color: color}}>{item.status}</Text>
              <Text className="text-lg" style={{color:textColor}}>...</Text>
            </TouchableOpacity>
          )}
        }
      />
      </View>
      
      <AddTaskModal
       visible={isAddModalVisible}
       onClose={() => setIsAddModalVisible(false)}
       onAddTask={async (task) => {
        await addTask(task);
        setIsAddModalVisible(false)
        }}
      />
      {selectedTask && (
        <TaskDetailModal
          visible={isDetailedModalVisible}
          task={selectedTask}
          onClose={closeTaskModal}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
        />
      )}
    </View>
  );
}