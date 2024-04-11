// LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ImageBackground, Text, Alert, Button, Linking, Platform, TouchableOpacity } from 'react-native';
import { useForm, Controller } from "react-hook-form"
import { storeData } from '../common';
import axios from '../common/axios';
import GetLocation from 'react-native-get-location'
import { openSettings } from 'react-native-permissions';

const RegisterScreen = ({ navigation }: any) => {
    const [step1, setStep1] = useState(true);
    const [step2, setStep2] = useState(false);
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            phone: "",
            password: "",
            password_confirmation: "",
            OTP: "",
        },
    })

    const handleRegister = async (data: any) => {
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 60000,
        })
            .then(location => {
                axios.post('https://tp.tucanhcomputer.vn/api/auth/register', {
                    phone: data.phone,
                    password: data.password,
                    password_confirmation: data.password_confirmation,
                    latitude: location.latitude,
                    longitude: location.longitude,
                }).then((res) => {
                    console.log(res.data);
                    Alert.alert('Thành công', 'Đăng ký thành công, vui lòng nhập mã OTP để tiếp tục.')
                    setStep1(false);
                    setStep2(true);
                }).catch((err) => {
                    if (err.response.data.phone) {
                        Alert.alert('Lỗi', err.response.data.phone[0]);
                    }
                    if (err.response.data.password) {
                        Alert.alert('Lỗi', err.response.data.password[0]);
                    }
                });
            })
            .catch(error => {
                const { code, message } = error;
                if (code === 'CANCELLED') {
                    Alert.alert('Lỗi', 'Lỗi hủy bỏ');
                }
                if (code === 'UNAVAILABLE') {
                    Alert.alert('Lỗi', 'Không thể lấy vị trí');
                }
                if (code === 'TIMEOUT') {
                    Alert.alert('Lỗi', 'Hết thời gian lấy vị trí');
                }
                if (code === 'UNAUTHORIZED') {
                    Alert.alert('Lỗi', 'Không có quyền truy cập vị trí, vui lòng bật vị trí cho ứng dụng', [
                        {
                            text: 'Đồng ý',
                            onPress: () => {
                                if (Platform.OS === 'ios') {
                                    Linking.openURL('app-settings:');
                                } else {
                                    Linking.openSettings();
                                }
                            }
                        }

                    ]);
                }
            });

    };

    const handleRegisterOTP = async (data: any) => {
        console.log(data);

        // navigation.navigate('Xác thực CMND/CCCD');
        navigation.navigate('Đăng nhập');
    }

    return (
        <View style={styles.container}>
            {
                step1 ? (
                    <ImageBackground source={require('../assets/logo/logo.jpg')} resizeMode="cover" style={styles.image}>
                        <Text style={{ color: '#ffffff', fontSize: 25, marginBottom: 20 }}>{'Đăng ký'}</Text>
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={errors.phone ? [styles.input, { borderColor: 'red' }] : styles.input}
                                    placeholder="Số điện thoại"
                                    value={value}
                                    onChangeText={onChange}
                                    placeholderTextColor="#ffffff"
                                    keyboardType='numeric'
                                />
                            )}
                            name="phone"
                            rules={{
                                required: { value: true, message: "Số điện thoại không được bỏ trống" },
                                // validate 0901.888.484
                                pattern: { value: /^[0-9]{10,11}$/, message: "Số điện thoại không hợp lệ" }
                            }}
                        />
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={errors.password ? [styles.input, { borderColor: 'red' }] : styles.input}
                                    placeholder="Mật khẩu"
                                    value={value}
                                    onChangeText={onChange}
                                    placeholderTextColor="#ffffff"
                                    secureTextEntry
                                />
                            )}
                            name="password"
                            rules={{ required: { value: true, message: "Mật khẩu không được bỏ trống" } }}
                        />

                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={errors.password_confirmation ? [styles.input, { borderColor: 'red' }] : styles.input}
                                    placeholder="Nhập lại mật khẩu"
                                    value={value}
                                    onChangeText={onChange}
                                    placeholderTextColor="#ffffff"
                                    secureTextEntry
                                />
                            )}
                            name="password_confirmation"
                            rules={{ required: { value: true, message: "Mật khẩu không được bỏ trống" } }}
                        />


                        <Button title="Đăng Ký" onPress={handleSubmit(handleRegister)} />
                        <Text
                            onPress={() => navigation.navigate('Đăng nhập')}
                            style={{ color: '#ffffff', marginTop: 20, textAlign: 'center' }}>
                            Bạn đã có tài khoản? Đăng nhập ngay
                        </Text>

                    </ImageBackground>
                ) : (
                    <ImageBackground source={require('../assets/logo/logo.jpg')} resizeMode="cover" style={styles.image}>
                        <Text style={{ color: '#ffffff', fontSize: 20, marginBottom: 5 }}>{'Nhập mã OTP'}</Text>

                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={errors.OTP ? [styles.input, { borderColor: 'red' }] : styles.input}
                                    placeholder="Otp"
                                    value={value}
                                    onChangeText={onChange}
                                    placeholderTextColor="#ffffff"
                                    keyboardType='numeric'
                                />
                            )}
                            name="OTP"
                            rules={{
                                required: { value: true, message: "OTP không được bỏ trống." },
                                pattern: { value: /^[0-9]{6}$/, message: "OTP không hợp lệ" }
                            }}
                        />
                        {/* <Button title="Tiếp tục" onPress={handleSubmit(handleRegisterOTP)} /> */}
                        <TouchableOpacity
                            style={{ backgroundColor: '#3366CC', width: '90%', padding: 5, borderRadius: 15, marginTop: 10, borderWidth: 1, borderColor: '#fff' }}
                            onPress={handleSubmit(handleRegisterOTP)}
                        >
                            <Text style={{ textAlign: 'center', color: '#fff' }}>Tiếp tục</Text>
                        </TouchableOpacity>

                    </ImageBackground>
                )
            }

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

    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 15,
        width: '90%',
        marginBottom: 10,
        padding: 5,
        color: '#ffffff',
        backgroundColor: 'rgba(255,255,255,0.2)',
    }
});


export default RegisterScreen;
