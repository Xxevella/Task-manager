import { TasksContext } from "@/context/TasksContext";
import AddTaskModal from "@/modal/AddTaskModal";
import TaskDetailModal from "@/modal/taskDetailedModal";
import { statusColor } from "@/types/colorType";
import { Task } from "@/types/taskType";
import { format } from 'date-fns';
import { useNavigation } from "expo-router";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Dimensions, FlatList, Text, TouchableOpacity, View } from "react-native";



export default function Index() {

  const navigation = useNavigation();
  const context = useContext(TasksContext);
  if (!context) {
    return <Text>Loading...</Text>;
  } 
  const {tasks, addTask, updateTask, deleteTask} = context;
  const [sortedTasks, setSortedTasks] = useState(tasks);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailedModalVisible, setIsDetailedModalVisible] = useState(false);

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

    <View className="flex-1 pt-30 bg-white" style={{paddingTop: screenHight*0.07}}>
      <View className="justify-center border-2 border-blue-500 rounded-3xl h-20"
       style={{width: screenWidth*0.9, alignSelf: 'center'}}>
        <Text className="text-3xl text-center">Task Manager</Text>
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
             mt-5 border-2 border-blue-500 rounded-3xl px-5"
             onPress={()=>openTaskModal(item)}
             >
              <Text
               numberOfLines={1}
               ellipsizeMode="tail" 
               className="text-lg" 
               style={{maxWidth: screenWidth*0.12}}
              >
                {item.title}
              </Text>
              <Text className="text-lg">{date}</Text>
              <Text className="text-lg" style={{color: color}}>{item.status}</Text>
              <Text className="text-lg">...</Text>
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