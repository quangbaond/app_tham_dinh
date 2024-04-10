// LoginScreen.js
import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, ImageBackground, Text, Button, Alert, TouchableOpacity } from 'react-native';
import { getData, storeData } from '../common';


const LoginScreen = ({ navigation }: any) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const getUserLogin = async () => {
            const userLogin = await getData('userLogin');
            const userLoginParse = JSON.parse(userLogin as unknown as string);
            if(userLoginParse) {
                navigation.navigate('Trang cá nhân');
            }
        }
    }, []);

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
                <Text style={{ color: '#ffffff', fontSize: 20, marginBottom: 10, textShadowColor: 'rgba(0, 0, 0, 0.75)',  fontWeight: "500"}}>{'Đăng nhập'}</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Số điện thoại"
                    value={username}
                    onChangeText={setUsername}
                    placeholderTextColor="#ffffff"
                    returnKeyLabel='next'
                />
                <TextInput
                    style={styles.input}
                    placeholder="Mật khẩu"
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor="#ffffff"
                    secureTextEntry
                    returnKeyLabel='done'
                />
                    {/* <Button title="Đăng nhập" onPress={handleLogin} /> */}
                    <View>
                        <TouchableOpacity
                            style={{ backgroundColor: '#3366CC', padding: 5, borderRadius: 15, marginTop: 10, borderWidth: 1, borderColor: '#fff' }}
                            onPress={handleLogin}
                        >
                            <Text style={{ textAlign: 'center', color: '#fff' }}>Đăng nhập</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ backgroundColor: '#3366CC', padding: 5, borderRadius: 15, marginTop: 10, borderWidth: 1, borderColor: '#fff'}}
                            onPress={() => navigation.navigate('Đăng ký')}
                        >
                            <Text style={{ textAlign: 'center', color: '#fff' }}>Chưa có tài khoản? Đăng ký ngay</Text>
                        </TouchableOpacity>
                    </View>
                    
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({

    image: {
        // flex: 1,
        justifyContent: "center",
        width: '100%',
        height: '100%',
        alignContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        justifyContent: "center",

        fontFamily: 'Roboto',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        margin: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ffffff',
        borderRadius: 5,
        width: '90%',
        marginBottom: 20,
        padding: 5,
        color: '#ffffff',
        backgroundColor: 'rgba(255,255,255,0.5)',
    }
});


export default LoginScreen;
