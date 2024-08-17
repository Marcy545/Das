import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, Alert, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { collection, addDoc, getDocs, deleteDoc, serverTimestamp, query, where, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from './../../firebaseConfig';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';


async function addTaskToFirebase(title, details, dueDate, userEmail, members) {
    try {
        const docRef = await addDoc(collection(db, 'Tasks'), {
            title,
            details,
            dueDate,
            createdAt: serverTimestamp(),
            userEmail,
            members: [userEmail, ...members],
            status: 'pending', 
        });
        console.log("Task added with ID", docRef.id);
        return true;
    } catch (error) {
        console.error("Error adding Task: ", error);
        return false;
    }
}

async function fetchTasksFromFireStore(userEmail) {
    try {
        const TasksCollection = collection(db, 'Tasks');
        const q = query(
            TasksCollection,
            where('members', 'array-contains', userEmail), 
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const Tasks = [];
        querySnapshot.forEach((doc) => {
            const TaskData = doc.data();
            Tasks.push({ id: doc.id, ...TaskData });
        });
        return Tasks;
    } catch (error) {
        console.error('Error fetching Tasks: ', error);
        return [];
    }
}


async function deleteTaskFromFirestore(TaskId) {
    try {
        console.log("Attempting to delete Task with ID: ", TaskId);
        await deleteDoc(doc(db, "Tasks", TaskId));
        return TaskId;
    } catch (error) {
        console.error("Error deleting Task: ", error);
        return null;
    }
}


async function updateTaskInFirestore(TaskId, updatedTask, userEmail) {
    try {
        console.log("Updating Task with ID:", TaskId);
        console.log("Updated data:", updatedTask);
        const TaskRef = doc(db, "Tasks", TaskId);
        await updateDoc(TaskRef, {
            ...updatedTask,
            userEmail, 
            members: updatedTask.members || [], 
            status: updatedTask.status || 'pending', 
        });
        console.log("Task updated successfully");
        return true;
    } catch (error) {
        console.error("Error updating Task: ", error);
        return false;
    }
}

// TaskForm Component
function TaskForm({ title, details, dueDate, members, setTitle, setDetails, setDueDate, setMembers, onSubmit, isUpdateMode, onSelectDate }) {
    return (
        <View style={styles.formContainer}>
            <Text style={styles.header}>{isUpdateMode ? "Update your Task" : "Create a Task"}</Text>
            <TextInput
                style={styles.input}
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                style={styles.input}
                placeholder="Details"
                value={details}
                onChangeText={setDetails}
                multiline
            />
            <View style={styles.dateContainer}>
                <TextInput
                    style={[styles.input, styles.dateInput]}
                    placeholder="Due Date"
                    value={dueDate}
                    onChangeText={setDueDate}
                    editable={false}
                />
                <TouchableOpacity onPress={onSelectDate} style={styles.selectButton}>
                    <Text style={styles.selectButtonText}>Select</Text>
                </TouchableOpacity>
            </View>
            <TextInput
                style={styles.input}
                placeholder="Members (comma-separated emails)"
                value={members.join(', ')}
                onChangeText={(text) => setMembers(text.split(',').map(email => email.trim()))}
            />
            <Button
                title={isUpdateMode ? "Update Task" : "Create a Task"}
                onPress={onSubmit}
            />
        </View>
    );
}

// TaskList Component
function TaskList({ Tasks, onUpdateClick, onDeleteClick, onStatusChange }) {
    return (
        <View style={styles.TaskList}>
            <Text style={styles.header}>Task List</Text>
            {Tasks.length === 0 ? (
                <Text>No tasks available</Text>
            ) : (
                Tasks.map((Task) => (
                    <View key={Task.id} style={[styles.TaskItem, Task.status === 'finished' && styles.finishedTask]}>
                        <View style={styles.taskContent}>
                            <TouchableOpacity onPress={() => onStatusChange(Task.id, Task.status === 'finished' ? 'pending' : 'finished')}>
                                <Icon
                                    name={Task.status === 'finished' ? 'check-box' : 'check-box-outline-blank'}
                                    size={24}
                                    color={Task.status === 'finished' ? 'green' : 'gray'}
                                />
                            </TouchableOpacity>
                            <View style={styles.taskTextContainer}>
                                <Text style={styles.TaskTitle}>{Task.title}</Text>
                                <Text>Due Date: {Task.dueDate}</Text>
                                <Text>{Task.details}</Text>
                            </View>
                        </View>
                        <View style={styles.buttonsContainer}>
                            <Button title="Update" onPress={() => onUpdateClick(Task)} />
                            <Button title="Delete" color="red" onPress={() => onDeleteClick(Task.id)} />
                        </View>
                    </View>
                ))
            )}
        </View>
    );
}

export default function HomeScreen() {
    const [title, setTitle] = useState("");
    const [details, setDetails] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [members, setMembers] = useState([]); 
    const [Tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [userEmail, setUserEmail] = useState(null); 
    const router = useRouter();

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserEmail(user.email); 
            } else {
                setUserEmail(null); 
            }
        });

        async function fetchTasks() {
            try {
                if (userEmail) {
                    const Tasks = await fetchTasksFromFireStore(userEmail);
                    setTasks(Tasks);
                }
            } catch (error) {
                console.error("Error fetching tasks: ", error);
            }
        }
        fetchTasks();
        return () => unsubscribe();
    }, [userEmail]);

    const handleSubmit = async () => {
        try {
            if (isUpdateMode) {
                if (selectedTask) {
                    const updatedTask = {
                        title,
                        details,
                        dueDate,
                        members, 
                    };
                    const success = await updateTaskInFirestore(selectedTask.id, updatedTask, userEmail);
                    if (success) {
                        setTitle("");
                        setDetails("");
                        setDueDate("");
                        setMembers([]);
                        setSelectedTask(null);
                        setIsUpdateMode(false);
                        setModalVisible(false);
                        Alert.alert("Task updated successfully");
                        const updatedTasks = await fetchTasksFromFireStore(userEmail);
                        setTasks(updatedTasks);
                    } else {
                        Alert.alert("Error updating Task");
                    }
                }
            } else {
                const added = await addTaskToFirebase(title, details, dueDate, userEmail, members);
                if (added) {
                    setTitle("");
                    setDetails("");
                    setDueDate("");
                    setMembers([]); 
                    setModalVisible(false);
                    Alert.alert("Task added to Firestore");
                    const updatedTasks = await fetchTasksFromFireStore(userEmail);
                    setTasks(updatedTasks);
                } else {
                    Alert.alert("Error adding Task");
                }
            }
        } catch (error) {
            console.error("Error in handleSubmit: ", error);
            Alert.alert("Error handling task submission");
        }
    };

    const handleUpdateClick = (Task) => {
        setTitle(Task.title || "");
        setDetails(Task.details || "");
        setDueDate(Task.dueDate || "");
        setMembers(Task.members || []); 
        setSelectedTask(Task);
        setIsUpdateMode(true);
        setModalVisible(true);
    };

    const handleDeleteClick = async (TaskId) => {
        try {
            const deletedTaskId = await deleteTaskFromFirestore(TaskId);
            if (deletedTaskId) {
                Alert.alert("Task deleted successfully");
                const updatedTasks = await fetchTasksFromFireStore(userEmail);
                setTasks(updatedTasks);
            } else {
                Alert.alert("Error deleting Task");
            }
        } catch (error) {
            console.error("Error deleting task: ", error);
            Alert.alert("Error deleting Task");
        }
    };

    const handleSignOut = () => {
        signOut(getAuth())
            .then(() => {
                router.push('/');
            })
            .catch((error) => {
                console.error("Sign Out Error", error);
                Alert.alert("Error signing out");
            });
    };

    const handleStatusChange = async (TaskId, newStatus) => {
        try {
            const updatedTask = { status: newStatus };
            const success = await updateTaskInFirestore(TaskId, updatedTask, userEmail);
            if (success) {
                const updatedTasks = await fetchTasksFromFireStore(userEmail);
                setTasks(updatedTasks);
            } else {
                Alert.alert("Error updating task status");
            }
        } catch (error) {
            console.error("Error updating task status: ", error);
            Alert.alert("Error updating Task status");
        }
    };

    const showDatePicker = () => {
        setDatePickerVisible(true);
    };

    const handleDateChange = (event, date) => {
        setDatePickerVisible(false);
        if (date) {
            setSelectedDate(date);
            setDueDate(date.toDateString());
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
                <Icon name="exit-to-app" size={40} color="black" />
            </TouchableOpacity>

            <ScrollView>
                <TaskForm
                    title={title}
                    details={details}
                    dueDate={dueDate}
                    members={members}
                    setTitle={setTitle}
                    setDetails={setDetails}
                    setDueDate={setDueDate}
                    setMembers={setMembers}
                    onSubmit={handleSubmit}
                    isUpdateMode={isUpdateMode}
                    onSelectDate={showDatePicker}
                />

                <TaskList
                    Tasks={Tasks}
                    onUpdateClick={handleUpdateClick}
                    onDeleteClick={handleDeleteClick}
                    onStatusChange={handleStatusChange}
                />
            </ScrollView>

            {datePickerVisible && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}

            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <TaskForm
                            title={title}
                            details={details}
                            dueDate={dueDate}
                            members={members}
                            setTitle={setTitle}
                            setDetails={setDetails}
                            setDueDate={setDueDate}
                            setMembers={setMembers}
                            onSubmit={handleSubmit}
                            isUpdateMode={isUpdateMode}
                            onSelectDate={showDatePicker}
                        />
                        <Button title="Close" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#684ccc',
    },
    signOutButton: {
        alignSelf: 'flex-end',
        padding: 10,
    },
    formContainer: {
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 8,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        padding: 8,
        marginBottom: 10,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    dateInput: {
        flex: 1,
        marginRight: 10,
    },
    selectButton: {
        padding: 8,
        backgroundColor: '#007BFF',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#007BFF',
    },
    selectButtonText: {
        color: 'white',
    },
    TaskList: {
        flex: 1,
    },
    TaskItem: {
        padding: 16,
        borderWidth: 1,
        borderColor: 'white',
        marginBottom: 10,
        backgroundColor: 'white',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },
    TaskTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonsContainer: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
    },
});

        
