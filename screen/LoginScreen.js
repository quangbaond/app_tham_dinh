// LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ImageBackground, Text } from 'react-native';
import { Button } from 'react-native-elements';

const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Logic kiểm tra đăng nhập ở đây
        if (username === 'admin' && password === 'admin') {
            navigation.navigate('Main');
        }
    };

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/logo/logo.jpg')} resizeMode="cover" style={styles.image}>
                <Text style={{ color: '#fff', fontSize: 25, marginBottom: 20 }}>{process.env.EXPO_PUBLIC_APP_NAME}</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Số điện thoại"
                    value={username}
                    onChangeText={setUsername}
                    placeholderTextColor="#fff"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Mật khẩu"
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor="#fff"
                    secureTextEntry
                />
                    <Button title="Đăng nhập" onPress={handleLogin} style={{ width: '100%' }} />
                    <Text 
                        onPress={() => navigation.navigate('Register')}
                        style={{ color: '#fff', marginTop: 20, textAlign: 'center' }}>
                        Chưa có tài khoản? Đăng ký ngay
                    </Text>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({

    image: {
        flex: 1,
        justifyContent: "center",
        width: '100%',
        height: '100%',
        alignContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        fontFamily: 'Roboto',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        margin: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        width: '90%',
        marginBottom: 20,
        padding: 10,
        color: '#fff',
        backgroundColor: 'rgba(255,255,255,0.2)',
    }


});


export default LoginScreen;
