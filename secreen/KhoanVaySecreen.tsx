import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, ImageBackground, Text, Button, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useForm, Controller, set } from "react-hook-form";
import Spinner from 'react-native-loading-spinner-overlay';
import { getData, storeData } from '../common';
import SelectDropdown, { SelectDropdownProps } from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/AntDesign';
import { Table, Row, Rows } from 'react-native-table-component'
import { Dimensions } from 'react-native';
import moment from 'moment';
import UserAvatar from 'react-native-user-avatar';

export const KhoanVaySecreen = ({navigation }: any) => {
    const screenWidth = Dimensions.get('window').width;

    const [loading, setLoading] = useState(false);

    const [userLogin, setUserLogin] = useState<any>(null);

    const [period, setPeriod] = useState([] as any);

    const [defaultValuesForm, setDefaultValues] = useState({
        so_tien_vay: "",
        thoi_han_vay: "",
    });

    const tableHead = ['Mã số','Thời hạn', 'Số tiền','Thời gian', 'Trạng thái' ];
    const [tableData, setTableData] = useState([] as any);
    const tableHeadMonth = ['Thời gian', 'Số tiền', 'Đã trả'];

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
            }).then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    if (response.status === 401) {
                        Alert.alert('Thông báo', 'Vui lòng đăng nhập để tiếp tục');
                        navigation.navigate('Đăng nhập');
                        return null;
                    }
                    console.log('response', response);

                }
            }).then((data) => {
                console.log('data', data.user_history_loan_amounts);
                setTableDataMonth(data.user_history_loan_amounts.map((item: any) => {
                    item.ngay_tra = moment(item.ngay_tra).format('DD/MM/YYYY');
                    item.tong_goc_lai = item.tong_goc_lai.toString();
                    item.tong_goc_lai = item.tong_goc_lai.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    item.so_tien_tra = item.so_tien_tra.toString();
                    item.so_tien_tra = item.so_tien_tra.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    return [item.ngay_tra, item.tong_goc_lai, item.so_tien_tra];
                }));
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
                    // item.khoan_vay = item.khoan_vay.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    return [item.id, item.thoi_han_vay, item.khoan_vay,  moment(item.created_at).format('DD/MM/YYYY'), item.status === 0 ? 'Đang đuyệt' : (item.status === 1 ? 'Đã duyệt' : 'Từ chối')];
                })
            );
        }
    }, [userLogin]);



    const submit = async (data: any) => {
        // setLoading(true);
        const userLogin = await getData('userLogin');
        const token = JSON.parse(userLogin as unknown as string).token;
        const formData = new FormData();
        formData.append('khoan_vay', data.so_tien_vay.replace(/,/g, ''));
        formData.append('thoi_han_vay', data.thoi_han_vay);
        console.log('data', data);


        fetch('https://tp.tucanhcomputer.vn/api/create-loan-amount', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })

            .then((response) => {
                console.log('response', response);

                return response.json();


            })
            .then((data) => {
                console.log(data.status);

                if (data.message) {

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
                                <UserAvatar size={30} name={userLogin?.user_identifications.name} textColor={'#ffffff'} />
                        </View>

                        <View style={{ alignSelf: 'center' }}>
                            <Text style={{ color: '#ffffff', fontSize: 14, marginLeft: 10 }}>{userLogin?.user_identifications.name}</Text>
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
                    {/* <Text style={{ color: '#ffffff', fontSize: 20, marginBottom: 5 }}>{'Thông tin khoản vay'}</Text> */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>
                        <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '500' }}>{'Khoản vay'}</Text>
                        {/* <Button title="Thêm" onPress={() => navigation.navigate('Đăng ký vay')} /> */}
                        <TouchableOpacity 
                            style={{ backgroundColor: '#3366CC', padding: 13, borderRadius: 15, borderWidth: 1, borderColor: '#fff' }}
                        onPress={() => navigation.navigate('Đăng ký vay')}>
                            <Text style={{ color: '#ffffff', textAlign: 'center', fontSize: 12 }}>{'Đăng ký khoản vay mới'}</Text>
                        </TouchableOpacity>

                    </View>
                    {
                        tableData.length === 0 ? 
                        <Text style={{ color: '#ffffff', fontSize: 10, marginBottom: 5, fontWeight: '500' }}>{'Không có dữ liệu'}</Text> :
                        <Text style={{ color: '#ffffff', fontSize: 10, marginBottom: 5, fontWeight: '500' }}>{'(Để xem chi tiết lịch trả nợ, hãy chạm vào dòng cần xem)'}</Text>
                    }
                    <View>
                        <Table borderStyle={{ borderWidth: 1, borderColor: '#c8e1ff' }}>
                            <Row data={tableHead} style={styles.head} textStyle={styles.text} />
                            {/* <Rows data={tableData} textStyle={styles.text} style={styles.row} /> */}
                            {
                                tableData.map((rowData, index) => (
                                    // không hiển thị index cuối cùng
                                    <Row
                                        onPress={() => {
                                            console.log('row clicked', rowData[0]);
                                            navigation.navigate('Lịch sử trả nợ', { itemId: rowData[0] });
                                        }}
                                        key={index}
                                        data={rowData}
                                        style={styles.row}
                                        textStyle={styles.text}
                                    />
                                ))
                            }
                        </Table>
                    </View>
                    
                </ScrollView>
            </ImageBackground>
        </View>
    );
};
export default KhoanVaySecreen;
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
    row: { height: 40, backgroundColor: '#0000' },
    dataWrapper: { marginTop: -1 },
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
        color: '#ffffff',
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

    head: { height: 40, backgroundColor: '#3366CC', textAlign: 'center' },
    text: { color: '#ffffff', fontSize: 10, textAlign: 'center', backgroundColor: '#fff' }
});
