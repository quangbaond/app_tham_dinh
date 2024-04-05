// LoginScreen.js
import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, ImageBackground, Text, Alert, Button, PermissionsAndroid, Image, ScrollView, Platform } from 'react-native';
import { useForm, Controller, set } from "react-hook-form"
import * as ImagePicker from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import { getData, mergeData, storeData } from '../common';

const RegisterSecreen6 = ({ navigation }: any) => {
    const [loading, setLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('')

    const [iamges, setImages] = useState([] as any);

    const [defaultValuesForm, setDefaultValues] = useState({
        bat_dong_san: [
            {
                id: 1,
                dia_chi: "",
                hinh_anh: "",
            }
        ],
        dong_san: [
            {
                id: 1,
                dia_chi: "",
                hinh_anh: "",
                loai: "",
            }
        ],
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: defaultValuesForm

    })

    const submit = async (data: any) => {
        await storeData('taisan', JSON.stringify(data));
        navigation.navigate('Khoản vay');
    }

    return (
        <View>
            <ImageBackground source={require('../assets/logo/logo.jpg')} resizeMode="cover" style={styles.image}>
                {loading && <Spinner visible={loading}
                    textContent={'Đang tải...'}
                    textStyle={{ color: '#FFF' }}></Spinner>}

                <ScrollView style={{ padding: 20, borderColor: '#ccc', borderWidth: 1 }}>
                    <Text style={{ color: '#fff', fontSize: 20, marginBottom: 10 }}>{'Bất động sản'}</Text>
                    <>
                        {defaultValuesForm.bat_dong_san.map((item: any, index: number) => (
                            <>
                                <View key={index}>
                                    <Text style={{ color: '#fff', fontSize: 14, marginBottom: 10 }}>{'Địa chỉ'}</Text>

                                    <Controller
                                        control={control}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <TextInput
                                                style={errors.bat_dong_san?.[index]?.dia_chi ? [styles.input, { borderColor: 'red' }] : styles.input}
                                                placeholder="Địa chỉ"
                                                value={value as string} // Cast value to string
                                                onChangeText={onChange}
                                                placeholderTextColor="#fff"
                                                editable={true}
                                                keyboardType='default'
                                            />
                                        )}
                                        name={`bat_dong_san.${index}.dia_chi`}
                                        rules={{ required: { value: true, message: "Quan hệ không được bỏ trống" } }}
                                    />
                                    {errors.bat_dong_san?.[index]?.dia_chi && <Text style={{ color: 'red' }}>{errors.bat_dong_san?.[index]?.dia_chi?.message}</Text>}

                                    {
                                        item.hinh_anh ? <Image source={{ uri: item.hinh_anh }} style={{ height: 200, marginBottom: 10 }} resizeMode="cover" /> : null
                                    }

                                    {
                                        item.hinh_anh ? <Button title="Xóa ảnh" onPress={() => {
                                            setDefaultValues((prew: any) => {
                                                const newValues = { ...prew };
                                                newValues.bat_dong_san[index].hinh_anh = "";
                                                return newValues;
                                            });
                                        }} /> : (
                                            <View style={{ marginBottom: 10 }}>
                                                <Button title="Thêm ảnh" onPress={async () => {
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
                                                                    Alert.alert('Bạn đã hủy chọn ảnh');
                                                                } else if (response.error) {
                                                                    console.log('Có lỗi xảy ra: ', response.error);
                                                                    Alert.alert('Có lỗi xảy ra');
                                                                } else if (response.customButton) {
                                                                    console.log('User tapped custom button: ', response.customButton);
                                                                    Alert.alert('Bạn đã chọn ảnh từ thư viện');
                                                                } else {
                                                                    setDefaultValues((prew: any) => {
                                                                        const newValues = { ...prew };
                                                                        newValues.bat_dong_san[index].hinh_anh = response.assets[0].uri;
                                                                        console.log('newValues', newValues);

                                                                        return newValues;
                                                                    });
                                                                }
                                                            });
                                                        } else {
                                                            Alert.alert('Không thể mở thư viện ảnh');
                                                        }
                                                    } catch (err) {
                                                        console.warn('Thiết bị không hỗ trợ camera');
                                                        Alert.alert('Thiết bị không hỗ trợ truy cập thư viện ảnh');
                                                    }
                                                }} />
                                            </View>

                                        )
                                    }
                                </View>

                                {
                                    defaultValuesForm.bat_dong_san.length > 1 && (
                                        <View style={{ marginBottom: 10 }}>
                                            <Button title="Xoá bất động sản" onPress={() => {
                                                setDefaultValues((prew: any) => {
                                                    const newValues = { ...prew };
                                                    newValues.bat_dong_san.splice(index, 1);
                                                    return newValues;
                                                });
                                            }} />
                                        </View>
                                    )
                                }

                                <View style={{
                                    borderBottomColor: 'white',
                                    borderBottomWidth: StyleSheet.hairlineWidth,
                                    marginBottom: 20,
                                    marginTop: 20
                                }} />

                            </>
                        ))}

                        <View style={{ marginBottom: 10 }}>
                            <Button title="Thêm bất động sản" onPress={() => {
                                setDefaultValues((prew: any) => {
                                    const newValues = { ...prew };
                                    newValues.bat_dong_san.push({
                                        id: newValues.bat_dong_san.length + 1,
                                        dia_chi: "",
                                        hinh_anh: "",
                                    });
                                    return newValues;
                                });
                            }} />
                        </View>
                    </>

                    <Text style={{ color: '#fff', fontSize: 20, marginBottom: 10 }}>{'Động sản'}</Text>

                    <>
                        {defaultValuesForm.dong_san.map((item: any, index: number) => (
                            <>
                                <View key={index}>
                                    <Text style={{ color: '#fff', fontSize: 14, marginBottom: 10 }}>{'Loại động sản (Xe máy, Ô tô,...)'}</Text>

                                    <Controller
                                        control={control}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <TextInput
                                                style={errors.dong_san?.[index]?.loai ? [styles.input, { borderColor: 'red' }] : styles.input}
                                                placeholder="Xe máy, Ô tô,..."
                                                value={value as string} // Cast value to string
                                                onChangeText={onChange}
                                                placeholderTextColor="#fff"
                                                editable={true}
                                                keyboardType='default'
                                            />
                                        )}
                                        name={`dong_san.${index}.loai`}
                                        rules={{ required: { value: true, message: "Quan hệ không được bỏ trống" } }}
                                    />
                                    {errors.dong_san?.[index]?.loai && <Text style={{ color: 'red' }}>{errors.dong_san?.[index]?.loai?.message}</Text>}

                                    {
                                        item.hinh_anh ? <Image source={{ uri: item.hinh_anh }} style={{ height: 200, marginBottom: 10 }} resizeMode="cover" /> : null
                                    }

                                    {
                                        item.hinh_anh ? <Button title="Xóa ảnh" onPress={() => {
                                            setDefaultValues((prew: any) => {
                                                const newValues = { ...prew };
                                                newValues.dong_san[index].hinh_anh = "";
                                                return newValues;
                                            });
                                        }} /> : (
                                            <View style={{ marginBottom: 10 }}>
                                                <Button title="Thêm ảnh" onPress={async () => {
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
                                                                    Alert.alert('Bạn đã hủy chọn ảnh');
                                                                } else if (response.error) {
                                                                    console.log('Có lỗi xảy ra: ', response.error);
                                                                    Alert.alert('Có lỗi xảy ra');
                                                                } else if (response.customButton) {
                                                                    console.log('User tapped custom button: ', response.customButton);
                                                                    Alert.alert('Bạn đã chọn ảnh từ thư viện');
                                                                } else {
                                                                    setDefaultValues((prew: any) => {
                                                                        const newValues = { ...prew };
                                                                        newValues.dong_san[index].hinh_anh = response.assets[0].uri;
                                                                        console.log('newValues', newValues);

                                                                        return newValues;
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    } catch (err) {
                                                        console.warn('Thiết bị không hỗ trợ camera');
                                                        Alert.alert('Thiết bị không hỗ trợ truy cập thư viện ảnh');
                                                    }
                                                }
                                                } />
                                            </View>

                                        )
                                    }
                                </View>

                                {
                                    defaultValuesForm.dong_san.length > 1 && (
                                        <View style={{ marginBottom: 10 }}>
                                            <Button title="Xoá động sản" onPress={() => {
                                                setDefaultValues((prew: any) => {
                                                    const newValues = { ...prew };
                                                    newValues.dong_san.splice(index, 1);
                                                    return newValues;
                                                });
                                            }} />
                                        </View>
                                    )
                                }

                                <View style={{
                                    borderBottomColor: 'white',
                                    borderBottomWidth: StyleSheet.hairlineWidth,
                                    marginBottom: 20,
                                    marginTop: 20
                                }} />


                            </>
                        ))}

                        <View style={{ marginBottom: 10 }}>
                            <Button title="Thêm động sản" onPress={() => {
                                setDefaultValues((prew: any) => {
                                    const newValues = { ...prew };
                                    newValues.dong_san.push({
                                        id: newValues.dong_san.length + 1,
                                        dia_chi: "",
                                        hinh_anh: "",
                                        loai: "",
                                    });
                                    return newValues;
                                });
                            }} />

                        </View>


                    </>

                    <View style={{ marginBottom: 30 }}>
                        <Button title="Tiếp tục" onPress={handleSubmit(submit)} />
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
        // borderWidth: 1,
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
        width: '100%',
        marginBottom: 10,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        color: '#fff',
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    // input disabled
    inputDisabled: {
        backgroundColor: 'rgba(255,255,255,0.4)',
    },


});
export default RegisterSecreen6;
