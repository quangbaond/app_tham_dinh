// LoginScreen.js
import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, ImageBackground, Text, Alert, Button, PermissionsAndroid, Image, ScrollView, Platform } from 'react-native';
import { useForm, Controller } from "react-hook-form"
import * as ImagePicker from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import { mergeData, storeData } from '../common';

const RegisterScreen4 = ({ navigation }: any) => {
    const [matTruoc, setMatTruoc] = useState('');
    const [matSau, setMatSau] = useState('');
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(false);
    const [kqMatTruoc, setKqMatTruoc] = useState('');
    const [kqMatSau, setKqMatSau] = useState('');

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
            // merge data to local storage
            await storeData('BLX', JSON.stringify(data));

            navigation.navigate('Tài chính');
        }
        saveData()
    }, []);

    // useEffect(() => {
    //     // console.log('matTruoc', matTruoc);
    //     // console.log('matSau', matSau);
    //     if (kqMatTruoc && kqMatSau) {
    //         const saveData = async () => {
    //             // merge data to local storage
    //             const data = [{
    //                 ...JSON.parse(kqMatTruoc)[0],
    //                 ...JSON.parse(kqMatSau)[0]
    //             }]

    //             console.log('data', data);

    //             // await storeData('userInfo', JSON.stringify(data));

    //             navigation.navigate('Tài chính');
    //         }
    //         saveData()
    //     } else {
    //         Alert.alert('Vui lòng chụp ảnh mặt trước và mặt sau bằng lái xe');
    //     }
    // }, [kqMatTruoc, kqMatSau]);



    const handelUpload = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('image', {
            uri: Platform.OS === 'ios' ? matTruoc.replace('file://', '') : matTruoc,
            type: 'image/jpeg',
            name: 'image.jpg',
        });
        fetch(`https://api.fpt.ai/vision/dlr/vnm/`, {
            method: 'POST',
            body: formData,
            headers: {
                'api_key': 'aFRuM6JZQAVP1NWLidL3gQHQCDR9FbQO',
            }
        })
            .then((response) => response.json())
            .then((response) => {
                setLoading(false);
                console.log('response', response);
                if (response.errorCode === 3) {
                    Alert.alert('Ảnh chụp không rõ, vui lòng chụp lại');
                } else if (response.errorCode === 2) {
                    Alert.alert('Ảnh mặt trước thiếu góc, vui lòng chụp lại');
                } else if (response.errorCode === 7) {
                    Alert.alert('File gửi lên không phải là file ảnh');
                } else if (response.errorCode === 0) {
                    setKqMatTruoc(JSON.stringify(response.data));
                    let formDataMatSau = new FormData();
                    formDataMatSau.append('image', {
                        uri: Platform.OS === 'ios' ? matSau.replace('file://', '') : matSau,
                        type: 'image/jpeg',
                        name: 'image.jpg',
                    });
                    fetch(`https://api.fpt.ai/vision/dlr/vnm/`, {
                        method: 'POST',
                        body: formDataMatSau,
                        headers: {
                            'api_key': 'aFRuM6JZQAVP1NWLidL3gQHQCDR9FbQO',
                        }
                    }).then((response1) => response1.json())
                        .then((response1) => {
                            setLoading(false);
                            console.log('response', response1);
                            if (response1.errorCode === 3) {
                                Alert.alert('Ảnh chụp không rõ, vui lòng chụp lại');
                            } else if (response1.errorCode === 2) {
                                Alert.alert('Ảnh mặt sau thiếu góc, vui lòng chụp lại');
                            } else if (response1.errorCode === 7) {
                                Alert.alert('File gửi lên không phải là file ảnh');
                            } else if (response1.errorCode === 0) {
                                setKqMatSau(JSON.stringify(response1.data));
                                Alert.alert(JSON.stringify(response1.data) + ' ' + JSON.stringify(response1.data));
                            }
                        }).catch((error) => {
                            setLoading(false);
                            console.log('error', error);
                            Alert.alert('Upload không thành công');
                        });
                }
            })
            .catch((error) => {
                setLoading(false);
                console.log('error', error);
                Alert.alert('Upload không thành công');
            });
    };

    return (
        <View >
            <ImageBackground source={require('../assets/logo/logo.jpg')} resizeMode="cover" style={styles.image}>
                {loading && <Spinner visible={loading}
                    textContent={'Đang tải...'}
                    textStyle={{ color: '#FFF' }}></Spinner>}

                <ScrollView style={{ padding: 20 }}>
                    <Text style={{ color: '#fff', fontSize: 25, marginBottom: 20 }}>{'Thông tin cơ bản'}</Text>
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
                                    const result = await ImagePicker.launchCamera({
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
                            const result = await ImagePicker.launchCamera({
                                mediaType: 'photo',
                                includeBase64: false,
                                // tôi muốn tạo 1 chức năng chụp ảnh căn cước công dân, tập trung và focus vào khu vực chứa ảnh trong khung hình
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

                        {/*  hiển thị hình ảnh */}
                        {matSau ? <Image source={{ uri: matSau }} style={{ height: 250 }} /> : null}
                    </View>
                    <View style={{ marginBottom: 30 }}>
                        <Button disabled={matTruoc && matSau ? false : true} title="Tải lên" onPress={() => handelUpload()} />
                    </View>
                    <View style={{ marginBottom: 30 }}>
                        {/* // hiển thị thông tin */}
                        <Text style={{ color: '#fff', marginBottom: 10 }}>{kqMatTruoc}</Text>
                        <Text style={{ color: '#fff', marginBottom: 10 }}>{kqMatSau}</Text>
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
        color: '#fff',
        backgroundColor: 'rgba(255,255,255,0.2)',
    }


});
export default RegisterScreen4;
