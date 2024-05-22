// LoginScreen.js
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ImageBackground, Text, Alert, TouchableOpacity, Animated } from 'react-native';
import { Input } from 'react-native-elements';
import { getData, storeData } from '../common';
import axios from '../common/axios';
import Spinner from 'react-native-loading-spinner-overlay';
import { useForm, Controller } from "react-hook-form"
import LinearGradient from 'react-native-linear-gradient';


const LoginScreen = ({ navigation }: any) => {
    const [loading, setLoading] = useState(false);
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const icon = {
        inputIconPhone: {
            type: 'font-awesome',
            name: 'phone',
            color: '#222',
            size: 20
        },
        inputIconPassword: {
            type: 'font-awesome',
            name: 'lock',
            color: '#222',
            size: 20
        },
        inputRightIconPassword: {
            type: 'font-awesome',
            name: secureTextEntry ? 'eye-slash' : 'eye',
            color: '#222',
            size: 20,
            onPress: () => {
                setSecureTextEntry(!secureTextEntry);
            }
        }
    }

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

    const handleLogin = async (data) => {
        setLoading(true);
        if (data.phone === '' || data.password === '') {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
        }
        axios.post(`/auth/login`, {
            phone: data.phone,
            password: data.password,
        }).then((res) => {
            console.log(res.data);
            storeData('userLogin', JSON.stringify({
                token: res.data.access_token,
                user: res.data.user,
            }));
            Alert.alert('Thành công', 'Đăng nhập thành công');
            navigation.navigate('Trang cá nhân');
        }).catch((err) => {
            console.log(err.message);
        }).finally(() => {
            setLoading(false);
        });
    };

    return (
        <LinearGradient colors={['#5fe3ff', '#718ce0', '#eaffff', '#5fe3ff']} start={{ x: 0.7, y: 0 }} style={styles.container}>
            <Animated.View style={[styles.fadingContainer, { opacity: fadeAnim, }]}>
                {/* <ImageBackground source={require('../assets/logo/logo.jpg')} resizeMode="cover" style={styles.image}> */}
                {loading && <Spinner visible={loading}
                    textContent={'Đang tải...'}
                    textStyle={{ color: '#ffffff' }}>
                </Spinner>}
                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                    <ImageBackground source={require('../assets/logo/aapp_2.jpg')} style={{ width: 100, height: 100, borderRadius: 50 }}></ImageBackground>
                </View>
                <Text style={{ color: '#ffffff', fontSize: 25, marginBottom: 10, textShadowColor: 'rgba(0, 0, 0, 0.75)', fontWeight: "500", textAlign: 'center' }}>{'Đăng nhập'}</Text>
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            placeholder='Số điện thoại'
                            leftIcon={icon.inputIconPhone}
                            value={value}
                            onChangeText={onChange}
                            containerStyle={styles.input}
                            inputContainerStyle={{ borderBottomWidth: 0, padding: 0 }}
                            inputStyle={{ color: '#222', marginLeft: 10 }}
                            inputMode='numeric'
                            errorStyle={{ color: 'red' }}
                            errorMessage={errors?.phone?.message}
                            returnKeyLabel='next'
                            returnKeyType='next'
                        />
                    )}
                    name="phone"
                    rules={{ required: true, pattern: { value: /^[0-9]{10,11}$/, message: "Số điện thoại không hợp lệ" } }}
                />
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            placeholder='Mật khẩu'
                            leftIcon={icon.inputIconPassword}
                            rightIcon={icon.inputRightIconPassword}
                            value={value}
                            onChangeText={onChange}
                            containerStyle={styles.input}
                            inputContainerStyle={{ borderBottomWidth: 0, padding: 0 }}
                            inputStyle={{ color: '#222', marginLeft: 10 }}
                            secureTextEntry={secureTextEntry}
                            errorStyle={{ color: 'red' }}
                            errorMessage={errors?.password?.message}
                            returnKeyLabel='done'
                            returnKeyType='done'
                        />
                    )}
                    name="password"
                    rules={{ required: true, minLength: { value: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" } }}
                />
                <View>
                    <TouchableOpacity
                        style={{ backgroundColor: '#3366CC', padding: 13, borderRadius: 15, marginTop: 10, borderWidth: 1, borderColor: '#fff' }}
                        onPress={handleSubmit(handleLogin)}
                    >
                        <Text style={{ textAlign: 'center', color: '#fff', fontSize: 18 }}>Đăng nhập</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ padding: 13, borderRadius: 15, marginTop: 10 }}
                        onPress={() => navigation.navigate('Đăng ký')}
                    >
                        <Text style={{ textAlign: 'center', color: '#222', fontSize: 18 }}>Chưa có tài khoản? Đăng ký ngay</Text>
                    </TouchableOpacity>
                </View>
                {/* </ImageBackground> */}
            </Animated.View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    fadingContainer: {
        // backgroundColor: 'powderblue',
        height: '100%',
        padding: 15,
    },

    container: {
        flex: 1,
        justifyContent: 'center',
        // alignItems: 'center',

    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        margin: 10,
    },
    input: { width: '100%', backgroundColor: '#fff', borderRadius: 10, height: 50, marginBottom: 30, color: '#222' },

});



export default LoginScreen;
