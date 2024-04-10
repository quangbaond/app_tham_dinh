import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, ImageBackground, Text, Button, ScrollView, Alert } from 'react-native';
import { useForm, Controller, set } from "react-hook-form";
import Spinner from 'react-native-loading-spinner-overlay';
import { getData, storeData } from '../common';
import SelectDropdown, { SelectDropdownProps } from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Table, Row, Rows } from 'react-native-table-component'
import { Dimensions } from 'react-native';
import moment from 'moment';

export const HistoryScreen = ({ route, navigation }: any) => {
    const screenWidth = Dimensions.get('window').width;
    const { itemId } = route.params;


    const [loading, setLoading] = useState(false);

    const [userLogin, setUserLogin] = useState<any>(null);

    const [period, setPeriod] = useState([] as any);

    const [defaultValuesForm, setDefaultValues] = useState({
        so_tien_vay: "",
        thoi_han_vay: "",
    });

    const tableHead = ['Thời hạn', 'Số tiền', 'Thời gian', 'Trạng thái'];
    const [tableData, setTableData] = useState([] as any);
    const tableHeadMonth = ['Thời gian', 'Số tiền', 'Đã trả'];

    const [tableDataMonth, setTableDataMonth] = useState([]);
    const [khoan_vay, setKhoanVay] = useState({} as any);

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
                // console.log('data', data.user_history_loan_amounts);
                fetch('https://tp.tucanhcomputer.vn/api/get-user-load-amount/' + itemId, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                })
                    .then((response) => {
                        if (response.status === 401) {
                            Alert.alert('Thông báo', 'Vui lòng đăng nhập để tiếp tục');
                            navigation.navigate('Đăng nhập');
                            return null;
                        }

                        return response.json();

                    })
                    .then((data) => {
                        setLoading(false);
                        console.log('data', data);
                        setKhoanVay(data?.userLoanAmount);
                        setTableDataMonth(
                            data?.userLoanAmount?.user_history_loan_amounts.map((item: any) => {
                                console.log('item', item);
                                item.ngay_tra = moment(item.ngay_tra).format('DD/MM/YYYY');
                                item.tong_goc_lai = item.tong_goc_lai.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                item.so_tien_tra = item.so_tien_tra.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                return [item.ngay_tra, item.tong_goc_lai, item.so_tien_tra];
                            })
                        );
                        setTableData([
                            [data?.userLoanAmount?.thoi_han_vay, data?.userLoanAmount?.khoan_vay.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), moment(data?.userLoanAmount?.created_at).format('DD/MM/YYYY'),
                            data?.userLoanAmount?.status === 0 ? 'Đang đuyệt' : data?.userLoanAmount?.status === 1 ? 'Đã duyệt' : data?.userLoanAmount?.status === 2 ? 'Từ chố' : data?.userLoanAmount?.status === 3 ? 'Chưa hoàn thành' : 'Hoàn thành'
                            ],
                        ]);

                    })
                    .catch((error) => {
                        console.log('error', error);
                        setLoading(false);
                    });

                setUserLogin(data);
            }).catch((error) => {
                console.log('error', error);
                Alert.alert('Lỗi', 'Đã có lỗi xảy ra');
            });
        }
        getUserData()
    }, []);



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

                <ScrollView style={{ padding: 20, borderColor: '#ccc', borderWidth: 1 }}>
                    {/* <Text style={{ color: '#ffffff', fontSize: 20, marginBottom: 5 }}>{'Thông tin khoản vay'}</Text> */}
                    <Text style={{ color: '#ffffff', fontSize: 18, marginBottom: 5, fontWeight: '500' }}>{'Khoản vay'}</Text>

                    <View>
                        <Table borderStyle={{ borderWidth: 1, borderColor: '#c8e1ff' }}>
                            <Row data={tableHead} style={styles.head} textStyle={styles.text} />
                            <Rows data={tableData} textStyle={styles.text} style={styles.row} />
                        </Table>
                    </View>
                    <>
                        {
                            tableDataMonth.length > 0 &&
                            <>
                                <Text style={{ color: '#ffffff', fontSize: 18, marginBottom: 5, marginTop: 5 }}>{
                                    khoan_vay?.status === 0 ? 'Dự kiến' : khoan_vay?.status === 1 ? 'Lịch trả' : 'Lịch trả'
                                }</Text>
                                <View>
                                    <Table borderStyle={{ borderWidth: 1, borderColor: '#c8e1ff' }}>
                                        <Row data={tableHeadMonth} style={styles.head} textStyle={styles.text} />
                                        {/* <Rows data={tableDataMonth} textStyle={styles.text} style={styles.row} /> */}
                                        {
                                            tableDataMonth.map((rowData, index) => (
                                                <Row
                                                    onPress={() => console.log('row clicked')}
                                                    key={index}
                                                    data={rowData}
                                                    style={styles.row}
                                                    textStyle={styles.text}
                                                />
                                            ))
                                        }
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




                        {/* <View style={{ marginBottom: 30, marginTop: 30 }}>
                            <Button title="Tiếp tục" onPress={handleSubmit(submit)} />
                        </View> */}
                    </>
                </ScrollView>
            </ImageBackground>
        </View>
    );
};
export default HistoryScreen;
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
    row: { height: 40, backgroundColor: '#fff' },
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
