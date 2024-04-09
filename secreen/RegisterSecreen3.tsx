import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ImageBackground, Text, Alert, Button, ScrollView } from 'react-native';
import { useForm, Controller } from "react-hook-form";
import Spinner from 'react-native-loading-spinner-overlay';
import { getData, storeData } from '../common';
import SelectDropdown from 'react-native-select-dropdown';

export const RegisterSecreen3 = ({ navigation }: any) => {
    const [loading, setLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');

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

            return {
                ...defaultValuesForm,
                phone: result.phone,
                ...result?.userIdentifications,
                phone_reference: result?.userPhoneReferences,
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
                if(responseJson.error) {
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
                    textStyle={{ color: '#FFF' }}></Spinner>}

                <ScrollView style={{ padding: 20, borderColor: '#ccc', borderWidth: 1 }}>
                    <Text style={{ color: '#fff', fontSize: 20, marginBottom: 20 }}>{'Thông tin cơ bản'}</Text>
                    <>
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                    <Text style={{ color: '#fff', fontSize: 14, marginBottom: 10 }}>{'Họ và tên'}</Text>
                                    <TextInput
                                        style={errors.name ? [styles.input, { borderColor: 'red' }] : [styles.input, styles.inputDisabled]}
                                        value={value}
                                        onChangeText={onChange}
                                        placeholderTextColor="#fff"
                                        editable={true}
                                        returnKeyLabel="next" />
                                </>
                            )}
                            name="name" />

                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                    <Text style={{ color: '#fff', fontSize: 14, marginBottom: 10 }}>{'Số điện thoại'}</Text>
                                    <TextInput
                                        style={errors.phone ? [styles.input, { borderColor: 'red' }] : [styles.input, styles.inputDisabled]}
                                        placeholder="Số điện thoại"
                                        value={value}
                                        onChangeText={onChange}
                                        placeholderTextColor="#fff"
                                        keyboardType='numeric'
                                        editable={true} />
                                </>

                            )}
                            name="phone" />

                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                    <Text style={{ color: '#fff', fontSize: 14, marginBottom: 10 }}>{'Số CCCD/CMND'}</Text>
                                    <TextInput
                                        style={errors.cccd ? [styles.input, { borderColor: 'red' }] : [styles.input, styles.inputDisabled]}
                                        placeholder="Số CCCD"
                                        value={value}
                                        onChangeText={onChange}
                                        placeholderTextColor="#fff"
                                        keyboardType='numeric'
                                        editable={true} />
                                </>

                            )}
                            name="cccd" />

                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                    <Text style={{ color: '#fff', fontSize: 14, marginBottom: 10 }}>{'Địa chỉ thường trú'}</Text>
                                    <TextInput
                                        style={errors.address ? [styles.input, { borderColor: 'red' }] : [styles.input, styles.inputDisabled]}
                                        placeholder="Địa chỉ thường trú"
                                        value={value}
                                        onChangeText={onChange}
                                        placeholderTextColor="#fff"
                                        editable={true} />
                                </>

                            )}
                            name="address" />

                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                    <Text style={{ color: '#fff', fontSize: 14, marginBottom: 10 }}>{'Địa chỉ hiện tại'}</Text>
                                    <TextInput
                                        style={errors.address_now ? [styles.input, { borderColor: 'red' }] : styles.input}
                                        value={value}
                                        onChangeText={onChange}
                                        placeholderTextColor="#fff"
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
                                    <Text style={{ color: '#fff', fontSize: 14, marginBottom: 10 }}>{'Ngày sinh'}</Text>
                                    <TextInput
                                        style={errors.birthday ? [styles.input, { borderColor: 'red' }] : [styles.input, styles.inputDisabled]}
                                        placeholder="Ngày sinh"
                                        value={value}
                                        onChangeText={onChange}
                                        placeholderTextColor="#fff"
                                        keyboardType='numeric'
                                        editable={true} />
                                </>

                            )}
                            name="birthday" />

                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                    <Text style={{ color: '#fff', fontSize: 14, marginBottom: 10 }}>{'Ngày cấp'}</Text>
                                    <TextInput
                                        style={errors.issue_date ? [styles.input, { borderColor: 'red' }] : [styles.input, styles.inputDisabled]}
                                        value={value}
                                        onChangeText={onChange}
                                        placeholderTextColor="#fff"
                                        keyboardType='default'
                                        editable={true} />
                                </>

                            )}
                            name="issue_date" />

                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                    <Text style={{ color: '#fff', fontSize: 14, marginBottom: 10 }}>{'Mã số BHXH'}</Text>
                                    <TextInput
                                        style={errors.msbhxh ? [styles.input, { borderColor: 'red' }] : styles.input}
                                        placeholder="Mã số BHXH"
                                        value={value}
                                        onChangeText={onChange}
                                        placeholderTextColor="#fff"
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
                                    <Text style={{ color: '#fff', fontSize: 14, marginBottom: 10 }}>{'Facebook'}</Text>
                                    <TextInput
                                        style={errors.facebook ? [styles.input, { borderColor: 'red' }] : styles.input}
                                        placeholder="Facebook"
                                        value={value}
                                        onChangeText={onChange}
                                        placeholderTextColor="#fff"
                                        editable={true} />
                                </>

                            )}
                            name="facebook" />

                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                    <Text style={{ color: '#fff', fontSize: 14, marginBottom: 10 }}>{'Zalo'}</Text>
                                    <TextInput
                                        style={errors.zalo ? [styles.input, { borderColor: 'red' }] : styles.input}
                                        placeholder="Zalo"
                                        value={value}
                                        onChangeText={onChange}
                                        placeholderTextColor="#fff"
                                        editable={true} />
                                </>

                            )}
                            name="zalo" />

                        <View style={{
                            borderBottomColor: 'white',
                            borderBottomWidth: StyleSheet.hairlineWidth,
                            marginBottom: 20,
                            marginTop: 20
                        }} />

                        <Text style={{ color: '#fff', fontSize: 20, marginBottom: 20 }}>{'Thông tin người thân'}</Text>

                        {defaultValuesForm.phone_reference.map((item: any, index: number) => (
                            <>
                                <View key={index}>
                                    <Text style={{ color: '#fff', fontSize: 14, marginBottom: 10 }}>{'Quan hệ'}</Text>
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

                                    <Text style={{ color: '#fff', fontSize: 14, marginBottom: 10 }}>{'Họ và tên'}</Text>

                                    <Controller
                                        control={control}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <TextInput
                                                style={errors.phone_reference?.[index]?.name ? [styles.input, { borderColor: 'red' }] : styles.input}
                                                placeholder="Họ và tên"
                                                value={value as string} // Cast value to string
                                                onChangeText={onChange}
                                                placeholderTextColor="#fff"
                                                defaultValue={item.name}
                                                editable={true} />
                                        )}
                                        name={`phone_reference.${index}.name`}
                                        rules={{ required: { value: true, message: "Họ và tên không được bỏ trống" } }} />
                                    {errors.phone_reference?.[index]?.name && <Text style={{ color: 'red' }}>{errors.phone_reference[index].name?.message}</Text>}
                                    <Text style={{ color: '#fff', fontSize: 14, marginBottom: 10 }}>{'Số điện thoại'}</Text>
                                    <Controller
                                        control={control}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <TextInput
                                                style={errors.phone_reference?.[index]?.phone ? [styles.input, { borderColor: 'red' }] : styles.input}
                                                placeholder="Số điện thoại"
                                                value={value as string}
                                                onChangeText={onChange}
                                                placeholderTextColor="#fff"
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
                                    borderBottomColor: 'white',
                                    borderBottomWidth: StyleSheet.hairlineWidth,
                                    marginBottom: 20,
                                    marginTop: 20
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
                            <Button title="Thêm người thân" onPress={() => {
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