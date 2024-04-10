import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, ImageBackground, Text, Alert, Button, ScrollView, TouchableOpacity } from 'react-native';
import { useForm, Controller } from "react-hook-form";
import Spinner from 'react-native-loading-spinner-overlay';
import { getData, storeData } from '../common';
import SelectDropdown from 'react-native-select-dropdown';
import UserAvatar from 'react-native-user-avatar';
import { useIsFocused } from '@react-navigation/native'

export const RegisterSecreen3 = ({ navigation }: any) => {
    const [loading, setLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const isFocused = useIsFocused()

    const [defaultValuesForm, setDefaultValues] = useState({
        name: "",
        phone: "",
        cccd: "",
        address: "",
        address_now: "",
        birthday: "",
        issue_date: "",
        msbhxh: "",
        nationality: "",
        facebook: "",
        zalo: "",
        religion: "",
        phone_reference: [
            {
                relationship: "",
                name: "",
                phone: "",
            }
        ]
    });
    const [userLogin, setUserLogin] = React.useState<any>(null);
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
        control, handleSubmit, formState: { errors },
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
                phone: result.phone,
                ...result?.user_identifications,
                phone_reference: result?.user_phone_references?.map((item: any) => {  
                    return {
                        relationship: item.relationship,
                        name: item.name,
                        phone: item.phone,
                    }
                }),
            });

            return {
                ...defaultValuesForm,
                phone: result.phone,
                ...result?.user_identifications,
                phone_reference: result?.user_phone_references?.map((item: any) => {  
                    return {
                        relationship: item.relationship,
                        name: item.name,
                        phone: item.phone,
                    }
                }),
            };
        }
    });

    const submit = async (data: any) => {

        setLoading(true);
        console.log(data);

        const userLogin = await getData('userLogin');
        const token = JSON.parse(userLogin ?? '').token;
        fetch('https://tp.tucanhcomputer.vn/api/update-user', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);

                setLoading(false);
                if (responseJson.error) {
                    Alert.alert('Lỗi', responseJson.error);
                    return;
                }

                navigation.navigate('Trang cá nhân');

                // storeData('userLogin', JSON.stringify({
                //     token: token,
                //     ...responseJson,
                // }));
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
                Alert.alert('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại sau');
            });
    };

    return (
        <View>
            <ImageBackground source={require('../assets/logo/logo.jpg')} resizeMode="cover" style={styles.image}>
                {loading && <Spinner visible={loading}
                    textContent={'Đang tải...'}
                    textStyle={{ color: '#fff' }}></Spinner>}
                <View style={{ backgroundColor: '#FFDF00', padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <View style={{ width: 30 }}>
                            <UserAvatar size={30} name={userLogin?.user_identifications?.name} textColor={'#222222'} />
                        </View>
                        <View style={{ alignSelf: 'center' }}>
                            <Text style={{ color: '#222222', fontSize: 14, marginLeft: 10 }}>{userLogin?.user_identifications?.name}</Text>
                        </View>
                    </View>
                </View>

                <ScrollView style={{ padding: 10, borderColor: '#ccc', borderWidth: 1 }}>
                    <Text style={{ color: '#222222', fontSize: 18, marginBottom: 10, fontWeight: '700' }}>{'Thông tin cơ bản'}</Text>
                    <>
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                    <Text style={{ color: '#222222', fontSize: 14, marginBottom: 5, fontWeight: '500' }}>{'Họ và tên'}</Text>
                                    <TextInput
                                        style={errors.name ? [styles.input, { borderColor: 'red' }] : [styles.input]}
                                        value={value}
                                        onChangeText={onChange}
                                        placeholderTextColor="#222222"
                                        editable={true}
                                        returnKeyLabel="next" />
                                </>
                            )}
                            name="name" />

                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                    <Text style={{ color: '#222222', fontSize: 14, marginBottom: 5, fontWeight: '500' }}>{'Số điện thoại'}</Text>
                                    <TextInput
                                        style={errors.phone ? [styles.input, { borderColor: 'red' }] : [styles.input, styles.inputDisabled]}
                                        placeholder="Số điện thoại"
                                        value={value}
                                        onChangeText={onChange}
                                        placeholderTextColor="#222222"
                                        keyboardType='numeric'
                                        editable={true} />
                                </>

                            )}
                            name="phone" />

                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                    <Text style={{ color: '#222222', fontSize: 14, marginBottom: 5, fontWeight: '500' }}>{'Số CCCD/CMND'}</Text>
                                    <TextInput
                                        style={errors.cccd ? [styles.input, { borderColor: 'red' }] : [styles.input, styles.inputDisabled]}
                                        placeholder="Số CCCD"
                                        value={value}
                                        onChangeText={onChange}
                                        placeholderTextColor="#222222"
                                        keyboardType='numeric'
                                        editable={true} />
                                </>

                            )}
                            name="cccd" />

                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                    <Text style={{ color: '#222222', fontSize: 14, marginBottom: 5, fontWeight: '500' }}>{'Địa chỉ thường trú'}</Text>
                                    <TextInput
                                        style={errors.address ? [styles.input, { borderColor: 'red' }] : [styles.input, styles.inputDisabled]}
                                        placeholder="Địa chỉ thường trú"
                                        value={value}
                                        onChangeText={onChange}
                                        placeholderTextColor="#222222"
                                        editable={true} />
                                </>

                            )}
                            name="address" />

                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                    <Text style={{ color: '#222222', fontSize: 14, marginBottom: 5, fontWeight: '500' }}>{'Địa chỉ hiện tại'}</Text>
                                    <TextInput
                                        style={errors.address_now ? [styles.input, { borderColor: 'red' }] : styles.input}
                                        value={value}
                                        onChangeText={onChange}
                                        placeholderTextColor="#222222"
                                        editable={true}
                                        multiline={true}
                                        numberOfLines={2} />
                                </>

                            )}
                            name="address_now"
                            rules={{ required: { value: true, message: "Địa chỉ không được bỏ trống" } }} />

                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                    <Text style={{ color: '#222222', fontSize: 14, marginBottom: 5, fontWeight: '500' }}>{'Ngày sinh'}</Text>
                                    <TextInput
                                        style={errors.birthday ? [styles.input, { borderColor: 'red' }] : [styles.input, styles.inputDisabled]}
                                        placeholder="Ngày sinh"
                                        value={value}
                                        onChangeText={onChange}
                                        placeholderTextColor="#222222"
                                        keyboardType='numeric'
                                        editable={true} />
                                </>

                            )}
                            name="birthday" />

                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                    <Text style={{ color: '#222222', fontSize: 14, marginBottom: 5, fontWeight: '500' }}>{'Ngày cấp'}</Text>
                                    <TextInput
                                        style={errors.issue_date ? [styles.input, { borderColor: 'red' }] : [styles.input, styles.inputDisabled]}
                                        value={value}
                                        onChangeText={onChange}
                                        placeholderTextColor="#222222"
                                        keyboardType='default'
                                        editable={true} />
                                </>

                            )}
                            name="issue_date" />

                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                    <Text style={{ color: '#222222', fontSize: 14, marginBottom: 5, fontWeight: '500' }}>{'Mã số BHXH'}</Text>
                                    <TextInput
                                        style={errors.msbhxh ? [styles.input, { borderColor: 'red' }] : styles.input}
                                        placeholder="Mã số BHXH"
                                        value={value}
                                        onChangeText={onChange}
                                        placeholderTextColor="#222222"
                                        keyboardType='numeric'
                                        editable={true} />
                                </>

                            )}
                            name="msbhxh"
                            rules={{ required: { value: true, message: "Mã số BHXH không được bỏ trống" } }} />

                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                    <Text style={{ color: '#222222', fontSize: 14, marginBottom: 5, fontWeight: '500' }}>{'Facebook'}</Text>
                                    <TextInput
                                        style={errors.facebook ? [styles.input, { borderColor: 'red' }] : styles.input}
                                        placeholder="Facebook"
                                        value={value}
                                        onChangeText={onChange}
                                        placeholderTextColor="#222222"
                                        editable={true} />
                                </>

                            )}
                            name="facebook" />

                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                    <Text style={{ color: '#222222', fontSize: 14, marginBottom: 5, fontWeight: '500' }}>{'Zalo'}</Text>
                                    <TextInput
                                        style={errors.zalo ? [styles.input, { borderColor: 'red' }] : styles.input}
                                        placeholder="Zalo"
                                        value={value}
                                        onChangeText={onChange}
                                        placeholderTextColor="#222222"
                                        editable={true} />
                                </>

                            )}
                            name="zalo" />

                        <View style={{
                            borderBottomColor: '#FFDF00',
                            borderBottomWidth: 2,

                            marginBottom: 10,
                            marginTop: 10
                        }} />

                        <Text style={{ color: '#222222', fontSize: 18, marginBottom: 10, fontWeight: '700' }}>{'Thông tin người thân'}</Text>

                        {defaultValuesForm.phone_reference.map((item: any, index: number) => (
                            <>
                                <View key={index}>
                                    <Text style={{ color: '#222222', fontSize: 14, marginBottom: 5, fontWeight: '500' }}>{'Quan hệ'}</Text>
                                    <Controller
                                        control={control}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <SelectDropdown
                                                data={[{
                                                    title: 'Mẹ',
                                                    value: 'Mẹ'
                                                }, {
                                                    title: 'Bố',
                                                    value: 'Bố'
                                                },
                                                {
                                                    title: 'Anh trai',
                                                    value: 'Anh trai'
                                                },
                                                {
                                                    title: 'Em trai',
                                                    value: 'Em trai'
                                                },
                                                {
                                                    title: 'Chị gái',
                                                    value: 'Chị gái'
                                                },
                                                {
                                                    title: 'Em gái',
                                                    value: 'Em gái'
                                                }
                                                ]}
                                                onSelect={(selectedItem) => {
                                                    // handle selected item
                                                    onChange(selectedItem.value);

                                                }}
                                                defaultValueByIndex={
                                                    value === 'Mẹ' ? 0 :
                                                    value === 'Bố' ? 1 :
                                                    value === 'Anh trai' ? 2 :
                                                    value === 'Em trai' ? 3 :
                                                    value === 'Chị gái' ? 4 :
                                                    value === 'Em gái' ? 5 : 0
                                                }
                                                renderButton={(selectedItem, isOpened) => {
                                                    return (
                                                        <View style={styles.dropdownButtonStyle}>

                                                            <Text style={styles.dropdownButtonTxtStyle}>
                                                                {(selectedItem && selectedItem.title) || 'Chọn mối quan hệ'}
                                                            </Text>
                                                        </View>
                                                    );
                                                }}
                                                renderItem={(item, index, isSelected) => {
                                                    return (
                                                        <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                                                            <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                                                        </View>
                                                    );
                                                }} />
                                        )}
                                        name={`phone_reference.${index}.relationship`}
                                        rules={{ required: { value: true, message: "Quan hệ không được bỏ trống" } }} />
                                    {errors.phone_reference?.[index]?.relationship && <Text style={{ color: 'red' }}>{errors.phone_reference[index]?.relationship?.message}</Text>}

                                    <Text style={{ color: '#222222', fontSize: 14, marginBottom: 5, fontWeight: '500' }}>{'Họ và tên'}</Text>

                                    <Controller
                                        control={control}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <TextInput
                                                style={errors.phone_reference?.[index]?.name ? [styles.input, { borderColor: 'red' }] : styles.input}
                                                placeholder="Họ và tên"
                                                value={value as string} // Cast value to string
                                                onChangeText={onChange}
                                                placeholderTextColor="#222222"
                                                defaultValue={item.name}
                                                editable={true} />
                                        )}
                                        name={`phone_reference.${index}.name`}
                                        rules={{ required: { value: true, message: "Họ và tên không được bỏ trống" } }} />
                                    {errors.phone_reference?.[index]?.name && <Text style={{ color: 'red' }}>{errors.phone_reference[index].name?.message}</Text>}
                                    <Text style={{ color: '#222222', fontSize: 14, marginBottom: 5, fontWeight: '500' }}>{'Số điện thoại'}</Text>
                                    <Controller
                                        control={control}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <TextInput
                                                style={errors.phone_reference?.[index]?.phone ? [styles.input, { borderColor: 'red' }] : styles.input}
                                                placeholder="Số điện thoại"
                                                value={value as string}
                                                onChangeText={onChange}
                                                placeholderTextColor="#222222"
                                                keyboardType='numeric'
                                                defaultValue={item.phone}
                                                editable={true} />
                                        )}
                                        name={`phone_reference.${index}.phone`}
                                        rules={{
                                            required: { value: true, message: "Số điện thoại không được bỏ trống" },
                                            pattern: { value: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ" }
                                        }} />
                                    {errors.phone_reference?.[index]?.phone && <Text style={{ color: 'red' }}>{errors.phone_reference[index].phone?.message}</Text>}
                                </View>
                                <View style={{
                                    borderBottomColor: '#FFDF00',
                                    borderBottomWidth: 2,
                                    marginBottom: 10,
                                    marginTop: 10
                                }} />

                            </>
                        ))}
                        {/* xóa người thân */}
                        {defaultValuesForm.phone_reference.length > 1 &&
                            <View style={{ marginBottom: 30 }}>
                                <Button title="Xóa người thân" onPress={() => {
                                    // get data from local storage
                                    const getDataFromStorage = async () => {
                                        const data = await getData('user');
                                        if (data) {
                                            const newData = {
                                                ...defaultValuesForm,
                                                ...JSON.parse(data),
                                            };
                                            newData.phone_reference.pop();
                                            setDefaultValues({
                                                ...defaultValuesForm,
                                                ...newData
                                            });
                                            storeData('user', JSON.stringify(newData));
                                        }
                                    };
                                    getDataFromStorage();
                                }} />
                            </View>}
                        <View style={{ marginBottom: 10 }}>
                            <TouchableOpacity
                                style={{ backgroundColor: '#FFDF00', padding: 5, borderRadius: 15, marginTop: 10, borderWidth: 1, borderColor: '#fff' }}
                                onPress={() => {
                                    // get data from local storage
                                    const getDataFromStorage = async () => {
                                        const data = await getData('user');
                                        if (data) {
                                            const newData = {
                                                ...defaultValuesForm,
                                                ...JSON.parse(data),
                                            };
                                            newData.phone_reference.push({
                                                name: "",
                                                phone: "",
                                            });
                                            setDefaultValues({
                                                ...defaultValuesForm,
                                                ...newData
                                            });
                                            storeData('user', JSON.stringify(newData));
                                        }
                                    };
                                    getDataFromStorage();
                                }}>
                                <Text style={{ textAlign: 'center', color: '#222' }}>Thêm người thân</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginBottom: 30 }}>
                        <TouchableOpacity
                                style={{ backgroundColor: '#FFDF00', padding: 5, borderRadius: 15, marginTop: 5, borderWidth: 1, borderColor: '#fff' }}
                                onPress={handleSubmit(submit)}
                            >
                                <Text style={{ textAlign: 'center', color: '#222' }}>Tiếp tục</Text>
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
        borderColor: '#FFDF00',
        borderRadius: 15,
        width: '100%',
        marginBottom: 10,
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 10,
        paddingRight: 2,
        color: '#222222',
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    // input disabled
    inputDisabled: {
        // backgroundColor: 'rgba(255,255,255,0.4)',
    },
    dropdownButtonStyle: {
        height: 35,
        backgroundColor: 'rgba(255,255,255,0.4)',
        color: '#222222',
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#FFDF00',
    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 16,
        color: '#222222',
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