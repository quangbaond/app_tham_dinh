// LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ImageBackground, Text, Alert, Button } from 'react-native';
import { useForm, Controller } from "react-hook-form"
import { storeData } from '../common';
import axios from '../common/axios';

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
        await storeData('user', JSON.stringify(data));
        console.log('https://tp.tucanhcomputer.vn/api/auth/register');
        console.log(data);

        axios.post('https://tp.tucanhcomputer.vn/api/auth/register', {
            phone: data.phone,
            password: data.password,
            password_confirmation: data.password_confirmation
        }).then((res) => {
            console.log(res.data);

            Alert.alert('Thành công', 'Đăng ký thành công, vui lòng nhập mã OTP để tiếp tục.')
            setStep1(false);
            setStep2(true);
        }).catch((err) => {
            if (err.response.data.errors.phone) {
                Alert.alert('Lỗi', err.response.data.errors.phone[0]);
            }
            if (err.response.data.errors.password) {
                Alert.alert('Lỗi', err.response.data.errors.password[0]);
            }
        });
    };

    const handleRegisterOTP = async (data: any) => {
        console.log(data);

        navigation.navigate('Xác thực CMND/CCCD');
    }

    return (
        <View style={styles.container}>
            {
                step1 ? (
                    <ImageBackground source={require('../assets/logo/logo.jpg')} resizeMode="cover" style={styles.image}>
                        <Text style={{ color: '#fff', fontSize: 25, marginBottom: 20 }}>{'Đăng ký'}</Text>
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={errors.phone ? [styles.input, { borderColor: 'red' }] : styles.input}
                                    placeholder="Số điện thoại"
                                    value={value}
                                    onChangeText={onChange}
                                    placeholderTextColor="#fff"
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
                                    placeholderTextColor="#fff"
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
                                    placeholderTextColor="#fff"
                                    secureTextEntry
                                />
                            )}
                            name="password_confirmation"
                            rules={{ required: { value: true, message: "Mật khẩu không được bỏ trống" } }}
                        />


                        <Button title="Đăng Ký" onPress={handleSubmit(handleRegister)} />
                        <Text
                            onPress={() => navigation.navigate('Đăng nhập')}
                            style={{ color: '#fff', marginTop: 20, textAlign: 'center' }}>
                            Bạn đã có tài khoản? Đăng nhập ngay
                        </Text>

                    </ImageBackground>
                ) : (
                    <ImageBackground source={require('../assets/logo/logo.jpg')} resizeMode="cover" style={styles.image}>
                        <Text style={{ color: '#fff', fontSize: 25, marginBottom: 20 }}>{'Nhập mã OTP'}</Text>

                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={errors.OTP ? [styles.input, { borderColor: 'red' }] : styles.input}
                                    placeholder="Otp"
                                    value={value}
                                    onChangeText={onChange}
                                    placeholderTextColor="#fff"
                                    keyboardType='numeric'
                                />
                            )}
                            name="OTP"
                            rules={{
                                required: { value: true, message: "OTP không được bỏ trống." },
                                pattern: { value: /^[0-9]{6}$/, message: "OTP không hợp lệ" }
                            }}
                        />
                        <Button title="Tiếp tục" onPress={handleSubmit(handleRegisterOTP)} />

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
        borderRadius: 5,
        width: '90%',
        marginBottom: 20,
        padding: 10,
        color: '#fff',
        backgroundColor: 'rgba(255,255,255,0.2)',
    }


});


export default RegisterScreen;
