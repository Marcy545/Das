import { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Image, TextInput, ToastAndroid } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { AntDesign, Entypo } from '@expo/vector-icons'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from './../../firebaseConfig';
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function Register() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const OncreateAccounts = () => {
        if (!email || !password || !username) {
            ToastAndroid.show('Please enter all details', ToastAndroid.BOTTOM);
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log(user);
                // Navigate to Login page
                router.push('/auth/Login');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage, errorCode);
                ToastAndroid.show('Registration failed. Please try again.', ToastAndroid.BOTTOM);
            });
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#4158D0' }}>
            <ScrollView>
                <View style={{ padding: 16 }}>
                    <TouchableOpacity 
                        onPress={() => router.back()} 
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            borderWidth: 1,
                            borderColor: '#ccc',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <AntDesign name="arrowleft" size={20} color="white" />
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image 
                        source={require('../../assets/Icons/Icons00.png')}
                        style={{ width: 192, height: 192, borderRadius: 16 }} 
                        resizeMode="cover"
                    />
                    <Text style={{
                        fontSize: 40,
                        fontFamily: 'Poppins-Black',
                        color: 'white',
                        marginTop: 16
                    }}>
                        /Create Your Account
                    </Text>

                    {/* Username */}
                    <Text style={{
                        fontSize: 20,
                        fontFamily: 'Poppins-Light',
                        color: 'white',
                        marginTop: 8,
                        alignSelf: 'flex-start',
                        paddingLeft: 28
                    }}>
                        Username
                    </Text>
                    <View style={{ 
                        width: '100%', 
                        paddingHorizontal: 16,
                    }}>
                        <View style={{
                            width: '100%',
                            height: 50,
                            paddingHorizontal: 12,
                            backgroundColor: '#ffffff',
                            borderRadius: 15,
                            borderWidth: 1,
                            borderColor: '#fdfdfd',
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 2
                        }}>
                            <TextInput 
                                value={username}
                                placeholder='Enter Your Username'
                                style={{ flex: 1, fontSize: 16, color: 'black' }}
                                onChangeText={(value) => setUsername(value)}
                            />
                        </View>
                    </View>

                    {/* Email */}
                    <Text style={{
                        fontSize: 20,
                        fontFamily: 'Poppins-Light',
                        color: 'white',
                        marginTop: 5,
                        alignSelf: 'flex-start',
                        paddingLeft: 28
                    }}>
                        Email
                    </Text>
                    <View style={{ 
                        width: '100%', 
                        paddingHorizontal: 16,
                    }}>
                        <View style={{
                            width: '100%',
                            height: 50,
                            paddingHorizontal: 12,
                            backgroundColor: '#ffffff',
                            borderRadius: 15,
                            borderWidth: 1,
                            borderColor: '#fdfdfd',
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 2
                        }}>
                            <TextInput 
                                value={email}
                                placeholder='Enter Your Email'
                                style={{ flex: 1, fontSize: 16, color: 'black' }}
                                onChangeText={(value) => setEmail(value)}
                            />
                        </View>
                    </View>

                    {/* Password */}
                    <View style={{ 
                        width: '100%', 
                        paddingHorizontal: 16,
                        marginTop: 8
                    }}>
                        <Text style={{
                            fontSize: 20,
                            fontFamily: 'LibreBaskerville-Regular',
                            color: '#ffffff'
                        }}>Password</Text>
                        <View style={{
                            width: '100%',
                            height: 50,
                            paddingHorizontal: 12,
                            backgroundColor: '#ffffff',
                            borderRadius: 15,
                            borderWidth: 1,
                            borderColor: '#fdfdfd',
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 2
                        }}>
                            <TextInput
                                value={password}
                                placeholder='Enter Your Password'
                                style={{ flex: 1, fontSize: 16, color: 'black' }}
                                secureTextEntry={!showPassword}
                                onChangeText={(value) => setPassword(value)}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Entypo
                                    name={showPassword ? 'eye-with-line' : 'eye'}
                                    size={24}
                                    color="black"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ 
                        width: '100%', 
                        paddingHorizontal: 16,
                        marginTop: 20
                    }}>
                        <TouchableOpacity 
                            onPress={OncreateAccounts}
                            style={{
                                padding: 15,
                                backgroundColor: 'black',
                                borderRadius: 15,
                                borderWidth: 1,
                                borderColor: 'white',
                                alignItems: 'center'
                            }}
                        >
                            <Text style={{
                                color: 'white',
                                fontSize: 16,
                                fontFamily: 'LibreBaskerville-Regular'
                            }}>Register</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
