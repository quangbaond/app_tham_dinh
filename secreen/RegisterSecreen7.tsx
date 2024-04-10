import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, ImageBackground, Text, Button, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useForm, Controller, set } from "react-hook-form";
import Spinner from 'react-native-loading-spinner-overlay';
import { getData, storeData } from '../common';
import SelectDropdown, { SelectDropdownProps } from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Table, Row, Rows } from 'react-native-table-component'
import { Dimensions } from 'react-native';

export const RegisterSecreen7 = ({ navigation }: any) => {
    const screenWidth = Dimensions.get('window').width;

    const [loading, setLoading] = useState(false);

    const [userLogin, setUserLogin] = useState<any>(null);

    const [period, setPeriod] = useState([] as any);

    const [defaultValuesForm, setDefaultValues] = useState({
        so_tien_vay: "",
        thoi_han_vay: "",
    });
    const [thoi_han_vay, setDataThoiHanVay] = useState(null as any);

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
            }).then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    if (response.status === 401) {
                        Alert.alert('Thông báo', 'Vui lòng đăng nhập để tiếp tục');
                        navigation.navigate('Đăng nhập');
                        return null;
                    }
                    // if(response.status === 422) {
                    //     console.log('response', response);
                    //     return response;
                    // }
                    console.log('response', response);

                }



            }).then((data) => {
                console.log('data', data);

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
                    return [item.thoi_han_vay, item.khoan_vay, item.status === 0 ? 'Đang đuyệt' : (item.status === 1 ? 'Đã duyệt' : 'Từ chối'), item.created_at];
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
                    textStyle={{ color: '#222222' }}></Spinner>}

                <ScrollView style={{ padding: 20, borderColor: '#ccc', borderWidth: 1 }}>
                    <Text style={{ color: '#222222', fontSize: 18, marginBottom: 5, fontWeight: '700' }}>{'Đăng ký vay'}</Text>
                    <>

                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                    <Text style={{ color: '#222222', fontSize: 14, marginBottom: 5, fontWeight: '500' }}>{'Bạn muốn vay bao nhiêu?'}</Text>
                                    <TextInput
                                        style={errors.so_tien_vay ? [styles.input, { borderColor: 'red' }] : [styles.input]}
                                        value={value}
                                        onChangeText={(e) => {
                                            // format currency
                                            const currency = e.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                            onChange(currency);
                                            setMoney(parseInt(currency.replace(/,/g, '')));
                                            // check value trong form thoi_han_vay
                                            if (thoi_han_vay?.title && thoi_han_vay?.value) {
                                                // console.log('thoi_han_vay', thoi_han_vay);
                                                
                                                const laixuat = parseFloat(thoi_han_vay.value) / 12;

                                                let goc = parseInt(currency.replace(/,/g, ''));
                                                const thoihan = parseInt(thoi_han_vay.title.split(' ')[0]);
                                                const lichtra = [];
                                                let goc_con_lai = goc;
                                                let goc_moi_ky = goc / thoihan;
                                                let lai = 0;
                                                let tong_goc_lai = 0;
    
                                                for (let i = 0; i <= thoihan; i++) {
                                                    console.log('laixuat', laixuat);
                                                    lai = goc_con_lai * laixuat / 100;
                                                    tong_goc_lai = goc_moi_ky + lai;
                                                    goc_con_lai = goc_con_lai - goc_moi_ky;
                                                    const date = new Date();
                                                    date.setMonth(date.getMonth() + i);
                                                    if(isNaN(tong_goc_lai)) {
                                                        tong_goc_lai = 0;
                                                    }
    
                                                    lichtra.push([date.toLocaleDateString(), tong_goc_lai.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")]);
                                                }
                                                setTableDataMonth(lichtra);
                                            }
                                            
                                        
                                        }}
                                        // onKeyPress={(e) => {
                                        //     // console.log(e);
                                        //     // get value
                                        //     const value = e.nativeEvent.text;
                                        //     // format currency
                                        //     const currency = value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                        //     onChange(currency);
                                        //     setMoney(parseInt(currency.replace(/,/g, '')));
                                            
                                        // }}
                                        placeholderTextColor="#222222"
                                        placeholder='15,000,000'
                                        keyboardType='numeric'
                                        editable={true}
                                        returnKeyLabel="Done" />
                                </>
                            )}
                            name="so_tien_vay" 
                            rules={{ required: { value: true, message: "Số tiền không được bỏ trống" }}}
                            />
                            {errors.so_tien_vay && <Text style={{ color: 'red' }}>{errors.so_tien_vay.message}</Text>}

                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                    <Text style={{ color: '#222222', fontSize: 14, marginBottom: 5, fontWeight: '500' }}>{'Thời hạn vay'}</Text>
                                    {/* // select dropdown */}
                                    <SelectDropdown
                                        disabled={false}
                                        data={period}
                                        onSelect={(selectedItem) => {
                                            onChange(selectedItem.title);
                                            setDataThoiHanVay({
                                                title: selectedItem.title,
                                                value: selectedItem.value,
                                            });

                                            const laixuat = parseFloat(selectedItem.value) / 12;

                                            let goc = money;
                                            const thoihan = parseInt(selectedItem.title.split(' ')[0]);
                                            const lichtra = [];
                                            let goc_con_lai = goc;
                                            let goc_moi_ky = goc / thoihan;
                                            let lai = 0;
                                            let tong_goc_lai = 0;

                                            for (let i = 0; i <= thoihan; i++) {
                                                lai = goc_con_lai * laixuat / 100;
                                                tong_goc_lai = goc_moi_ky + lai;
                                                goc_con_lai = goc_con_lai - goc_moi_ky;
                                                const date = new Date();
                                                date.setMonth(date.getMonth() + i);
                                                if(isNaN(tong_goc_lai)) {
                                                    tong_goc_lai = 0;
                                                }

                                                lichtra.push([date.toLocaleDateString(), tong_goc_lai.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")]);
                                            }
                                            setTableDataMonth(lichtra);
                                        }}
                                        renderButton={(selectedItem, isOpened) => {
                                            return (
                                                <View style={styles.dropdownButtonStyle}>
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
                            name="thoi_han_vay"
                            rules={{ required: { value: true, message: "Thời hạn không được bỏ trống" }}}
                            />
                            {errors.thoi_han_vay && <Text style={{ color: 'red' }}>{errors.thoi_han_vay.message}</Text>}

                        {
                            tableDataMonth.length > 0 &&
                            <>
                                <Text style={{ color: '#222222', fontSize: 18, marginBottom: 5, marginTop: 5, fontWeight: '700' }}>{'Dự kiến'}</Text>
                                <View>
                                    <Table borderStyle={{ borderWidth: 1, borderColor: '#c8e1ff' }}>
                                        <Row data={tableHeadMonth} style={styles.head} textStyle={styles.text} />
                                        <Rows data={tableDataMonth} textStyle={styles.text} style={styles.row} />
                                    </Table>
                                </View>
                                <View style={{
                                    borderBottomColor: '#FFDF00',
                                    borderBottomWidth: 2,
                                    marginBottom: 10,
                                    marginTop: 10
                                }} />
                            </>
                        }



                        {/* <Text style={{ color: '#222222', fontSize: 20, marginBottom: 20 }}>{'Lịch sử vay'}</Text>

                        <View>
                            <Table borderStyle={{ borderWidth: 1, borderColor: '#c8e1ff' }}>
                                <Row data={tableHead} style={styles.head} textStyle={styles.text} />
                                <Rows data={tableData} textStyle={styles.text} />
                            </Table>
                        </View> */}


                        <View style={{ marginBottom: 30 }}>
                            <TouchableOpacity
                                style={{ backgroundColor: '#FFDF00', padding: 5, borderRadius: 15, marginTop: 10, borderWidth: 1, borderColor: '#fff' }}
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
    row: { height: 40, backgroundColor: '#E7E6E1' },
    dataWrapper: { marginTop: -1 },
    container: {
        // flex: 1,
        fontFamily: 'Roboto',
        padding: 20,
    },

    input: {
        borderWidth: 1,
        borderColor: '#FFDF00',
        borderRadius: 5,
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

    dropdownButtonStyle: {
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        color: '#222222',
        borderRadius: 7,
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

    head: { height: 40, backgroundColor: '#FFDF00', textAlign: 'center' },
    text: { margin: 6, color: '#222222', fontSize: 12, textAlign: 'center' }
});
