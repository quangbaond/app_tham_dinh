// LoginScreen.js
import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, ImageBackground, Text, Alert, Button, PermissionsAndroid, Image, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { useForm, Controller, set } from "react-hook-form"
import * as ImagePicker from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import { getData, mergeData, storeData } from '../common';
import SelectDropdown from 'react-native-select-dropdown';
import UserAvatar from 'react-native-user-avatar';
import { useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';

const RegisterSecreen5 = ({ navigation }: any) => {
    const [loading, setLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('')

    const [iamges, setImages] = useState([] as any);
    const isFocused = useIsFocused()

    const [userLogin, setUserLogin] = React.useState<any>(null);

    const [defaultValuesForm, setDefaultValues] = useState({
        thu_nhap_hang_thang: "",
        ten_cong_ty: "",
        dia_chi_cong_ty: "",
        so_dien_thoai_cong_ty: "",
        so_dien_thoai_noi_lam_viec: [
            {
                id: 1,
                name: "",
                phone: "",
                relationship: "",
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
            setImages(result?.user_salary_statements.map((item: any) => {
                return item.images;
            }));
            setDefaultValues({
                ...defaultValuesForm,
                ...result?.user_finances,
                so_dien_thoai_noi_lam_viec: result?.user_phone_work_places.map((item: any) => {
                    return {
                        name: item.name,
                        phone: item.phone,
                        relationship: item.relationship,
                    }
                }),
            });

            return {
                ...defaultValuesForm,
                ...result?.user_finances,
                so_dien_thoai_noi_lam_viec: result?.user_phone_work_places.map((item: any) => {
                    return {
                        name: item.name,
                        phone: item.phone,
                        relationship: item.relationship,
                    }
                }),
            };
        },

    })

    const submit = async (data: any) => {
        setLoading(true);
        if (iamges.length <= 0) {
            setLoading(false);
            Alert.alert('Lỗi', 'Vui lòng chọn ảnh sao kê nhận lương');
            return;
        }

        if (data.so_dien_thoai_noi_lam_viec.length <= 0) {
            setLoading(false);
            Alert.alert('Lỗi', 'Vui lòng nhập thông tin người tham chiếu');
            return;
        }

        const userLogin = await getData('userLogin');
        const token = JSON.parse(userLogin as string).token;
        const formData = new FormData();
        formData.append('thu_nhap_hang_thang', data.thu_nhap_hang_thang);
        formData.append('dia_chi_cong_ty', data.dia_chi_cong_ty);
        formData.append('ten_cong_ty', data.ten_cong_ty);
        formData.append('so_dien_thoai_cong_ty', data.so_dien_thoai_cong_ty);
        iamges.forEach((item: any, index: number) => {
            // check nếu là url ảnh thì không cần thêm vào form data
            if (!item.includes('http')) {
                formData.append(`sao_ke_nhan_luong[${index}]`, {
                    uri: item,
                    type: 'image/jpeg',
                    name: item.split('/').pop(),
                });
            }
        });
        data.so_dien_thoai_noi_lam_viec.forEach((item: any, index: number) => {
            formData.append(`so_dien_thoai_noi_lam_viec[${index}][name]`, item.name);
            formData.append(`so_dien_thoai_noi_lam_viec[${index}][phone]`, item.phone);
            formData.append(`so_dien_thoai_noi_lam_viec[${index}][relationship]`, item.relationship);
        });

        fetch('https://tp.tucanhcomputer.vn/api/update-finance', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        }).then((response) => response.json())
            .then((data) => {
                setLoading(false);
                if (data.error) {
                    Alert.alert('Lỗi', data.error);
                    return;
                }

                if (data.message) {
                    Alert.alert('Thành công', data.message);
                }
                if (data.user.user_movables.length <= 0 || data.user.user_san_estates.length <= 0) {
                    navigation.navigate('Tài sản');
                } else if (data.user.user_loan_amounts.length <= 0) {
                    // navigation.navigate('Trang cá nhân');
                    navigation.navigate('Khoản vay');
                } else {
                    navigation.navigate('Trang cá nhân');
                }
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
                Alert.alert('Lỗi', 'Có lỗi xảy ra');
            });
    }

    return (
        <View>
            <ImageBackground source={require('../assets/logo/logo.jpg')} resizeMode="cover" style={styles.image}>
                {loading && <Spinner visible={loading}
                    textContent={'Đang tải...'}
                    textStyle={{ color: '#ffffff' }}></Spinner>}
                <View style={{ backgroundColor: '#3366CC', padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View >
                        <TouchableOpacity onPress={() => {
                            navigation.navigate('Trang cá nhân');
                        }}>
                            <Icon name="arrowleft" size={30} color={'#fff'}></Icon>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <View style={{ width: 30 }}>
                            <UserAvatar size={30} name={userLogin?.user_identifications?.name} textColor={'#ffffff'} />
                        </View>

                        <View style={{ alignSelf: 'center' }}>
                            <Text style={{ color: '#ffffff', fontSize: 14, marginLeft: 10 }}>{userLogin?.user_identifications?.name}</Text>
                        </View>
                    </View>

                    <View style={{ alignSelf: 'center' }}>
                        <TouchableOpacity onPress={() => {
                            navigation.navigate('Cài đặt');
                        }}>
                            <Icon name="setting" size={30} color={'#fff'}></Icon>

                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView style={{ padding: 20, borderColor: '#ccc', borderWidth: 1 }}>
                    <Text style={{ color: '#ffffff', fontSize: 20, marginBottom: 10, fontWeight: '700' }}>{'Thông tin tài chính'}</Text>
                    <>
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                    <Text style={{ color: '#ffffff', fontSize: 14, marginBottom: 5, fontWeight: '500' }}>{'Thu nhập hàng tháng (VND)'}</Text>
                                    <TextInput
                                        style={errors.thu_nhap_hang_thang ? [styles.input, { borderColor: 'red' }] : [styles.input]}
                                        value={value}
                                        onChangeText={(e) => {
                                            // format currency
                                            const currency = e.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                            onChange(currency);
                                        }}
                                        placeholderTextColor="#ffffff"
                                        placeholder='15,000,000'
                                        keyboardType='numeric'
                                        editable={true}
                                        returnKeyLabel="Done"
                                    />
                                </>
                            )}
                            name="thu_nhap_hang_thang"
                        />
                        <Text style={{ color: '#ffffff', fontSize: 14, marginBottom: 2, fontWeight: '500' }}>{'Sao kê TK nhận lương'}</Text>
                        <Text style={{ color: '#ffffff', fontSize: 14, marginBottom: 5, fontWeight: '700' }}>{'(Hình ảnh sao kê 6 tháng Ebank)'}</Text>

                        {iamges.map((item: any, index: number) => {
                            return (
                                <View style={{ display: 'flex', marginBottom: 10 }}>
                                    {item && (
                                        <>
                                            <Image key={index} source={{ uri: item }} style={{ height: 150, marginBottom: 10, borderWidth: 1 }} />
                                            <TouchableOpacity
                                                style={{ backgroundColor: '#3366CC', padding: 5, borderRadius: 15, marginTop: 5, borderWidth: 1, borderColor: '#fff' }}
                                                onPress={() => {
                                                    const newImages = iamges.filter((item: any, i: number) => i !== index);
                                                    setImages(newImages);
                                                }} >
                                                <Text style={{ color: '#ffffff', fontSize: 14, textAlign: 'center' }}>{'Xóa ảnh'}</Text>
                                            </TouchableOpacity>
                                        </>
                                    )}
                                </View>
                            )
                        })}
                        <TouchableOpacity
                            style={{ backgroundColor: '#3366CC', padding: 5, borderRadius: 15, marginTop: 5, borderWidth: 1, borderColor: '#fff' }}
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
                                                setImages((prew) => [...prew, response.assets[0].uri]);
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
                            }}
                        >
                            <Text style={{ color: '#ffffff', fontSize: 14, textAlign: 'center' }}>{'Chọn ảnh'}</Text>
                        </TouchableOpacity>

                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                    <Text style={{ color: '#ffffff', fontSize: 14, marginBottom: 5, fontWeight: '500' }}>{'Tên Công ty'}</Text>
                                    <TextInput
                                        style={errors.dia_chi_cong_ty ? [styles.input, { borderColor: 'red' }] : [styles.input]}
                                        placeholder="Tên công ty"
                                        value={value}
                                        onChangeText={onChange}
                                        placeholderTextColor="#ffffff"
                                        keyboardType='default'
                                        editable={true}
                                        multiline={true}
                                        numberOfLines={2}
                                    />
                                </>

                            )}
                            name="ten_cong_ty"
                        />

                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                    <Text style={{ color: '#ffffff', fontSize: 14, marginBottom: 5, fontWeight: '500' }}>{'Địa chỉ công ty'}</Text>
                                    <TextInput
                                        style={errors.dia_chi_cong_ty ? [styles.input, { borderColor: 'red' }] : [styles.input]}
                                        placeholder="Địa chỉ công ty"
                                        value={value}
                                        onChangeText={onChange}
                                        placeholderTextColor="#ffffff"
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
                                    <Text style={{ color: '#ffffff', fontSize: 14, marginBottom: 5, fontWeight: '500' }}>{'Số điện thoại công ty'}</Text>
                                    <TextInput
                                        style={errors.so_dien_thoai_cong_ty ? [styles.input, { borderColor: 'red' }] : [styles.input]}
                                        placeholder="Số điện thoại công ty"
                                        value={value}
                                        onChangeText={onChange}
                                        placeholderTextColor="#ffffff"
                                        editable={true}
                                    />
                                </>

                            )}
                            name="so_dien_thoai_cong_ty"
                            rules={{
                                required: { value: true, message: "Số điện thoại công ty không được bỏ trống" },
                                pattern: { value: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ" }
                            }}
                        />

                        <View style={{
                            borderBottomColor: '#3366CC',
                            borderBottomWidth: 2,
                            marginBottom: 10,
                            marginTop: 10
                        }} />

                        <Text style={{ color: '#ffffff', fontSize: 20, marginBottom: 5, fontWeight: '700' }}>{'Thông tin người tham chiếu'}</Text>

                        {defaultValuesForm.so_dien_thoai_noi_lam_viec.map((item: any, index: number) => (
                            <>
                                <View key={index}>
                                    <Text style={{ color: '#ffffff', fontSize: 14, marginBottom: 5, fontWeight: '500' }}>{'Chức vụ'}</Text>
                                    <Text style={{ color: '#ffffff', fontSize: 12, marginBottom: 5, fontWeight: '500' }}>{'(Giám đốc/Quản lý công ty/Kế toán/Gia đình nhân sự...)'}</Text>

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
                                                defaultValueByIndex={
                                                    value === 'Giám đốc' ? 0 : value === 'Quản lý công ty' ? 1 : value === 'Kế toán' ? 2 : value === 'Gia đình nhân sự' ? 3 : 0
                                                }
                                                onSelect={(selectedItem) => {
                                                    // handle selected item
                                                    console.log(selectedItem);
                                                    onChange(selectedItem.value);

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

                                    <Text style={{ color: '#ffffff', fontSize: 12, marginBottom: 5, fontWeight: '500' }}>{'Họ và tên'}</Text>

                                    <Controller
                                        control={control}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <TextInput
                                                style={errors.so_dien_thoai_noi_lam_viec?.[index]?.name ? [styles.input, { borderColor: 'red' }] : styles.input}
                                                placeholder="Họ và tên"
                                                value={value as string} // Cast value to string
                                                onChangeText={onChange}
                                                placeholderTextColor="#ffffff"
                                                defaultValue={item.name}
                                                editable={true}
                                            />
                                        )}
                                        name={`so_dien_thoai_noi_lam_viec.${index}.name`}
                                        rules={{ required: { value: true, message: "Họ và tên không được bỏ trống" } }}
                                    />
                                    {errors.so_dien_thoai_noi_lam_viec?.[index]?.name && <Text style={{ color: 'red' }}>{errors.so_dien_thoai_noi_lam_viec?.[index]?.name?.message}</Text>}
                                    <Text style={{ color: '#ffffff', fontSize: 12, marginBottom: 5, fontWeight: '500' }}>{'Số điện thoại'}</Text>
                                    <Controller
                                        control={control}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <TextInput
                                                style={errors.so_dien_thoai_noi_lam_viec?.[index]?.phone ? [styles.input, { borderColor: 'red' }] : styles.input}
                                                placeholder="Số điện thoại"
                                                value={value as string}
                                                onChangeText={onChange}
                                                placeholderTextColor="#ffffff"
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
                                    borderBottomColor: '#3366CC',
                                    borderBottomWidth: 2,
                                    marginBottom: 10,
                                    marginTop: 10
                                }} />

                            </>
                        ))}
                        {/* xóa người thân */}
                        {
                            defaultValuesForm.so_dien_thoai_noi_lam_viec.length > 1 &&
                            <View style={{ marginBottom: 30 }}>
                                <Button title="Xóa người tham chiếu" onPress={() => {
                                    // get data from local storage
                                    const newValues = defaultValuesForm.so_dien_thoai_noi_lam_viec.slice(0, defaultValuesForm.so_dien_thoai_noi_lam_viec.length - 1);
                                    setDefaultValues({ ...defaultValuesForm, so_dien_thoai_noi_lam_viec: newValues });
                                }} />
                            </View>
                        }
                        <View style={{ marginBottom: 10 }}>
                            <TouchableOpacity
                                style={{ backgroundColor: '#3366CC', padding: 5, borderRadius: 15, marginTop: 10, borderWidth: 1, borderColor: '#fff' }}
                                onPress={() => {
                                    const newValues = defaultValuesForm.so_dien_thoai_noi_lam_viec.concat({
                                        id: defaultValuesForm.so_dien_thoai_noi_lam_viec.length + 1,
                                        name: "",
                                        phone: "",
                                        relationship: "",
                                    });
                                    setDefaultValues({ ...defaultValuesForm, so_dien_thoai_noi_lam_viec: newValues });
                                }}
                            >
                                <Text style={{ textAlign: 'center', color: '#fff' }}>Thêm người tham chiếu</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginBottom: 30 }}>
                            <TouchableOpacity
                                style={{ backgroundColor: '#3366CC', padding: 5, borderRadius: 15, borderWidth: 1, borderColor: '#fff' }}
                                onPress={handleSubmit(submit)}
                            >
                                <Text style={{ textAlign: 'center', color: '#fff' }}>Tiếp tục</Text>
                            </TouchableOpacity>
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
        borderColor: '#ffffff',
        borderRadius: 15,
        width: '100%',
        marginBottom: 5,
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 5,
        paddingRight: 2,
        color: '#ffffff',
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    // input disabled
    inputDisabled: {
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    dropdownButtonStyle: {
        height: 35,
        backgroundColor: 'rgba(255,255,255,0.4)',
        color: '#ffffff',
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#ffffff',
    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 16,
        color: '#ffffff',
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
