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
                loai_tai_san: "",
            }
        ],
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: async () => {
            const userLogin = await getData('userLogin');
            const token = JSON.parse(userLogin ?? '').token;
            const result = await fetch('https://tp.tucanhcomputer.vn/api/auth/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }).then((response) => response.json())

            setDefaultValues({
                ...defaultValuesForm,
                bat_dong_san: result.user_san_estates.map((item: any, index: number) => {
                    return {
                        id: item.id ?? index + 1,
                        dia_chi: item.dia_chi,
                        hinh_anh: item.hinh_anh,
                    }
                }),
                dong_san: result.user_movables.map((item: any, index: number) => {
                    return {
                        id: item.id ?? index + 1,
                        loai_tai_san: item.loai_tai_san,
                        hinh_anh: item.hinh_anh,
                        dia_chi: item.dia_chi,
                    }
                }),
            });
            return {
                ...defaultValuesForm,
                bat_dong_san: result.user_san_estates.map((item: any, index: number) => {
                    return {
                        id: item.id ?? index + 1,
                        dia_chi: item.dia_chi,
                        hinh_anh: item.hinh_anh,
                    }
                }),
                dong_san: result.user_movables.map((item: any, index: number) => {
                    return {
                        id: item.id ?? index + 1,
                        loai_tai_san: item.loai_tai_san,
                        hinh_anh: item.hinh_anh,
                        dia_chi: item.dia_chi,
                    }
                }),
            }
        }

    })

    const submit = async (data: any) => {
        // setLoading(true);

        const userLogin = await getData('userLogin');
        const token = JSON.parse(userLogin as string).token;

        const formData = new FormData();


        data.bat_dong_san.forEach((item: any, index: number) => {
            console.log('bat_dong_san', item);
            formData.append(`bat_dong_san[${index}][dia_chi]`, item.dia_chi);
            item.hinh_anh = defaultValuesForm.bat_dong_san[index].hinh_anh;
            if (item.hinh_anh) {
                if (!item.hinh_anh.includes('http')) {
                    formData.append(`bat_dong_san[${index}][hinh_anh]`, {
                        uri: item.hinh_anh,
                        type: 'image/jpeg',
                        name: item.hinh_anh.split('/').pop(),
                    });
                }
            }

        });

        data.dong_san.forEach((item: any, index: number) => {
            formData.append(`dong_san[${index}][loai_tai_san]`, item.loai_tai_san);
            formData.append(`dong_san[${index}][dia_chi]`, item.dia_chi);
            item.hinh_anh = defaultValuesForm.dong_san[index].hinh_anh;
            if (item.hinh_anh) {
                if (!item.hinh_anh.includes('http')) {
                    formData.append(`dong_san[${index}][hinh_anh]`, {
                        uri: item.hinh_anh,
                        type: 'image/jpeg',
                        name: item.hinh_anh.split('/').pop(),
                    })
                }
            }
        });

        fetch('https://tp.tucanhcomputer.vn/api/update-tai-san', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        }).then((response) => {
            if (!response.ok) {
                console.log('response', response.status);
                throw new Error('Có lỗi xảy ra');

            }
            return response.json();

        })
            .then((data) => {
                setLoading(false);
                if (data.error) {
                    Alert.alert('Lỗi', data.error);
                    return;
                }

                if (data.message) {
                    Alert.alert('Thành công', data.message);
                }
                console.log('data', data.user.user_loan_amounts);
                
                if (data.user.user_loan_amounts.length <= 0) {
                    navigation.navigate('Khoản vay');
                    return
                } else {
                    navigation.navigate('Trang cá nhân');
                    return
                }
            }).catch((error) => {
                setLoading(false);
                if (error) {
                    Alert.alert('Lỗi', 'Có lỗi xảy ra');
                }
            });
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
                                                multiline={true}
                                                returnKeyLabel='next'
                                                numberOfLines={4}
                                            />
                                        )}
                                        name={`bat_dong_san.${index}.dia_chi`}
                                        rules={{ required: { value: true, message: "Địa chỉ không được để trống" } }}
                                    />

                                    {errors.bat_dong_san?.[index]?.dia_chi && <Text style={{ color: 'red' }}>{errors.bat_dong_san?.[index]?.dia_chi?.message}</Text>}

                                    {
                                        item.hinh_anh ? <Image source={{ uri: item.hinh_anh }} style={{ height: 200, marginBottom: 10 }} resizeMode="cover" /> : null
                                    }

                                    {
                                        item.hinh_anh ?
                                            <View style={{ marginBottom: 10 }}>
                                                <Button title="Xóa ảnh" onPress={() => {
                                                    setDefaultValues((prew: any) => {
                                                        const newValues = { ...prew };
                                                        newValues.bat_dong_san[index].hinh_anh = "";
                                                        return newValues;
                                                    });
                                                }} />
                                            </View>
                                            : (
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
                                                                const result = await ImagePicker.launchImageLibrary({
                                                                    mediaType: 'photo',
                                                                    includeBase64: false,
                                                                    selectionLimit: 1,
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
                                    defaultValuesForm.bat_dong_san.length > 1 ? (
                                        <View style={{ marginBottom: 10 }}>
                                            <Button title="Xoá bất động sản" onPress={() => {
                                                setDefaultValues((prew: any) => {
                                                    const newValues = { ...prew };
                                                    newValues.bat_dong_san.splice(index, 1);
                                                    return newValues;
                                                });
                                            }} />
                                        </View>
                                    ) : null
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
                                                style={errors.dong_san?.[index]?.loai_tai_san ? [styles.input, { borderColor: 'red' }] : styles.input}
                                                placeholder="Xe máy, Ô tô,..."
                                                value={value as string} // Cast value to string
                                                onChangeText={onChange}
                                                placeholderTextColor="#fff"
                                                editable={true}
                                                keyboardType='default'
                                            />
                                        )}
                                        name={`dong_san.${index}.loai_tai_san`}
                                        rules={{ required: { value: true, message: "Loại tài sản không được bỏ trống." } }}
                                    />
                                    {errors.dong_san?.[index]?.loai_tai_san && <Text style={{ color: 'red' }}>{errors.dong_san?.[index]?.loai_tai_san?.message}</Text>}

                                    <Controller
                                        control={control}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <TextInput
                                                style={errors.dong_san?.[index]?.dia_chi ? [styles.input, { borderColor: 'red' }] : styles.input}
                                                placeholder="Địa chỉ."
                                                value={value as string} // Cast value to string
                                                onChangeText={onChange}
                                                placeholderTextColor="#fff"
                                                editable={true}
                                                keyboardType='default'
                                                multiline={true}
                                                numberOfLines={4}
                                            />
                                        )}
                                        name={`dong_san.${index}.dia_chi`}
                                        rules={{ required: { value: true, message: "Loại tài sản không được bỏ trống." } }}
                                    />

                                    {errors.dong_san?.[index]?.dia_chi && <Text style={{ color: 'red' }}>{errors.dong_san?.[index]?.dia_chi?.message}</Text>}


                                    {
                                        item.hinh_anh ? <Image source={{ uri: item.hinh_anh }} style={{ height: 200, marginBottom: 10 }} resizeMode="cover" /> : null
                                    }

                                    {
                                        item.hinh_anh ?
                                            <View style={{ marginBottom: 10 }}>
                                                <Button title="Xóa ảnh" onPress={() => {
                                                    setDefaultValues((prew: any) => {
                                                        const newValues = { ...prew };
                                                        newValues.dong_san[index].hinh_anh = "";
                                                        return newValues;
                                                    });
                                                }} />
                                            </View>
                                            : (
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
                                                                const result = await ImagePicker.launchImageLibrary({
                                                                    mediaType: 'photo',
                                                                    includeBase64: false,
                                                                    selectionLimit: 1,
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
