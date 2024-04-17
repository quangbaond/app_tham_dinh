// LoginScreen.js
import React, { useEffect, useRef, useState } from 'react';
import { View, TextInput, StyleSheet, ImageBackground, Text, Button, Alert, TouchableOpacity, Animated } from 'react-native';
import { Input } from 'react-native-elements';
import { getData, storeData } from '../common';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import { useForm, Controller } from "react-hook-form"


const LoginScreen = ({ navigation }: any) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            phone: "",
            password: "",
        },
    })

    useEffect(() => {
        const getUserLogin = async () => {
            const userLogin = await getData('userLogin');
            const userLoginParse = JSON.parse(userLogin as unknown as string);
            if (userLoginParse) {
                navigation.navigate('Trang cá nhân');
            }
        }
        fadeIn();
    }, []);

    const fadeIn = () => {
        // Will change fadeAnim value to 1 in 5 seconds
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
        }).start();
    };

    const handleLogin = async () => {
        setLoading(true);
        if (username === '' || password === '') {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
            return;
        }
        axios.post('https://tp.tucanhcomputer.vn/api/auth/login', {
            phone: username,
            password: password,
        }).then((res) => {
            console.log(res.data);
            storeData('userLogin', JSON.stringify({
                token: res.data.access_token,
                user: res.data.user,
            }));
            Alert.alert('Thành công', 'Đăng nhập thành công');
            navigation.navigate('Trang cá nhân');
        }).catch((err) => {
            console.log(err.response.data);
            if (err.response.data.phone) {
                Alert.alert('Lỗi', err.response.data.phone[0]);
            }
            if (err.response.data.password) {
                Alert.alert('Lỗi', err.response.data.password[0]);
            }

            if (err.response.data.error) {
                Alert.alert('Lỗi', err.response.data.error);
            }
        }).finally(() => {
            setLoading(false);
        });
    };

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.fadingContainer, { opacity: fadeAnim, }]}>
                <ImageBackground source={require('../assets/logo/logo.jpg')} resizeMode="cover" style={styles.image}>
                    {loading && <Spinner visible={loading}
                        textContent={'Đang tải...'}
                        textStyle={{ color: '#ffffff' }}></Spinner>}
                    <Text style={{ color: '#ffffff', fontSize: 20, marginBottom: 10, textShadowColor: 'rgba(0, 0, 0, 0.75)', fontWeight: "500" }}>{'Đăng nhập'}</Text>
                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                placeholder='Số điện thoại'
                                leftIcon={{ type: 'font-awesome', name: 'phone', color: '#fff' }}
                                value={value}
                                onChangeText={onChange}
                                containerStyle={{ width: '90%', backgroundColor: '#222', borderRadius: 10, height: 50, marginBottom: 10 }}
                                inputContainerStyle={{ borderBottomWidth: 0, padding: 0 }}
                                inputStyle={{ color: '#fff', marginLeft: 10 }}
                                inputMode='numeric'
                                errorStyle={{ color: 'red' }}
                                // errorMessage='ENTER A VALID ERROR HERE'
                            />
                        )}
                        name="phone"
                        rules={{ required: true, pattern: { value: /^[0-9]+$/, message: "Số điện thoại không hợp lệ" }}}
                        defaultValue=""
                    />
                    {errors.phone && <Text style={{ color: 'red' }}>{ errors.phone.message }</Text>}
                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                placeholder='Mật khẩu'
                                leftIcon={{ type: 'font-awesome', name: 'lock', color: '#fff' }}
                                value={value}
                                onChangeText={onChange}
                                containerStyle={{ width: '90%', backgroundColor: '#222', borderRadius: 10, height: 50, marginBottom: 10 }}
                                inputContainerStyle={{ borderBottomWidth: 0, padding: 0 }}
                                inputStyle={{ color: '#fff', marginLeft: 10 }}
                                secureTextEntry={true}
                                errorStyle={{ color: 'red' }}
                                errorMessage='ENTER A VALID ERROR HERE'
                            />
                        )}
                        name="password"
                        rules={{ required: true }}
                        defaultValue=""
                    />
                    <View>
                        <TouchableOpacity
                            style={{ backgroundColor: '#3366CC', padding: 13, borderRadius: 15, marginTop: 10, borderWidth: 1, borderColor: '#fff' }}
                            onPress={handleLogin}
                        >
                            <Text style={{ textAlign: 'center', color: '#fff', fontSize: 18 }}>Đăng nhập</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ backgroundColor: '#3366CC', padding: 13, borderRadius: 15, marginTop: 10, borderWidth: 1, borderColor: '#fff' }}
                            onPress={() => navigation.navigate('Đăng ký')}
                        >
                            <Text style={{ textAlign: 'center', color: '#fff', fontSize: 18 }}>Chưa có tài khoản? Đăng ký ngay</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    fadingContainer: {
        backgroundColor: 'powderblue',
    },

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
        // borderWidth: 1,
        // borderColor: '#ffffff',
        borderRadius: 10,
        // width: '90%',
        // marginBottom: 10,
        // padding: 13,
        color: '#ffffff',
        // backgroundColor: 'rgba(255,255,255,0.5)',
    }
});


export default LoginScreen;
