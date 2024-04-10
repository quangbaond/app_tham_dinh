// LoginScreen.js
import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, ImageBackground, Text, Alert, Button, PermissionsAndroid, Image, ScrollView, Platform } from 'react-native';
import { useForm, Controller } from "react-hook-form"
import * as ImagePicker from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import { getData, mergeData, storeData } from '../common';
import { useIsFocused } from '@react-navigation/native'

const RegisterScreen4 = ({ navigation }: any) => {
    const [matTruoc, setMatTruoc] = useState('');
    const [matSau, setMatSau] = useState('');
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(false);
    const [kqMatTruoc, setKqMatTruoc] = useState('');
    const [kqMatSau, setKqMatSau] = useState('');
    const [next, setNext] = useState(false);
    const [userLogin, setUserLogin] = useState<any>(null);

    const isFocused = useIsFocused()

    const data = [
        {
            "id": "xxxx",
            "id_prob": "xxxx",
            "name": "xxxx",
            "name_prob": "xxxx",
            "dob": "xxxx",
            "dob_prob": "xxxx",
            "nation": "xxxx",
            "nation_prob": "xxxx",
            "address": "xxxx",
            "address_prob": "xxxx",
            "place_issue": "xxxx",
            "place_issue_prob": "xxxx",
            "date": "xxxx",
            "date_prob": "xxxx",
            "doe": "xxxx",
            "doe_prob": "xxxx",
            "code": "xxxx",
            "code_prob": "xxxx",
            "type": "xxxx"
        }
    ]

    useEffect(() => {
        const saveData = async () => {
            const userData = await getData('userLogin');
            if (!userData) {
                Alert.alert('Thông báo', 'Vui lòng đăng nhập để tiếp tục');
                navigation.navigate('Đăng nhập');
                return;
            }

            setUserLogin(JSON.parse(userData as string));
            // merge data to local storage
            await storeData('BLX', JSON.stringify(data));

            navigation.navigate('Tài chính');
        }
        saveData()
    }, [isFocused]);

    useEffect(() => {
        if (matTruoc) {
            setLoading(true);
            const formData = new FormData();
            formData.append('image_front', Platform.OS === 'ios' ? image.replace('file://', '') : image);

            fetch('https://tp.tucanhcomputer.vn/api/auth/upload-blx', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + userLogin.token,
                },
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    setKqMatTruoc(data.data);
                    setLoading(false);
                    Alert.alert('Thông báo', 'Tải ảnh thành công');
                })
                .catch((error) => {
                    setLoading(false);
                    console.log(error);
                    if(error.message === 'Network request failed') {
                        Alert.alert('Thông báo', 'Không thể kết nối đến máy chủ');
                    } else {
                        Alert.alert('Thông báo', 'Có lỗi xảy ra');
                    }
                });
        }
    }, [matTruoc]);

    useEffect(() => {
        if (matSau) {
            setLoading(true);
            const formData = new FormData();
            formData.append('image_back', Platform.OS === 'ios' ? image.replace('file://', '') : image);

            fetch('https://tp.tucanhcomputer.vn/api/upload-blx', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + userLogin.token,
                },
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    setKqMatSau(data.data);
                    setLoading(false);
                })
                .catch((error) => {
                    setLoading(false);
                    console.log(error);
                    if(error.message === 'Network request failed') {
                        Alert.alert('Thông báo', 'Không thể kết nối đến máy chủ');
                    } else {
                        Alert.alert('Thông báo', 'Có lỗi xảy ra');
                    }
                });
        }
    }, [matSau]);

    useEffect(() => {
        if (kqMatTruoc && kqMatSau) {
            setNext(true);
        }
    }, [kqMatTruoc, kqMatSau]);

    return (
        <View >
            <ImageBackground source={require('../assets/logo/logo.jpg')} resizeMode="cover" style={styles.image}>
                {loading && <Spinner visible={loading}
                    textContent={'Đang tải...'}
                    textStyle={{ color: '#222222' }}></Spinner>}

                <ScrollView style={{ padding: 20 }}>
                    <Text style={{ color: '#222222', fontSize: 25, marginBottom: 20 }}>{'Thông tin cơ bản'}</Text>
                    <View style={{ marginBottom: 10 }}>
                        <Button title="Mặt trước BLX" onPress={async () => {
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
                                    console.log("You can use the camera");
                                    // lunch camera
                                    await ImagePicker.launchCamera({
                                        mediaType: 'photo',
                                        includeBase64: false,

                                        cameraType: 'back',
                                        saveToPhotos: true,
                                        includeExtra: true,
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
                                    Alert.alert('Không thể mở camera');
                                }
                            } catch (err) {
                                console.warn('Thiết bị không hỗ trợ camera');
                                Alert.alert('Thiết bị không hỗ trợ camera');
                            }
                        }} />
                        {matTruoc ? <Image source={{ uri: matTruoc }} style={{ height: 250 }} /> : null}
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <Button title="Mặt sau BLX" onPress={async () => {
                            await ImagePicker.launchCamera({
                                mediaType: 'photo',
                                includeBase64: false,
                                cameraType: 'back',
                                saveToPhotos: true,
                                includeExtra: true,
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
                        {matSau ? <Image source={{ uri: matSau }} style={{ height: 250 }} /> : null}
                    </View>
                    <View style={{ marginBottom: 30 }}>
                        <Button disabled={!next} title="Tải lên" onPress={() => navigation.navigate('Trang cá nhân')} />
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
        color: '#222222',
        backgroundColor: 'rgba(255,255,255,0.2)',
    }


});
export default RegisterScreen4;
