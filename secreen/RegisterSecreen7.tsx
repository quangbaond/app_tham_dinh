import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, ImageBackground, Text, Button, ScrollView, Alert } from 'react-native';
import { useForm, Controller, set } from "react-hook-form";
import Spinner from 'react-native-loading-spinner-overlay';
import { getData, storeData } from '../common';
import SelectDropdown, { SelectDropdownProps } from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Table, Row, Rows } from 'react-native-table-component'

export const RegisterSecreen7 = ({ navigation }: any) => {
    const [loading, setLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [userLogin, setUserLogin] = useState<any>(null);

    const [iamges, setImages] = useState([] as any);
    const [period, setPeriod] = useState([] as any);

    const [defaultValuesForm, setDefaultValues] = useState({
        so_tien_vay: "",
        thoi_han_vay: "",
    });

    const tableHead = ['Thời hạn', 'Số tiền', 'Trạng thái', 'Thời gian'];
    const [tableData, setTableData] = useState([] as any);
    const tableHeadMonth = ['Thời gian', 'Số tiền'];

    const [tableDataMonth, setTableDataMonth] = useState([]);
    const [money, setMoney] = useState(0);

    const {
        control, handleSubmit, formState: { errors },
    } = useForm({
        defaultValues: defaultValuesForm,
    });

    useEffect(() => {
        const getUserData = async () => {
            const userLogin = await getData('userLogin');
            const token = JSON.parse(userLogin as unknown as string).token;

            fetch('https://tp.tucanhcomputer.vn/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }).then((response) => response.json()).then((data) => {
                setUserLogin(data);
            }).catch((error) => {
                console.log('error', error);
                Alert.alert('Lỗi', 'Đã có lỗi xảy ra');
            });
        }
        const getPerod = async () => {
            setLoading(true);

            fetch('https://tp.tucanhcomputer.vn/api/get-period', {
                method: 'GET',
            })
                .then((response) => response.json())
                .then((data) => {
                    setPeriod(data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.log('error', error);
                    setLoading(false);
                });
        }
        getUserData()
        getPerod();
    }, []);

    useEffect(() => {
        if (userLogin) {
            setTableData(
                userLogin?.user_loan_amounts.map((item: any) => {
                    item.khoan_vay = item.khoan_vay.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    return [item.thoi_han_vay, item.khoan_vay, item.status === 0 ? 'Đang đuyệt' : ( item.status === 1 ? 'Đã duyệt' : 'Từ chối') , item.created_at];
                })
            );
        }
    }, [userLogin]);



    const submit = async (data: any) => {
        setLoading(true);
        const userLogin = await getData('userLogin');
        const token = JSON.parse(userLogin as unknown as string).token;
        const formData = new FormData();
        formData.append('khoan_vay', data.so_tien_vay.replace(/,/g, ''));
        formData.append('thoi_han_vay', data.thoi_han_vay);

        fetch('https://tp.tucanhcomputer.vn/api/create-loan-amount', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })

            .then((response) => {
                return response.json();
            
            })
            .then((data) => {
                if(data.message) {
                    Alert.alert('Thành công', data.message);
                    navigation.navigate('Trang cá nhân');
                }
            })
            .catch((error) => {
                if (error) {
                    console.log('error', error);
                    Alert.alert('Lỗi', 'Đã có lỗi xảy ra');
                }
            })
            .finally(() => {
                setLoading(false);
            });
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
                                            setMoney(parseInt(currency.replace(/,/g, '')));
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
                                        data={period}
                                        onSelect={(selectedItem) => {
                                            onChange(selectedItem.title);
                                            
                                            const laixuat = parseFloat(selectedItem.value) / 12;
                                            
                                            let goc = money;
                                            const thoihan = parseInt(selectedItem.title.split(' ')[0]);
                                            const lichtra = [];
                                            let goc_con_lai = goc;
                                            let goc_moi_ky = goc / thoihan;                                            
                                            let lai = 0;
                                            let tong_goc_lai = 0;

                                            for (let i = 0; i <= thoihan; i++) {
                                                console.log('laixuat', laixuat);
                                                lai = goc_con_lai * laixuat / 100;
                                                tong_goc_lai = goc_moi_ky + lai;
                                                console.log('goc_con_lai', goc_con_lai);
                                                console.log('goc_moi_ky', goc_moi_ky);
                                                console.log('tong_goc_lai', tong_goc_lai.toFixed(0));
                                                console.log('lai', lai);
                                                goc_con_lai = goc_con_lai - goc_moi_ky;
                                                const date = new Date();
                                                date.setMonth(date.getMonth() + i);

                                                lichtra.push([date.toLocaleDateString(), tong_goc_lai.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")]);
                                            }
                                            setTableDataMonth(lichtra);
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

                        {
                            tableDataMonth.length > 0 &&
                            <>
                                <Text style={{ color: '#fff', fontSize: 20, marginBottom: 20, marginTop: 20 }}>{'Lịch trả nợ'}</Text>
                                <View>
                                    <Table borderStyle={{ borderWidth: 1, borderColor: '#c8e1ff' }}>
                                        <Row data={tableHeadMonth} style={styles.head} textStyle={styles.text} />
                                        <Rows data={tableDataMonth} textStyle={styles.text} />
                                    </Table>
                                </View>
                            </>

                        }

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

    head: { height: 40, backgroundColor: 'blue', textAlign: 'center' },
    text: { margin: 6, color: '#fff', fontSize: 12, textAlign: 'center' }
});
