// LoginScreen.js
import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, ImageBackground, Text, Alert, Button, PermissionsAndroid, Image, ScrollView, Platform } from 'react-native';
import { useForm, Controller, set } from "react-hook-form"
import * as ImagePicker from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import { getData, mergeData, storeData } from '../common';
import SelectDropdown from 'react-native-select-dropdown';

const RegisterSecreen5 = ({ navigation }: any) => {
    const [loading, setLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('')

    const [iamges, setImages] = useState([] as any);

    const [defaultValuesForm, setDefaultValues] = useState({
        thu_nhap_hang_thang: "",
        ten_cong_ty: "",
        dia_chi_cong_ty: "",
        so_dien_thoai_cong_ty: "",
        sao_ke_nhan_luong: "",
        so_dien_thoai_noi_lam_viec: [
            {
                id: 1,
                name: "",
                phone: "",
                relationship: "",
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
        await storeData('taichinh', JSON.stringify(data));
        navigation.navigate('Tài sản');
    }

    return (
        <View>
            <ImageBackground source={require('../assets/logo/logo.jpg')} resizeMode="cover" style={styles.image}>
                {loading && <Spinner visible={loading}
                    textContent={'Đang tải...'}
                    textStyle={{ color: '#FFF' }}></Spinner>}

                <ScrollView style={{ padding: 20, borderColor: '#ccc', borderWidth: 1 }}>
                    <Text style={{ color: '#fff', fontSize: 20, marginBottom: 20 }}>{'Thông tin tài chính'}</Text>
                    <>
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                    <Text style={{ color: '#fff', fontSize: 14, marginBottom: 10 }}>{'Thu nhập hàng tháng (VND)'}</Text>
                                    <TextInput
                                        style={errors.thu_nhap_hang_thang ? [styles.input, { borderColor: 'red' }] : [styles.input]}
                                        value={value}
                                        onChangeText={(e) => {
                                            // format currency
                                            const currency = e.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                            onChange(currency);
                                        }}
                                        placeholderTextColor="#fff"
                                        placeholder='15,000,000'
                                        keyboardType='numeric'
                                        editable={true}
                                        returnKeyLabel="Done"
                                    />
                                </>
                            )}
                            name="thu_nhap_hang_thang"
                        />
                        <Text style={{ color: '#fff', fontSize: 14, marginBottom: 10 }}>{'Sao kê TK nhận lương'}</Text>
                        <Text style={{ color: '#fff', fontSize: 14, marginBottom: 10 }}>{'Hình ảnh sao kê 6 tháng Ebank'}</Text>

                        {iamges.map((item: any, index: number) => {
                            return (
                                <View style={{ display: 'flex', marginBottom: 10 }}>
                                    {item.uri && (
                                        <>
                                            <Image key={index} source={{ uri: item.uri }} style={{ height: 150, marginBottom: 10 }} />
                                            <Button title="Xóa ảnh" onPress={() => {
                                                const newImages = iamges.filter((item: any, i: number) => i !== index);
                                                setImages(newImages);
                                            }} />
                                        </>
                                    )}
                                </View>
                            )
                        })}

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
                                        selectionLimit: 5,

                                    }, (response: any) => {
                                        console.log('Response = ', response);
                                        if (response.didCancel) {
                                            console.log('User cancelled image picker');
                                            Alert.alert('Bạn đã hủy chọn ảnh');
                                        } else if (response.error) {
                                            console.log('Có lỗi xảy ra: ', response.error);
                                        } else if (response.customButton) {
                                            console.log('User tapped custom button: ', response.customButton);
                                        } else {
                                            // setImages(response.assets);
                                            setImages((prew) => [...prew, response.assets[0]]);
                                            // response.assets.forEach((element: any, index: number) => {
                                            //     console.log('element', element);
                                            // });
                                        }
                                    });
                                } else {
                                    // console.log("Camera permission denied");
                                    Alert.alert('Không thể mở thư viện ảnh');
                                }
                            } catch (err) {
                                console.warn('Thiết bị không hỗ trợ camera');
                                Alert.alert('Thiết bị không hỗ trợ truy cập thư viện ảnh');
                            }
                        }} />



                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                    <Text style={{ color: '#fff', fontSize: 14, marginBottom: 10, marginTop: 10 }}>{'Địa chỉ công ty'}</Text>
                                    <TextInput
                                        style={errors.dia_chi_cong_ty ? [styles.input, { borderColor: 'red' }] : [styles.input]}
                                        placeholder="Địa chỉ công ty"
                                        value={value}
                                        onChangeText={onChange}
                                        placeholderTextColor="#fff"
                                        keyboardType='default'
                                        editable={true}
                                        multiline={true}
                                        numberOfLines={2}
                                    />
                                </>

                            )}
                            name="dia_chi_cong_ty"
                        />

                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                    <Text style={{ color: '#fff', fontSize: 14, marginBottom: 10 }}>{'Số điện thoại công ty'}</Text>
                                    <TextInput
                                        style={errors.So_dien_thoai_cong_ty ? [styles.input, { borderColor: 'red' }] : [styles.input]}
                                        placeholder="Số điện thoại công ty"
                                        value={value}
                                        onChangeText={onChange}
                                        placeholderTextColor="#fff"
                                        editable={true}
                                    />
                                </>

                            )}
                            name="So_dien_thoai_cong_ty"
                            rules={{
                                required: { value: true, message: "Số điện thoại công ty không được bỏ trống" },
                                pattern: { value: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ" }
                            }}
                        />

                        <View style={{
                            borderBottomColor: 'white',
                            borderBottomWidth: StyleSheet.hairlineWidth,
                            marginBottom: 20,
                            marginTop: 20
                        }} />

                        <Text style={{ color: '#fff', fontSize: 20, marginBottom: 20 }}>{'Thông tin người tham chiếu'}</Text>

                        {defaultValuesForm.so_dien_thoai_noi_lam_viec.map((item: any, index: number) => (
                            <>
                                <View key={index}>
                                    <Text style={{ color: '#fff', fontSize: 14, marginBottom: 10 }}>{'Chức vụ'}</Text>
                                    <Text style={{ color: '#fff', fontSize: 12, marginBottom: 10 }}>{'Giám đốc/Quản lý công ty/Kế toán/Gia đình nhân sự...'}</Text>

                                    <Controller
                                        control={control}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <SelectDropdown
                                                data={[{
                                                    title: 'Giám đốc',
                                                    value: 'Giám đốc'
                                                }, {
                                                    title: 'Quản lý công ty',
                                                    value: 'Quản lý công ty'
                                                }, {
                                                    title: 'Kế toán',
                                                    value: 'Kế toán'
                                                },
                                                {
                                                    title: 'Gia đình nhân sự',
                                                    value: 'Gia đình nhân sự'
                                                }
                                                ]}
                                                onSelect={(selectedItem) => {
                                                    // handle selected item
                                                    console.log(selectedItem);

                                                }}
                                                renderButton={(selectedItem, isOpened) => {
                                                    return (
                                                        <View style={styles.dropdownButtonStyle}>

                                                            <Text style={styles.dropdownButtonTxtStyle}>
                                                                {(selectedItem && selectedItem.title) || 'Chọn chức vụ'}
                                                            </Text>
                                                            {/* <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} /> */}
                                                        </View>
                                                    );
                                                }}
                                                renderItem={(item, index, isSelected) => {
                                                    return (
                                                        <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                                                            <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                                                        </View>
                                                    );
                                                }}
                                            />
                                        )}
                                        name={`so_dien_thoai_noi_lam_viec.${index}.relationship`}
                                        rules={{ required: { value: true, message: "Quan hệ không được bỏ trống" } }}
                                    />
                                    {errors.so_dien_thoai_noi_lam_viec?.[index]?.relationship && <Text style={{ color: 'red' }}>{errors.so_dien_thoai_noi_lam_viec?.[index]?.relationship?.message}</Text>}

                                    <Text style={{ color: '#fff', fontSize: 14, marginBottom: 10 }}>{'Họ và tên'}</Text>

                                    <Controller
                                        control={control}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <TextInput
                                                style={errors.so_dien_thoai_noi_lam_viec?.[index]?.name ? [styles.input, { borderColor: 'red' }] : styles.input}
                                                placeholder="Họ và tên"
                                                value={value as string} // Cast value to string
                                                onChangeText={onChange}
                                                placeholderTextColor="#fff"
                                                defaultValue={item.name}
                                                editable={true}
                                            />
                                        )}
                                        name={`so_dien_thoai_noi_lam_viec.${index}.name`}
                                        rules={{ required: { value: true, message: "Họ và tên không được bỏ trống" } }}
                                    />
                                    {errors.so_dien_thoai_noi_lam_viec?.[index]?.name && <Text style={{ color: 'red' }}>{errors.so_dien_thoai_noi_lam_viec?.[index]?.name?.message}</Text>}
                                    <Text style={{ color: '#fff', fontSize: 14, marginBottom: 10 }}>{'Số điện thoại'}</Text>
                                    <Controller
                                        control={control}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <TextInput
                                                style={errors.so_dien_thoai_noi_lam_viec?.[index]?.phone ? [styles.input, { borderColor: 'red' }] : styles.input}
                                                placeholder="Số điện thoại"
                                                value={value as string}
                                                onChangeText={onChange}
                                                placeholderTextColor="#fff"
                                                keyboardType='numeric'
                                                defaultValue={item.phone}
                                                editable={true}
                                            />
                                        )}
                                        name={`so_dien_thoai_noi_lam_viec.${index}.phone`}
                                        rules={{
                                            required: { value: true, message: "Số điện thoại không được bỏ trống" },
                                            pattern: { value: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ" }
                                        }}
                                    />
                                    {errors.so_dien_thoai_noi_lam_viec?.[index]?.phone && <Text style={{ color: 'red' }}>{errors.so_dien_thoai_noi_lam_viec?.[index]?.phone?.message}</Text>}
                                </View>
                                <View style={{
                                    borderBottomColor: 'white',
                                    borderBottomWidth: StyleSheet.hairlineWidth,
                                    marginBottom: 20,
                                    marginTop: 20
                                }} />

                            </>
                        ))}
                        {/* xóa người thân */}
                        {
                            defaultValuesForm.so_dien_thoai_noi_lam_viec.length > 1 &&
                            <View style={{ marginBottom: 30 }}>
                                <Button title="Xóa người tham chiếu" onPress={() => {
                                    // get data from local storage
                                    const getDataFromStorage = async () => {
                                        const data = await getData('taichinh');
                                        if (data) {
                                            const newData = {
                                                ...defaultValuesForm,
                                                ...JSON.parse(data),
                                            };
                                            newData.so_dien_thoai_noi_lam_viec.pop();
                                            setDefaultValues({
                                                ...defaultValuesForm,
                                                ...newData
                                            });
                                            storeData('taichinh', JSON.stringify(newData));
                                        }
                                    }
                                    getDataFromStorage();
                                }} />
                            </View>
                        }
                        <View style={{ marginBottom: 10 }}>
                            <Button title="Thêm người tham chiếu" onPress={() => {
                                // get data from local storage
                                const getDataFromStorage = async () => {
                                    const data = await getData('taichinh');
                                    if (data) {
                                        const newData = {
                                            ...defaultValuesForm,
                                            ...JSON.parse(data),
                                        };
                                        newData.so_dien_thoai_noi_lam_viec.push({
                                            name: "",
                                            phone: "",
                                        });
                                        setDefaultValues({
                                            ...defaultValuesForm,
                                            ...newData
                                        });
                                        storeData('taichinh', JSON.stringify(newData));
                                    }
                                }
                                getDataFromStorage();
                            }} />
                        </View>
                        <View style={{ marginBottom: 30 }}>
                            <Button title="Tiếp tục" onPress={handleSubmit(submit)} />
                        </View>
                    </>
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
        marginBottom: 5,
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
    dropdownButtonStyle: {
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        color: 'white',
        borderRadius: 7,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: 'white',
    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 16,
        color: 'white',
    },
    dropdownButtonArrowStyle: {
        fontSize: 28,
    },
    dropdownButtonIconStyle: {
        fontSize: 28,
        marginRight: 3,
    },
    dropdownMenuStyle: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 8,
    },
    dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
    },
    dropdownItemIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },


});
export default RegisterSecreen5;
