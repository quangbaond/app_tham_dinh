// LoginScreen.js
import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, ImageBackground, Text, Alert, Button, PermissionsAndroid, Image, ScrollView, Platform } from 'react-native';
import { useForm, Controller } from "react-hook-form"
import * as ImagePicker from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import { getData, mergeData, storeData } from '../common';
import SelectDropdown from 'react-native-select-dropdown'

const RegisterSecreen3 = ({ navigation }: any) => {
    const [loading, setLoading] = useState(false);

    const [defaultValuesForm, setDefaultValues] = useState({
        name: "",
        phone_number: "",
        cccd: "",
        address: "",
        address_now: "",
        date_of_birth: "",
        date_of_issue: "",
        msbhxh: "",
        licence: "",
        facebook: "",
        zalo: "",
        phone_number_reference: [
            {
                id: 1,
                name: "",
                phone: "",
                relationship: "",
            }
        ],
    });

    useEffect(() => {
        // get data from local storage
        const getDataFromStorage = async () => {
            const data = await getData('userInfo');
            // console.log(data);

            if (data) {
                const dataUser = JSON.parse(data)[0];
                console.log(dataUser);
                setDefaultValues({
                    ...defaultValuesForm,
                    ...{
                        name: dataUser.name,
                        phone_number: dataUser.phone_number,
                        cccd: dataUser.id,
                        address: dataUser.address,
                        address_now: dataUser.address_now,
                        date_of_birth: dataUser.dob,
                        date_of_issue: dataUser.date_of_issue,
                    },
                });
            }
        }
        getDataFromStorage();
    }, []);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({})


    return (
        <View>
            <ImageBackground source={require('../assets/logo/logo.jpg')} resizeMode="cover" style={styles.image}>
                {loading && <Spinner visible={loading}
                    textContent={'Đang tải...'}
                    textStyle={{ color: '#FFF' }}></Spinner>}

                <ScrollView style={{ padding: 20 }}>
                    <Text style={{ color: '#fff', fontSize: 25, marginBottom: 20 }}>{'Thông tin cơ bản'}</Text>
                    {defaultValuesForm && (
                        <>
                            <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <>
                                        <Text style={{ color: '#fff', fontSize: 14, marginBottom: 10 }}>{'Họ và tên'}</Text>
                                        <TextInput
                                            style={errors.name ? [styles.input, { borderColor: 'red' }] : styles.input}
                                            placeholder="Họ và tên"
                                            value={value}
                                            onChangeText={onChange}
                                            placeholderTextColor="#fff"
                                            defaultValue={defaultValuesForm.name}
                                            editable={false}
                                            returnKeyLabel="Họ và tên"
                                        />
                                    </>

                                )}
                                name="name"
                                rules={{ required: { value: true, message: "Họ và tên không được bỏ trống" } }}
                            />

                            <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <>
                                        <Text style={{ color: '#fff', fontSize: 14, marginBottom: 10 }}>{'Số điện thoại'}</Text>
                                        <TextInput
                                            style={errors.phone_number ? [styles.input, { borderColor: 'red' }] : styles.input}
                                            placeholder="Số điện thoại"
                                            value={value}
                                            onChangeText={onChange}
                                            placeholderTextColor="#fff"
                                            keyboardType='numeric'
                                            defaultValue={defaultValuesForm.phone_number}
                                            editable={false}
                                        />
                                    </>

                                )}
                                name="phone_number"
                                rules={{
                                    required: { value: true, message: "Số điện thoại không được bỏ trống" },
                                    pattern: { value: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ" }
                                }}
                            />

                            <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <>
                                        <Text style={{ color: '#fff', fontSize: 14, marginBottom: 10 }}>{'Số CCCD/CMND'}</Text>
                                        <TextInput
                                            style={errors.cccd ? [styles.input, { borderColor: 'red' }] : styles.input}
                                            placeholder="Số CCCD"
                                            value={value}
                                            onChangeText={onChange}
                                            placeholderTextColor="#fff"
                                            keyboardType='numeric'
                                            defaultValue={defaultValuesForm.cccd}
                                            editable={false}
                                        />
                                    </>

                                )}
                                name="cccd"
                                rules={{ required: { value: true, message: "Số CCCD không được bỏ trống" } }}
                            />

                            <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <>
                                        <Text style={{ color: '#fff', fontSize: 14, marginBottom: 10 }}>{'Địa chỉ thường trú'}</Text>
                                        <TextInput
                                            style={errors.address ? [styles.input, { borderColor: 'red' }] : styles.input}
                                            placeholder="Địa chỉ thường trú"
                                            value={value}
                                            onChangeText={onChange}
                                            placeholderTextColor="#fff"
                                            defaultValue={defaultValuesForm.address}
                                            editable={false}
                                        />
                                    </>

                                )}
                                name="address"
                                rules={{ required: { value: true, message: "Địa chỉ không được bỏ trống" } }}
                            />

                            <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <>
                                        <Text style={{ color: '#fff', fontSize: 14, marginBottom: 10 }}>{'Địa chỉ hiện tại'}</Text>
                                        <TextInput
                                            style={errors.address_now ? [styles.input, { borderColor: 'red' }] : styles.input}
                                            placeholder="Địa chỉ hiện tại"
                                            value={value}
                                            onChangeText={onChange}
                                            placeholderTextColor="#fff"
                                            defaultValue={defaultValuesForm.address_now}
                                            editable={true}
                                            multiline={true}
                                            numberOfLines={4}
                                        />
                                    </>

                                )}
                                name="address_now"
                                rules={{ required: { value: true, message: "Địa chỉ không được bỏ trống" } }}
                            />

                            <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <>
                                        <Text style={{ color: '#fff', fontSize: 14, marginBottom: 10 }}>{'Ngày sinh'}</Text>
                                        <TextInput
                                            style={errors.date_of_birth ? [styles.input, { borderColor: 'red' }] : styles.input}
                                            placeholder="Ngày sinh"
                                            value={value}
                                            onChangeText={onChange}
                                            placeholderTextColor="#fff"
                                            keyboardType='numeric'
                                            defaultValue={defaultValuesForm.date_of_birth}
                                            editable={false}
                                        />
                                    </>

                                )}
                                name="date_of_birth"
                                rules={{ required: { value: true, message: "Ngày sinh không được bỏ trống" } }}
                            />

                            <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <>
                                        <Text style={{ color: '#fff', fontSize: 14, marginBottom: 10 }}>{'Ngày cấp'}</Text>
                                        <TextInput
                                            style={errors.date_of_issue ? [styles.input, { borderColor: 'red' }] : styles.input}
                                            placeholder="Ngày cấp"
                                            value={value}
                                            onChangeText={onChange}
                                            placeholderTextColor="#fff"
                                            keyboardType='numeric'
                                            defaultValue={defaultValuesForm.date_of_issue}
                                            editable={false}
                                        />
                                    </>

                                )}
                                name="date_of_issue"
                                rules={{ required: { value: true, message: "Ngày cấp không được bỏ trống" } }}
                            />

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
                                            defaultValue={defaultValuesForm.msbhxh}
                                            editable={false}
                                        />
                                    </>

                                )}
                                name="msbhxh"
                                rules={{ required: { value: true, message: "Mã số BHXH không được bỏ trống" } }}
                            />

                            <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <>
                                        <Text style={{ color: '#fff', fontSize: 14, marginBottom: 10 }}>{'Số Giấy phép lái xe'}</Text>
                                        <TextInput
                                            style={errors.licence ? [styles.input, { borderColor: 'red' }] : styles.input}
                                            placeholder="Số Giấy phép lái xe"
                                            value={value}
                                            onChangeText={onChange}
                                            placeholderTextColor="#fff"
                                            keyboardType='numeric'
                                            defaultValue={defaultValuesForm.licence}
                                            editable={false}
                                        />
                                    </>

                                )}
                                name="licence"
                                rules={{ required: { value: true, message: "Số giấy phép lái xe không được bỏ trống" } }}
                            />

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
                                            defaultValue={defaultValuesForm.facebook}
                                            editable={true}
                                        />
                                    </>

                                )}
                                name="facebook"
                                rules={{ required: { value: true, message: "Facebook không được bỏ trống" } }}
                            />

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
                                            defaultValue={defaultValuesForm.zalo}
                                            editable={true}
                                        />
                                    </>

                                )}
                                name="zalo"
                                rules={{ required: { value: true, message: "Zalo không được bỏ trống" } }}
                            />

                            <Text style={{ color: '#fff', fontSize: 25, marginBottom: 20 }}>{'Thông tin người thân'}</Text>

                            {defaultValuesForm.phone_number_reference.map((item: any, index: number) => (
                                <>
                                    <View key={item}>
                                        {/* // select option "bố mẹ", "anh chị", "em trai", "em gái" */}
                                        <Controller
                                            control={control}
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <TextInput
                                                    style={errors.phone_number_reference ? [styles.input, { borderColor: 'red' }] : styles.input}
                                                    placeholder="Quan hệ"
                                                    value={value as string} // Cast value to string
                                                    onChangeText={onChange}
                                                    placeholderTextColor="#fff"
                                                    defaultValue={item.relationship}
                                                    editable={true}
                                                    keyboardType='default'
                                                />
                                            )}
                                            name={`phone_number_reference.${index}.relationship`}
                                            rules={{ required: { value: true, message: "Quan hệ không được bỏ trống" } }}
                                        />
                                        <Controller
                                            control={control}
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <TextInput
                                                    key={item.id}
                                                    style={errors.phone_number_reference ? [styles.input, { borderColor: 'red' }] : styles.input}
                                                    placeholder="Họ và tên"
                                                    value={value as string} // Cast value to string
                                                    onChangeText={onChange}
                                                    placeholderTextColor="#fff"
                                                    defaultValue={item.name}
                                                    editable={false}
                                                />
                                            )}
                                            name={`phone_number_reference.${index}.name`}
                                            rules={{ required: { value: true, message: "Họ và tên không được bỏ trống" } }}
                                        />
                                        <Controller
                                            control={control}
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <TextInput
                                                    style={errors.phone_number_reference ? [styles.input, { borderColor: 'red' }] : styles.input}
                                                    placeholder="Số điện thoại"
                                                    value={value as string}
                                                    onChangeText={onChange}
                                                    placeholderTextColor="#fff"
                                                    keyboardType='numeric'
                                                    defaultValue={item.phone}
                                                    editable={false}
                                                />
                                            )}
                                            name={`phone_number_reference.${index}.phone`}
                                            rules={{
                                                required: { value: true, message: "Số điện thoại không được bỏ trống" },
                                                pattern: { value: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ" }
                                            }}
                                        />
                                    </View>
                                    <View style={{
                                        borderBottomColor: 'black',
                                        borderBottomWidth: StyleSheet.hairlineWidth,
                                    }} />

                                </>
                            ))}
                            <View style={{ marginBottom: 30 }}>
                                <Button title="Thêm người thân" onPress={() => {
                                    // get data from local storage
                                    const getDataFromStorage = async () => {
                                        const data = await getData('user');
                                        if (data) {
                                            const newData = {
                                                ...defaultValuesForm,
                                                ...JSON.parse(data),
                                            };
                                            newData.phone_number_reference.push({

                                                name: "",
                                                phone: "",
                                            });
                                            setDefaultValues({
                                                ...defaultValuesForm,
                                                ...newData
                                            });
                                            storeData('user', JSON.stringify(newData));
                                        }
                                    }
                                    getDataFromStorage();
                                }} />
                            </View>
                        </>
                    )}

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
        width: '100%',
        marginBottom: 20,
        padding: 10,
        color: '#fff',
        backgroundColor: 'rgba(255,255,255,0.2)',
    }


});
export default RegisterSecreen3;
