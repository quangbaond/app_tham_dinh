// LoginScreen.js
import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, ImageBackground, Text, Alert, Button, PermissionsAndroid, Image, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { useForm, Controller, set } from "react-hook-form"
import * as ImagePicker from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import { getData, mergeData, storeData } from '../common';
import { useIsFocused } from '@react-navigation/native'
import UserAvatar from 'react-native-user-avatar';

const RegisterSecreen6 = ({ navigation }: any) => {
    const [loading, setLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('')

    const [iamges, setImages] = useState([] as any);
    const [userLogin, setUserLogin] = useState(null);
    const isFocused = useIsFocused();

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

    useEffect(() => {
        const getUserLogin = async () => {
            const userLogin = await getData('userLogin');
            if (!userLogin) {
                Alert.alert('Thông báo', 'Vui lòng đăng nhập để tiếp tục');
                navigation.navigate('Đăng nhập');
                return;
            }

            const token = JSON.parse(userLogin).token;

            fetch('https://tp.tucanhcomputer.vn/api/auth/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }).then((response) => response.json())
                .then((data) => {
                    setUserLogin(data);
                    console.log(data);

                }).catch((error) => {
                    if (error) {
                        Alert.alert('Lỗi', 'Đã có lỗi xảy ra');
                        navigation.navigate('Đăng nhập');
                    }
                })
        }
        getUserLogin();
    }, [isFocused]);

    // useEffect(() => {
    //     if (userLogin) {
    //         console.log(userLogin);

    //         if (!userLogin?.user_identifications) {
    //             Alert.alert('Thông báo', 'Vui lòng cung cấp thông tin cá nhân để tiếp tục');
    //             navigation.navigate('Xác thực CMND/CCCD');
    //             return;
    //         }

    //         // else if(!userLogin?.user_licenses) {
    //         //     Alert.alert('Thông báo', 'Vui lòng cung cấp thông tin bằng lái xe để tiếp tục');
    //         //     navigation.navigate('Xác thực BLX');
    //         //     return;
    //         // }

    //         else if (!userLogin?.user_finances) {
    //             Alert.alert('Thông báo', 'Vui lòng cung cấp thông tin tài chính để tiếp tục');
    //             navigation.navigate('Tài chính');
    //             return;
    //         }

    //         else if (userLogin?.user_licenses) {
    //             Alert.alert('Thông báo', 'Vui lòng cung cấp thông tin bằng lái xe để tiếp tục');
    //             navigation.navigate('Xác thực BLX');
    //             return;
    //         }

    //         else if (userLogin?.user_movables.length <= 0 || userLogin?.user_san_estates.length <= 0) {
    //             Alert.alert('Thông báo', 'Vui lòng cung cấp thông tin tài sản để tiếp tục');
    //             navigation.navigate('Tài sản');
    //             return;
    //         }

    //         else if (userLogin?.user_loan_amounts.length <= 0) {
    //             Alert.alert('Thông báo', 'Vui lòng cung cấp thông tin công việc để tiếp tục');
    //             navigation.navigate('Khoản vay');
    //             return;
    //         }
    //     }
    // }, [userLogin])

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
            item.hinh_anh = defaultValuesForm.bat_dong_san[index]?.hinh_anh;
            if (item.hinh_anh) {
                if (!item.hinh_anh.includes('http')) {
                    formData.append(`bat_dong_san[${index}][hinh_anh]`, {
                        uri: item.hinh_anh,
                        type: 'image/jpeg',
                        name: item.hinh_anh.split('/').pop(),
                    });
                } else {
                    formData.append(`bat_dong_san[${index}][hinh_anh]`, item.hinh_anh);
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
                } else {
                    formData.append(`dong_san[${index}][hinh_anh]`, item.hinh_anh);
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
                    textStyle={{ color: '#222222' }}></Spinner>}
                    <View style={{ backgroundColor: '#FFDF00', padding: 10,  flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                                    <View style={{ width: 30 }}>
                                        <UserAvatar size={30} name={userLogin?.user_identifications?.name} textColor={'#222222'} />
                                    </View>
                                    <View style={{ alignSelf: 'center' }}>
                                        <Text style={{ color: '#222222', fontSize: 14, marginLeft: 10 }}>{userLogin?.user_identifications?.name}</Text>
                                    </View>
                                </View>
                            </View>

                <ScrollView style={{ padding: 20, borderColor: '#ccc', borderWidth: 1 }}>
                    <Text style={{ color: '#222222', fontSize: 20, marginBottom: 5, fontWeight: '700' }}>{'Bất động sản'}</Text>
                    <>
                        {defaultValuesForm.bat_dong_san.map((item: any, index: number) => (
                            <>
                                <View key={index}>
                                    <Text style={{ color: '#222222', fontSize: 14, marginBottom: 5, fontWeight: '500' }}>{'Địa chỉ'}</Text>
                                    <Controller
                                        control={control}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <TextInput
                                                style={errors.bat_dong_san?.[index]?.dia_chi ? [styles.input, { borderColor: 'red' }] : styles.input}
                                                placeholder="Địa chỉ"
                                                value={value as string} // Cast value to string
                                                onChangeText={onChange}
                                                placeholderTextColor="#222222"
                                                editable={true}
                                                keyboardType='default'
                                                multiline={true}
                                                returnKeyLabel='next'
                                                numberOfLines={2}
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
                                                {/* <Button title="Xóa ảnh" onPress={() => {
                                                    setDefaultValues((prew: any) => {
                                                        const newValues = { ...prew };
                                                        newValues.bat_dong_san[index].hinh_anh = "";
                                                        return newValues;
                                                    });
                                                    
                                                }} /> */}
                                                <TouchableOpacity
                                                    style={{ backgroundColor: '#FFDF00', padding: 5, borderRadius: 15, marginTop: 10, borderWidth: 1, borderColor: '#fff' }}
                                                    onPress={() => {
                                                        setDefaultValues((prew: any) => {
                                                            const newValues = { ...prew };
                                                            newValues.bat_dong_san[index].hinh_anh = "";
                                                            return newValues;
                                                        });
                                                    }}
                                                >
                                                    <Text style={{ color: '#222222', fontSize: 14,  textAlign:'center' }}>{'Xóa ảnh'}</Text>
                                                    </TouchableOpacity>
                                            </View>
                                            : (
                                                <View style={{ marginBottom: 5 }}>
                                                    <TouchableOpacity
                                                        style={{ backgroundColor: '#FFDF00', padding: 5, borderRadius: 15, marginTop: 10, borderWidth: 1, borderColor: '#fff' }}
                                                        onPress={async () => {
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
                                                        }}
                                                    >
                                                        <Text style={{ color: '#222222', fontSize: 14, textAlign: 'center' }}>{'Hình ảnh'}</Text>
                                                    </TouchableOpacity>
                                                </View>

                                            )
                                    }
                                </View>

                                {
                                    defaultValuesForm.bat_dong_san.length > 1 ? (
                                        <View style={{ marginBottom: 10 }}>
                                            {/* <Button title="Xoá bất động sản" onPress={() => {
                                                setDefaultValues((prew: any) => {
                                                    const newValues = { ...prew };
                                                    newValues.bat_dong_san.splice(index, 1);
                                                    return newValues;
                                                });
                                            }} /> */}
                                            <TouchableOpacity
                                                style={{ backgroundColor: '#FFDF00', padding: 5, borderRadius: 15,  borderWidth: 1, borderColor: '#fff' }}
                                                onPress={() => {
                                                    setDefaultValues((prew: any) => {
                                                        const newValues = { ...prew };
                                                        newValues.bat_dong_san.splice(index, 1);
                                                        return newValues;
                                                    });
                                                }}
                                            >
                                                <Text style={{ color: '#222222', fontSize: 14, textAlign: 'center' }}>{'Xoá bất động sản'}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ) : null
                                }

                                <View style={{
                                    borderBottomColor: '#FFDF00',
                                    borderBottomWidth: 2,
                                    marginBottom: 10,
                                    marginTop: 10
                                }} />

                            </>
                        ))}

                        <View style={{ marginBottom: 5 }}>
                            <TouchableOpacity
                                style={{ backgroundColor: '#FFDF00', padding: 5, borderRadius: 15, marginTop: 5, borderWidth: 1, borderColor: '#fff' }}
                                onPress={() => {
                                    setDefaultValues((prew: any) => {
                                        const newValues = { ...prew };
                                        newValues.bat_dong_san.push({
                                            id: newValues.bat_dong_san.length + 1,
                                            dia_chi: "",
                                            hinh_anh: "",
                                        });
                                        return newValues;
                                    });
                                }}
                            >
                                <Text style={{ color: '#222222', fontSize: 14, textAlign: 'center' }}>{'Thêm bất động sản'}</Text>
                            </TouchableOpacity>
                        </View>
                    </>

                    <Text style={{ color: '#222222', fontSize: 20, marginBottom: 5, fontWeight: '700' }}>{'Động sản'}</Text>

                    <>
                        {defaultValuesForm.dong_san.map((item: any, index: number) => (
                            <>
                                <View key={index}>
                                    <Text style={{ color: '#222222', fontSize: 14, marginBottom: 5, fontWeight: '500' }}>{'Loại động sản (Xe máy, Ô tô,...)'}</Text>

                                    <Controller
                                        control={control}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <TextInput
                                                style={errors.dong_san?.[index]?.loai_tai_san ? [styles.input, { borderColor: 'red' }] : styles.input}
                                                placeholder="Xe máy, Ô tô,..."
                                                value={value as string} // Cast value to string
                                                onChangeText={onChange}
                                                placeholderTextColor="#222222"
                                                editable={true}
                                                keyboardType='default'
                                            />
                                        )}
                                        name={`dong_san.${index}.loai_tai_san`}
                                        rules={{ required: { value: true, message: "Loại tài sản không được bỏ trống." } }}
                                    />
                                    {errors.dong_san?.[index]?.loai_tai_san && <Text style={{ color: 'red' }}>{errors.dong_san?.[index]?.loai_tai_san?.message}</Text>}
                                    <Text style={{ color: '#222222', fontSize: 14, marginBottom: 5, fontWeight: '500' }}>{'Địa chỉ'}</Text>
                                    
                                    <Controller
                                        control={control}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <TextInput
                                                style={errors.dong_san?.[index]?.dia_chi ? [styles.input, { borderColor: 'red' }] : styles.input}
                                                placeholder="Địa chỉ."
                                                value={value as string} // Cast value to string
                                                onChangeText={onChange}
                                                placeholderTextColor="#222222"
                                                editable={true}
                                                keyboardType='default'
                                                multiline={true}
                                                numberOfLines={2}
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

                                                <TouchableOpacity
                                                    style={{ backgroundColor: '#FFDF00', padding: 5, borderRadius: 15, marginTop: 10, borderWidth: 1, borderColor: '#fff' }}
                                                    onPress={() => {
                                                        setDefaultValues((prew: any) => {
                                                            const newValues = { ...prew };
                                                            newValues.dong_san[index].hinh_anh = "";
                                                            return newValues;
                                                        });
                                                    }}
                                                >
                                                    <Text style={{ color: '#222222', fontSize: 14, textAlign: 'center' }}>{'Xóa ảnh'}</Text>
                                                </TouchableOpacity>
                                            </View>
                                            : (
                                                <View style={{ marginBottom: 10 }}>
                                                    {/* <Button title="Thêm ảnh" onPress={async () => {
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
                                                    } /> */}
                                                    <TouchableOpacity
                                                        style={{ backgroundColor: '#FFDF00', padding: 5, borderRadius: 15, marginTop: 10, borderWidth: 1, borderColor: '#fff' }}
                                                        onPress={async () => {
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
                                                        }}
                                                    >
                                                        <Text style={{ color: '#222222', fontSize: 14, textAlign: 'center' }}>{'Hình ảnh'}</Text>
                                                    </TouchableOpacity>
                                                </View>

                                            )
                                    }
                                </View>

                                {
                                    defaultValuesForm.dong_san.length > 1 && (
                                        <View style={{ marginBottom: 10 }}>
                                            <TouchableOpacity
                                                style={{ backgroundColor: '#FFDF00', padding: 5, borderRadius: 15,  borderWidth: 1, borderColor: '#fff' }}
                                                onPress={() => {
                                                    setDefaultValues((prew: any) => {
                                                        const newValues = { ...prew };
                                                        newValues.dong_san.splice(index, 1);
                                                        return newValues;
                                                    });
                                                }}
                                            >
                                                <Text style={{ color: '#222222', fontSize: 14, textAlign: 'center' }}>{'Xoá động sản'}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }

                                <View style={{
                                    borderBottomColor: '#FFDF00',
                                    borderBottomWidth: 2,
                                    marginBottom: 10,
                                    marginTop: 10
                                }} />


                            </>
                        ))}

                        <View style={{ marginBottom: 10 }}>
                            <TouchableOpacity
                                style={{ backgroundColor: '#FFDF00', padding: 5, borderRadius: 15, marginTop: 5, borderWidth: 1, borderColor: '#fff' }}
                                onPress={() => {
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
                                }}
                            >
                                <Text style={{ color: '#222222', fontSize: 14, textAlign: 'center' }}>{'Thêm động sản'}</Text>
                            </TouchableOpacity>

                        </View>


                    </>

                    <View style={{ marginBottom: 30 }}>
                        <TouchableOpacity
                            style={{ backgroundColor: '#FFDF00', padding: 5, borderRadius: 15, marginTop: 5, borderWidth: 1, borderColor: '#fff' }}
                            onPress={handleSubmit(submit)}
                        >
                            <Text style={{ textAlign: 'center', color: '#222' }}>Tiếp tục</Text>
                        </TouchableOpacity>
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
        borderColor: '#FFDF00',
        borderRadius: 15,
        width: '100%',
        marginBottom: 10,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        color: '#222222',
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    // input disabled
    inputDisabled: {
        backgroundColor: 'rgba(255,255,255,0.4)',
    },


});
export default RegisterSecreen6;
