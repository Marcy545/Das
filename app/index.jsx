import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-red-700">
      <Text style={{
        fontSize: 24, // Sesuaikan dengan ukuran font yang Anda inginkan
        fontFamily: 'Poppins-Black', // Contoh gaya font
        color: 'white' 
      }}>
        ToDoDas
      </Text>
      <StatusBar style="auto" />
      <Link href="/home" style={{ color: 'blue' }}>Go to Home</Link>
    </View>
  );
}
