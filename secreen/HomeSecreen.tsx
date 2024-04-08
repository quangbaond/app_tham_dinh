import React, { useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { storeData, getData } from '../common';
const HomeSecreen = ({ navigation }: any) => {

    useEffect(() => {
        // check user login
        const checkUserLogin = async () => {
            const user = await getData('login');
            if (!user) {
                Alert.alert('Thông báo', 'Vui lòng đăng nhập để tiếp tục');
                navigation.navigate('Đăng nhập');
                return;
            }

            const userInfo = await getData('userInfo');
            if (!userInfo) {
                Alert.alert('Thông báo', 'Vui lòng xác thực thông tin cá nhân để tiếp tục');
                navigation.navigate('Xác thực CMND/CCCD');
                return;
            }

            const BLX = await getData('BLX');
            if (!BLX) {
                Alert.alert('Thông báo', 'Vui lòng xác thực bằng lái xe để tiếp tục');
                navigation.navigate('Xác thực BLX');
                return;
            }

            const taiChinh = await getData('taichinh');

            if (!taiChinh) {
                Alert.alert('Thông báo', 'Vui lòng cung cấp thông tin tài chính để tiếp tục');
                navigation.navigate('Tài chính');
                return;
            }

            const taiSan = await getData('taisan');
            if (!taiSan) {
                Alert.alert('Thông báo', 'Vui lòng cung cấp thông tin tài sản để tiếp tục');
                navigation.navigate('Tài sản');
                return;
            }
        };

        checkUserLogin();
    }, []);
    return (
        <View>
            <Text>Home</Text>
        </View>
    );
}

export default HomeSecreen;