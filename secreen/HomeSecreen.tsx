import React, { useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { storeData, getData } from '../common';
const HomeSecreen = ({ navigation }: any) => {

    const [userLogin, setUserLogin] = React.useState<any>(null);



    useEffect(() => {
        // check user login
        // const checkUserLogin = async () => {
        //     const user = await getData('login');
        //     if (!user) {
        //         Alert.alert('Thông báo', 'Vui lòng đăng nhập để tiếp tục');
        //         navigation.navigate('Đăng nhập');
        //         return;
        //     }

        //     const userInfo = await getData('userInfo');
        //     if (!userInfo) {
        //         Alert.alert('Thông báo', 'Vui lòng xác thực thông tin cá nhân để tiếp tục');
        //         navigation.navigate('Xác thực CMND/CCCD');
        //         return;
        //     }

        //     const BLX = await getData('BLX');
        //     if (!BLX) {
        //         Alert.alert('Thông báo', 'Vui lòng xác thực bằng lái xe để tiếp tục');
        //         navigation.navigate('Xác thực BLX');
        //         return;
        //     }

        //     const taiChinh = await getData('taichinh');

        //     if (!taiChinh) {
        //         Alert.alert('Thông báo', 'Vui lòng cung cấp thông tin tài chính để tiếp tục');
        //         navigation.navigate('Tài chính');
        //         return;
        //     }

        //     const taiSan = await getData('taisan');
        //     if (!taiSan) {
        //         Alert.alert('Thông báo', 'Vui lòng cung cấp thông tin tài sản để tiếp tục');
        //         navigation.navigate('Tài sản');
        //         return;
        //     }
        // };
        const getUserLogin = () => {
            const userLogin = getData('userLogin');
            if(!userLogin) {
                Alert.alert('Thông báo', 'Vui lòng đăng nhập để tiếp tục');
                navigation.navigate('Login');
                return;
            }

            const userLoginParse = JSON.parse(userLogin as unknown as string);

            fetch('https://tp.tucanhcomputer.vn/api/auth/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${userLoginParse?.token}`,
                }
            }).then((response) => response.json())
            .then((data) => {
                setUserLogin(data);
            })
        }
        getUserLogin();
    }, []);

    useEffect(() => {
        if(userLogin) {
            if(!userLogin?.userIdentifications) {
                Alert.alert('Thông báo', 'Vui lòng cung cấp thông tin cá nhân để tiếp tục');
                navigation.navigate('Xác thực CMND/CCCD');
                return;
            }

            if(!userLogin?.userLicenses) {
                Alert.alert('Thông báo', 'Vui lòng cung cấp thông tin bằng lái xe để tiếp tục');
                navigation.navigate('Xác thực BLX');
                return;
            }

            if(!userLogin?.user_finances) {
                Alert.alert('Thông báo', 'Vui lòng cung cấp thông tin tài chính để tiếp tục');
                navigation.navigate('Tài chính');
                return;
            }

            if(!userLogin?.userMovables || !userLogin?.userSanEstates) {
                Alert.alert('Thông báo', 'Vui lòng cung cấp thông tin tài sản để tiếp tục');
                navigation.navigate('Tài sản');
                return;
            }
        }
    }, [userLogin])
    return (
        <View>
            <Text>Home</Text>
        </View>
    );
}

export default HomeSecreen;