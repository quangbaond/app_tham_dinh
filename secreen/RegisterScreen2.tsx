// LoginScreen.js
import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, ImageBackground, Text, Alert, Button, PermissionsAndroid, Image, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { useForm, Controller, set } from "react-hook-form"
import * as ImagePicker from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import { getData, mergeData, storeData } from '../common';
import { useIsFocused } from '@react-navigation/native'
import axios from 'axios';


const RegisterScreen2 = ({ navigation }: any) => {
    const [matTruoc, setMatTruoc] = useState('');
    const [matSau, setMatSau] = useState('');
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(false);
    const [kqMatTruoc, setKqMatTruoc] = useState(false);
    const [kqMatSau, setKqMatSau] = useState(false);
    const [next, setNext] = useState(true);
    const [userLogin, setUserLogin] = useState<any>(null);
    const isFocused = useIsFocused();

    const data = [
        {
            "id": "xxxx",
            "id_prob": "xxxx",
            "name": "xxxx",
            "name_prob": "xxxx",
            "dob": "xxxx",
            "dob_prob": "xxxx",
            "sex": "N/A",
            "sex_prob": "N/A",
            "nationality": "N/A",
            "nationality_prob": "N/A",
            "home": "xxxx",
            "home_prob": "xxxx",
            "address": "xxxx",
            "address_prob": "xxxx",
            "address_entities": {
                "province": "xxxx",
                "district": "xxxx",
                "ward": "xxxx",
                "street": "xxxx"
            },
            "doe": "N/A",
            "doe_prob": "N/A",
            "type": "xxxx",
            "issue_date": "xxxx",
        }
    ];

    useEffect(() => {
        const getUserLogin = async () => {
            const userLogin = await getData('userLogin');
            if (!userLogin) {
                // Alert.alert('Thông báo', 'Vui lòng đăng nhập để tiếp tục');
                navigation.navigate('Đăng nhập');
                return;
            }

            const token = JSON.parse(userLogin).token;

            axios.get('https://tp.tucanhcomputer.vn/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }).then((res) => {
                setUserLogin(res.data);
                console.log(res.data);
                
            }).catch((err) => {
                console.log(err);
                Alert.alert('Thông báo', 'Có lỗi xảy ra');
                navigation.navigate('Đăng nhập');
            });
        }
        getUserLogin();
    }, [isFocused]);

    // useEffect(() => {
    //     const saveData = async () => {
    //         const userInfo = await getData('userInfo');
    //         const userData = await getData('userLogin');
    //         const userDataParse = JSON.parse(userData as string);
    //         if (!userDataParse) {
    //             Alert.alert('Thông báo', 'Vui lòng đăng nhập để tiếp tục');
    //             navigation.navigate('Đăng nhập');
    //             return;
    //         }

    //         setUserLogin(JSON.parse(userData as string));
    //         if (!userInfo) {
    //             await storeData('userInfo', JSON.stringify(data));
    //             navigation.navigate('Xác thực thông tin cơ bản');
    //         } else {
    //             navigation.navigate('Xác thực thông tin cơ bản');
    //         }
    //     }
    //     saveData()
    // }, [isFocused]);

    useEffect(() => {
        getData('userLogin').then((res) => {
            const userLoginParse = JSON.parse(res as string);
            const token = userLoginParse?.token;

            if (matTruoc) {
                setLoading(true);
                const formData = new FormData();
                formData.append('image_front', {
                    uri: Platform.OS === 'ios' ? matTruoc.replace('file://', '') : matTruoc,
                    type: 'image/jpeg',
                    name: matTruoc.split('/').pop(),
                });
                
                axios.post('https://tp.tucanhcomputer.vn/api/upload-cccd', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`,
                    }
                }).then((res) => {
                    console.log(res.data);
                    setKqMatTruoc(true);
                    Alert.alert('Thông báo', 'Tải ảnh thành công'); 
                }).catch((err) => {
                    console.log(err.response.data);
                    Alert.alert('Lỗi', 'Vui lòng chụp rõ nét ảnh mặt trước');
                }).finally(() => {
                    setLoading(false);
                });
            }
        });
        
    }, [matTruoc]);

    useEffect(() => {
        getData('userLogin').then((res) => {
            const userLoginParse = JSON.parse(res as string);
            const token = userLoginParse?.token;

            if (matSau) {
                setLoading(true);
                
                const formData = new FormData();
                formData.append('image_back', {
                    uri: Platform.OS === 'ios' ? matTruoc.replace('file://', '') : matSau,
                    type: 'image/jpeg',
                    name: matSau.split('/').pop(),
                });
                
                axios.post('https://tp.tucanhcomputer.vn/api/upload-cccd', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`,
                    }
                }).then((res) => {
                    console.log(res.data);
                    setKqMatSau(true);
                }).catch((err) => {
                    Alert.alert('Lỗi', 'Vui lòng chụp rõ nét ảnh mặt sau');
                    console.log(err.response.data);
                }).finally(() => {
                    setLoading(false);
                });
            }
        });
    }, [matSau]);

    return (
        <View >
            <ImageBackground source={require('../assets/logo/logo.jpg')} resizeMode="cover" style={styles.image}>
                {loading && <Spinner visible={loading}
                    textContent={'Đang tải...'}
                    textStyle={{ color: '#ffffff' }}></Spinner>}

                <ScrollView style={{ padding: 20 }}>
                    <Text style={{ color: '#ffffff', fontSize: 25, marginBottom: 20 }}>{'Thông tin cơ bản'}</Text>
                    <View style={{ marginBottom: 10 }}>
                        <Button title="Mặt trước CCCD" onPress={async () => {
                            try {
                                const granted = await PermissionsAndroid.request(
                                    PermissionsAndroid.PERMISSIONS.CAMERA,
                                    {
                                        title: "Camera Permission",
                                        message: "App needs access to your camera ",
                                        buttonNeutral: "Ask Me Later",
                                        buttonNegative: "Cancel",
                                        buttonPositive: "OK"
                                    }
                                );
                                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                                    // lunch camera
                                    await ImagePicker.launchImageLibrary({
                                        mediaType: 'photo',
                                        includeBase64: false,
                                        selectionLimit: 1,
                                    }, (response: any) => {
                                        console.log('Response = ', response);
                                        if (response.didCancel) {
                                            console.log('User cancelled image picker');
                                            Alert.alert('Tạm dừng chụp ảnh');
                                        } else if (response.error) {
                                            console.log('Có lỗi xảy ra: ', response.error);
                                        } else if (response.customButton) {
                                            console.log('User tapped custom button: ', response.customButton);
                                        } else {
                                            console.log(response.assets[0].uri);
                                            setMatTruoc(response.assets[0].uri);
                                        }
                                    });
                                } else {
                                    console.log("Camera permission denied");
                                    Alert.alert('Thông báo', 'Không thể mở camera');
                                }
                            } catch (err) {
                                console.warn('Thông báo', 'Thiết bị không hỗ trợ camera');
                                Alert.alert('Thông báo', 'Thiết bị không hỗ trợ camera');
                            }
                        }} />
                        {matTruoc ? <Image source={{ uri: matTruoc }} style={{ height: 250 }} /> : null}
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <Button title="Mặt sau CCCD" onPress={async () => {
                            const result = await ImagePicker.launchImageLibrary({
                                mediaType: 'photo',
                                includeBase64: false,
                                selectionLimit: 1,
                            }, (response: any) => {
                                console.log('Response = ', response);
                                if (response.didCancel) {
                                    console.log('User cancelled image picker');
                                    Alert.alert('Tạm dừng chụp ảnh');
                                } else if (response.error) {
                                    console.log('Có lỗi xảy ra: ', response.error);
                                } else if (response.customButton) {
                                    console.log('User tapped custom button: ', response.customButton);
                                } else {
                                    console.log(response.assets[0].uri);
                                    setMatSau(response.assets[0].uri);
                                }
                            }
                            );
                        }} />

                        {/*  hiển thị hình ảnh */}
                        {matSau ? <Image source={{ uri: matSau }} style={{ height: 250 }} /> : null}
                    </View>
                    <View style={{ marginBottom: 30 }}>
                        {/* <Button  title="Tiếp tục" onPress={() => {
                            if (matTruoc && matSau) {
                                navigation.navigate('Xác thực thông tin cơ bản');
                                return
                            }
                            Alert.alert('Thông báo', 'Vui lòng chụp ảnh mặt trước và mặt sau CCCD');
                            
                        }} /> */}
                        <TouchableOpacity
                             style={{ backgroundColor: '#3366CC', padding: 13, borderRadius: 15, marginTop: 10, borderWidth: 1, borderColor: '#fff' }}
                            onPress={() => {
                                if (kqMatTruoc && kqMatSau) {
                                    Alert.alert('Thông báo', 'Vui lòng chụp ảnh mặt trước và mặt sau CCCD');
                                    return;
                                }
                                navigation.navigate('Xác thực thông tin cơ bản');
                            }}
                        >
                            <Text style={{ textAlign: 'center', color: '#fff', fontSize:  18 }}>Tiếp tục</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginBottom: 30 }}>
                        {/* // hiển thị thông tin */}
                        <Text style={{ color: '#ffffff', marginBottom: 10 }}>{kqMatTruoc}</Text>
                        <Text style={{ color: '#ffffff', marginBottom: 10 }}>{kqMatSau}</Text>
                    </View>
                </ScrollView>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({

    image: {
        justifyContent: "center",
        width: '100%',
        height: '100%',
        // alignContent: 'center',
        // alignItems: 'center',
        // padding: 20,
    },
    container: {
        // flex: 1,
        fontFamily: 'Roboto',
        padding: 20,
    },

    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        width: '90%',
        marginBottom: 20,
        padding: 10,
        color: '#ffffff',
        backgroundColor: 'rgba(255,255,255,0.2)',
    }


});
export default RegisterScreen2;
