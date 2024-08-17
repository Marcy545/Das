import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Start() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.topSection} />

            <View style={styles.header}>
                <Text style={styles.title}>ToDoDas</Text>
            </View>

            <View style={styles.buttonContainer}>
                <View style={styles.buttonWrapper}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={styles.loginButton}
                        onPress={() => router.push('./auth/Login')}
                    >
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={styles.registerButton}
                        onPress={() => router.push('./auth/Register')}
                    >
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topSection: {
        width: '100%',
        height: 500,
        backgroundColor: '#4158D0',
    },
    header: {
        backgroundColor: 'white',
        marginTop: -20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        height: 250,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 60,
        fontFamily: 'Typographica-Blp5',
        fontWeight: '300',
        textAlign: 'center',
        marginTop: 100,
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: 20,
        marginBottom:30
    },
    buttonWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    loginButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#6e6d6d',
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
    },
    registerButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#6e6d6d',
        borderTopRightRadius: 16,
        borderBottomRightRadius: 16,
    },
    buttonText: {
        fontSize: 16,
        color: 'white',
    },
});
