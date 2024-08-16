import { View, Text } from 'react-native'
import { Tabs, Redirect } from 'expo-router';
import { Entypo } from '@expo/vector-icons';

const TabsLayout = () => {
    return (
        <Tabs screenOptions={{
            tabBarStyle: {
                backgroundColor: '#fdffff',
                borderTopWidth: 0,
                padding: 0,
            },
            tabBarShowLabel: false,
            tabBarActiveTintColor: '#30bbb4',
            tabBarInactiveTintColor: '#322e2e',
        }}>
            <Tabs.Screen
                name='home'
                options={{
                    title:'Home',
                    headerShown:false,
                    tabBarIcon:({color}) => ( <Entypo name='home' size={28} color={color}/> )}}/>
            <Tabs.Screen
                name='Calendar'
                options={{
                    title:'Calendar',
                    headerShown:false,
                    tabBarIcon:({color}) => ( <Entypo name='calendar' size={28} color={color}/> )}}/>
            <Tabs.Screen
                name='others'
                options={{
                    title:'others',
                    headerShown:false,
                    tabBarIcon:({color}) => ( <Entypo name='dots-three-horizontal' size={28} color={color}/> )}}/>
        </Tabs>
    
    )
}

export default TabsLayout