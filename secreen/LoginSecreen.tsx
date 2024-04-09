// LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ImageBackground, Text, Button, Alert } from 'react-native';
import { storeData } from '../common';


const LoginScreen = ({ navigation }: any) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        fetch('https://tp.tucanhcomputer.vn/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phone: username,
                password: password,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if(data.error) {
                    Alert.alert('Lỗi', data.error);
                    return;
                }
                
                storeData('userLogin', JSON.stringify({
                    token: data.access_token,
                    user: data.user,
                }));
                
                Alert.alert('Thành công', 'Đăng nhập thành công');
                navigation.navigate('Trang cá nhân');
            })
            .catch((error) => {
                if(error) {
                    Alert.alert('Lỗi', 'Đăng nhập thất bại');
                }
            })
    };

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/logo/logo.jpg')} resizeMode="cover" style={styles.image}>
                <Text style={{ color: '#fff', fontSize: 25, marginBottom: 20 }}>{'Đăng nhập'}</Text>
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
                    <Button title="Đăng nhập" onPress={handleLogin} />
                    <Text 
                        onPress={() => navigation.navigate('Đăng ký')}
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
