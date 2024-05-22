// LoginScreen.js
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ImageBackground, Text, Alert, TouchableOpacity, Animated, Platform, Linking } from 'react-native';
import { Icon, Input } from 'react-native-elements';
import { fadeAnim, fadeIn, getData, redirect, storeData } from '../common';
import axios from '../common/axios';
import Spinner from 'react-native-loading-spinner-overlay';
import { useForm, Controller } from "react-hook-form"
import LinearGradient from 'react-native-linear-gradient';
import GetLocation from 'react-native-get-location'
import { openSettings } from 'react-native-permissions';


const LoginScreen = ({ navigation }: any) => {
    const [loading, setLoading] = useState(false);
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

    const [step, setStep] = useState(1);

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm({
        defaultValues: {
            phone: "0389228496",
            password: "123456",
            passwordConfirm: "123456",
            otp: "123456",
        },

    })

    useEffect(() => {
        fadeIn();
    }, []);

    const handleRegister = (data: any) => {
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 60000,
        }).then(location => {
            setLoading(true);
            axios.post(`/auth/register`, {
                phone: data.phone,
                password: data.password,
                longitude: location.longitude.toString(),
                latitude: location.latitude.toString(),
            }).then((res) => {
                storeData('userLogin', JSON.stringify({
                    token: res.data.access_token,
                    user: res.data.user,
                }));
                Alert.alert('Thành công', 'Đăng ký thành công');
                redirect(res.data.user, navigation);
            }).catch((err) => {
                console.log(err?.response?.data);
                if (err?.response?.data?.phone?.length > 0) {
                    Alert.alert('Lỗi', err?.response?.data?.phone[0]);
                }
            }).finally(() => {
                setLoading(false);
            });

        }).catch(error => {
            const { code, message } = error;
            console.warn(code, message);
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
    }
    return (
        <LinearGradient colors={['#5fe3ff', '#718ce0', '#eaffff', '#5fe3ff']} start={{ x: 0.7, y: 0 }} style={styles.container}>
            <Animated.View style={[styles.fadingContainer, { opacity: fadeAnim, }]}>
                {/* <ImageBackground source={require('../assets/logo/logo.jpg')} resizeMode="cover" style={styles.image}> */}
                {loading && <Spinner visible={loading}
                    textContent={'Đang tải...'}
                    textStyle={{ color: '#ffffff' }}>
                </Spinner>}
                {
                    step === 1 ? (
                        <>
                            <View style={{ alignItems: 'center', marginBottom: 20 }}>
                                <ImageBackground source={require('../assets/logo/aapp_2.jpg')} style={{ width: 100, height: 100, borderRadius: 50 }}></ImageBackground>
                            </View>
                            <Text style={{ color: '#ffffff', fontSize: 25, marginBottom: 10, textShadowColor: 'rgba(0, 0, 0, 0.75)', fontWeight: "500", textAlign: 'center' }}>{'Đăng ký'}</Text>
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
                                        returnKeyLabel='next'
                                        returnKeyType='next'
                                    />
                                )}
                                name="password"
                                rules={{ required: true, minLength: { value: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" } }}
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
                                        errorMessage={errors?.passwordConfirm?.message}
                                        returnKeyLabel='done'
                                        returnKeyType='done'
                                    />
                                )}
                                name="passwordConfirm"
                                rules={{ required: true, minLength: { value: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" }, validate: value => value === watch('password') || "Mật khẩu không khớp" }}
                            />
                            <View>
                                <TouchableOpacity
                                    style={{ backgroundColor: '#3366CC', padding: 13, borderRadius: 15, marginTop: 10, borderWidth: 1, borderColor: '#fff' }}
                                    onPress={handleSubmit(handleRegister)}
                                >
                                    <Text style={{ textAlign: 'center', color: '#fff', fontSize: 18 }}>Đăng ký</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ padding: 13, borderRadius: 15, marginTop: 10 }}
                                    onPress={() => navigation.navigate('Đăng nhập')}
                                >
                                    <Text style={{ textAlign: 'center', color: '#222', fontSize: 18 }}>Đã có tài khoản? Vui lòng đăng nhập</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (<>
                        <View style={{ alignItems: 'center', marginBottom: 20 }}>
                            <ImageBackground source={require('../assets/logo/aapp_2.jpg')} style={{ width: 100, height: 100, borderRadius: 50 }}></ImageBackground>
                            <Text style={{ color: '#ffffff', fontSize: 25, marginBottom: 10, textShadowColor: 'rgba(0, 0, 0, 0.75)', fontWeight: "500", textAlign: 'center' }}>{'Mã xác thực OTP'}</Text>
                            <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input
                                        placeholder='123456'
                                        leftIcon={icon.inputIconPhone}
                                        value={value}
                                        onChangeText={onChange}
                                        containerStyle={styles.input}
                                        inputContainerStyle={{ borderBottomWidth: 0, padding: 0 }}
                                        inputStyle={{ color: '#222', marginLeft: 10 }}
                                        inputMode='numeric'
                                        errorStyle={{ color: 'red' }}
                                        errorMessage={errors?.otp?.message}
                                        returnKeyLabel='next'
                                        returnKeyType='next'
                                    />
                                )}
                                name="otp"
                                rules={{ required: true, pattern: { value: /^[0-9]{6}$/, message: "Mã xác thực không hợp lệ" } }}
                            />

                            <View>
                                <TouchableOpacity
                                    style={{ backgroundColor: '#3366CC', padding: 13, borderRadius: 15, marginTop: 10, borderWidth: 1, borderColor: '#fff' }}
                                    onPress={handleSubmit(handleRegister)}
                                >
                                    <Text style={{ textAlign: 'center', color: '#fff', fontSize: 18 }}>Xác thực</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ padding: 13, borderRadius: 15, marginTop: 10, flex: 1, alignContent: 'center', flexDirection: 'row' }}
                                    onPress={() => setStep(1)}
                                >
                                    <Icon name='arrow-left' size={25} color='#222' />

                                    <Text style={{ textAlign: 'center', color: '#222', fontSize: 18 }}>
                                        Thay đổi số điện thoại</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>)
                }

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
