import React, { useEffect } from 'react';
import { View, Text, Alert, ImageBackground, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { storeData, getData } from '../common';
import { useIsFocused } from '@react-navigation/native'
import UserAvatar from 'react-native-user-avatar';
import Icon from 'react-native-vector-icons/AntDesign';
const HomeSecreen = ({ navigation }: any) => {
    const isFocused = useIsFocused()

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

    useEffect(() => {
        if (userLogin) {
            console.log(userLogin);

            if (!userLogin?.user_identifications) {
                Alert.alert('Thông báo', 'Vui lòng cung cấp thông tin cá nhân để tiếp tục');
                navigation.navigate('Xác thực CMND/CCCD');
                return;
            }

            // else if(!userLogin?.user_licenses) {
            //     Alert.alert('Thông báo', 'Vui lòng cung cấp thông tin bằng lái xe để tiếp tục');
            //     navigation.navigate('Xác thực BLX');
            //     return;
            // }

            else if (!userLogin?.user_finances) {
                Alert.alert('Thông báo', 'Vui lòng cung cấp thông tin tài chính để tiếp tục');
                navigation.navigate('Tài chính');
                return;
            }

            else if (userLogin?.user_licenses) {
                Alert.alert('Thông báo', 'Vui lòng cung cấp thông tin bằng lái xe để tiếp tục');
                navigation.navigate('Xác thực BLX');
                return;
            }

            else if (userLogin?.user_movables.length <= 0 || userLogin?.user_san_estates.length <= 0) {
                Alert.alert('Thông báo', 'Vui lòng cung cấp thông tin tài sản để tiếp tục');
                navigation.navigate('Tài sản');
                return;
            }

            else if (userLogin?.user_loan_amounts.length <= 0) {
                Alert.alert('Thông báo', 'Vui lòng cung cấp thông tin công việc để tiếp tục');
                navigation.navigate('Khoản vay');
                return;
            }
        }
    }, [userLogin])

    // useEffect(() => {
    //     if(isFocused){
    //         //Update the state you want to be updated
    //     }
    // }, [isFocused])
    return (
        <View>
            {
                userLogin ?
                    <View>
                        <ImageBackground source={require('../assets/logo/logo.jpg')} resizeMode="cover" style={styles.image}>
                            <View style={{ backgroundColor: '#3366CC', padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
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

                            <View style={{ paddingTop: 10, paddingLeft: 10, paddingRight: 10, flexDirection: 'row', justifyContent: 'center' }}>
                                <Text style={{ color: '#ffffff', fontSize: 12, textAlign: 'center', fontWeight: '700' }}>Xếp hạng tín dụng của bạn</Text>
                            </View>
                            <View style={{ paddingTop: 10, paddingLeft: 10, paddingRight: 10, flexDirection: 'row', justifyContent: 'center' }}>
                                <TouchableOpacity style={{ backgroundColor: '#3366CC', width: 120, borderWidth: 1, borderColor: '#fff', borderRadius: 15 }}>
                                    <Text style={{ color: '#ffffff', fontSize: 12, textAlign: 'center', padding: 15 }}>ABB</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ paddingTop: 20, paddingLeft: 10, paddingRight: 10, flexDirection: 'row', justifyContent: 'space-around' }}>
                                <TouchableOpacity style={{ backgroundColor: '#3366CC', width: 100, padding: 15, borderWidth: 1, borderColor: '#fff', borderRadius: 15 }} onPress={() => {
                                    navigation.navigate('Xác thực thông tin cơ bản');
                                }}>
                                    <Text style={{ color: '#ffffff', fontSize: 12, textAlign: 'center' }}>Pháp Lý</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ backgroundColor: '#3366CC', width: 100, borderWidth: 1, borderColor: '#fff', borderRadius: 15 }} onPress={() => {
                                    navigation.navigate('Tài chính');
                                }}>
                                    <Text style={{ color: '#ffffff', fontSize: 12, textAlign: 'center', padding: 15 }}>Tài chính</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ paddingTop: 20, paddingLeft: 10, paddingRight: 10, flexDirection: 'row', justifyContent: 'space-around' }}>
                                <TouchableOpacity style={{ backgroundColor: '#3366CC', width: 100, padding: 15, borderWidth: 1, borderColor: '#fff', borderRadius: 15 }} onPress={() => {
                                    navigation.navigate('Tài sản');
                                }}>
                                    <Text style={{ color: '#ffffff', fontSize: 12, textAlign: 'center' }}>Tài sản</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ backgroundColor: '#3366CC', width: 100, borderRadius: 15 }} onPress={() => {
                                    navigation.navigate('Khoản vay');
                                }}>
                                    <Text style={{ color: '#ffffff', fontSize: 12, textAlign: 'center', padding: 15, borderWidth: 1, borderColor: '#fff', borderRadius: 15 }}>Khoản vay</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ paddingTop: 20, paddingLeft: 10, paddingRight: 10, flexDirection: 'row', justifyContent: 'center' }}>
                                <TouchableOpacity style={{ backgroundColor: '#3366CC', width: 120, padding: 15, borderWidth: 1, borderColor: '#fff', borderRadius: 15 }} onPress={() => {
                                    Alert.alert('Thông báo', 'Chức năng đang phát triển');
                                }}>
                                    <Text style={{ color: '#ffffff', fontSize: 12, textAlign: 'center' }}>Hồ sơ tín dụng</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ paddingTop: 20, paddingLeft: 10, paddingRight: 10, flexDirection: 'row', }}>
                                <TouchableOpacity style={{ backgroundColor: '#3366CC', width: '100%', padding: 10, borderWidth: 1, borderColor: '#fff', borderRadius: 15 }} onPress={() => {
                                    Alert.alert('Thông báo', 'Chức năng đang phát triển');
                                }}>
                                    <Text style={{ color: '#ffffff', fontSize: 12, textAlign: 'center', }}>Bán hàng thêm như bảo hiểm</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ paddingTop: 20, paddingLeft: 10, paddingRight: 10, flexDirection: 'row', }}>
                                <TouchableOpacity style={{ backgroundColor: '#3366CC', width: '100%', padding: 10, borderWidth: 1, borderColor: '#fff', borderRadius: 15 }} onPress={() => {
                                    Alert.alert('Thông báo', 'Chức năng đang phát triển');
                                }}>
                                    <Text style={{ color: '#ffffff', fontSize: 12, textAlign: 'center' }}>Ưu đãi</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ paddingTop: 20, paddingLeft: 10, paddingRight: 10, flexDirection: 'row', }}>
                                <TouchableOpacity style={{ backgroundColor: '#3366CC', width: '100%', padding: 10, borderWidth: 1, borderColor: '#fff', borderRadius: 15 }} onPress={() => {
                                    Alert.alert('Thông báo', 'Chức năng đang phát triển');
                                }}>
                                    <Text style={{ color: '#ffffff', fontSize: 12, textAlign: 'center' }}>Quảng cáo</Text>
                                </TouchableOpacity>
                            </View>
                        </ImageBackground>
                    </View>
                    : <Text>Loading...</Text>
            }
        </View>
    );
}

const styles = StyleSheet.create({

    image: {
        // justifyContent: "center",
        width: '100%',
        height: '100%',
        // alignContent: 'center',
        // alignItems: 'center',
        // padding: 20,
        // borderWidth: 1,
    },
});

export default HomeSecreen;