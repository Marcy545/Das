import React from 'react';
import { Tabs } from 'expo-router';
import { Entypo } from '@expo/vector-icons';

const TabsLayout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: '#fdffff',
                    borderTopWidth: 0,
                    padding: 0,
                },
                tabBarShowLabel: false,
                tabBarActiveTintColor: '#4158D0',
                tabBarInactiveTintColor: '#322e2e',
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Entypo name="home" size={28} color={color} />,
                }}
            />
        </Tabs>
    );
};

export default TabsLayout;
