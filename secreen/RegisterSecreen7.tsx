import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ImageBackground, Text, Button, ScrollView } from 'react-native';
import { useForm, Controller } from "react-hook-form";
import Spinner from 'react-native-loading-spinner-overlay';
import { storeData } from '../common';
import SelectDropdown, { SelectDropdownProps } from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Table, Row, Rows } from 'react-native-table-component'

export const RegisterSecreen7 = ({ navigation }: any) => {
    const [loading, setLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');

    const [iamges, setImages] = useState([] as any);

    const [defaultValuesForm, setDefaultValues] = useState({
        so_tien_vay: "",
        thoi_han_vay: "",
    });

    const tableHead = ['Thời gian', 'Số tiền vay', 'Trạng thái'];
    const tableData = [
        ['3 tháng', '15,000,000', 'Đã hoàn thành'],
        ['6 tháng', '20,000,000', 'Đã hoàn thành'],
        ['12 tháng', '25,000,000', 'Đã hoàn thành']
    ];

    const {
        control, handleSubmit, formState: { errors },
    } = useForm({
        defaultValues: defaultValuesForm
    });

    const submit = async (data: any) => {
        await storeData('taisan', JSON.stringify(data));
        navigation.navigate('Khoản vay');
    };



    const renderItem = (item: any, index: number, isSelected: boolean) => {
        // render dropdown item
        return null; // Replace null with your dropdown item component
    };

    return (
        <View>
            <ImageBackground source={require('../assets/logo/logo.jpg')} resizeMode="cover" style={styles.image}>
                {loading && <Spinner visible={loading}
                    textContent={'Đang tải...'}
                    textStyle={{ color: '#FFF' }}></Spinner>}

                <ScrollView style={{ padding: 20, borderColor: '#ccc', borderWidth: 1 }}>
                    <Text style={{ color: '#fff', fontSize: 20, marginBottom: 20 }}>{'Thông tin khoản vay'}</Text>
                    <>

                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                    <Text style={{ color: '#fff', fontSize: 14, marginBottom: 10 }}>{'Bạn muốn vay bao nhiêu?'}</Text>
                                    <TextInput
                                        style={errors.so_tien_vay ? [styles.input, { borderColor: 'red' }] : [styles.input]}
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
                                        returnKeyLabel="Done" />
                                </>
                            )}
                            name="so_tien_vay" />

                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                    <Text style={{ color: '#fff', fontSize: 14, marginBottom: 10, marginTop: 10 }}>{'Thời hạn vay'}</Text>
                                    {/* // select dropdown */}
                                    <SelectDropdown
                                        data={[{
                                            title: '3 tháng',
                                            value: 3
                                        }, {
                                            title: '6 tháng',
                                            value: 6
                                        }, {
                                            title: '12 tháng',
                                            value: 12
                                        }]}
                                        onSelect={(selectedItem) => {
                                            // handle selected item
                                            console.log(selectedItem);

                                        }}
                                        renderButton={(selectedItem, isOpened) => {
                                            return (
                                                <View style={styles.dropdownButtonStyle}>
                                                    {selectedItem && (
                                                        <Icon name={selectedItem.icon} style={styles.dropdownButtonIconStyle} />
                                                    )}
                                                    <Text style={styles.dropdownButtonTxtStyle}>
                                                        {(selectedItem && selectedItem.title) || 'Chọn thời hạn vay'}
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

                                </>

                            )}
                            name="thoi_han_vay" />

                        <View style={{
                            borderBottomColor: 'white',
                            borderBottomWidth: StyleSheet.hairlineWidth,
                            marginBottom: 20,
                            marginTop: 20
                        }} />

                        <Text style={{ color: '#fff', fontSize: 20, marginBottom: 20 }}>{'Lịch sử vay'}</Text>

                        <View>
                            <Table borderStyle={{ borderWidth: 1, borderColor: '#c8e1ff' }}>
                                <Row data={tableHead} style={styles.head} textStyle={styles.text} />
                                <Rows data={tableData} textStyle={styles.text} />
                            </Table>
                        </View>


                        <View style={{ marginBottom: 30, marginTop: 30 }}>
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

    head: { height: 40, backgroundColor: 'blue', textAlign: 'center'},
    text: { margin: 6, color: '#fff'}
});
