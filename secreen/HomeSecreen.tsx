import React, { useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { storeData, getData } from '../common';
import { useIsFocused } from '@react-navigation/native'
const HomeSecreen = ({ navigation }: any) => {
    const isFocused = useIsFocused()

    const [userLogin, setUserLogin] = React.useState<any>(null);
    useEffect(() => {
        const getUserLogin = async () => {
            const userLogin =  await getData('userLogin');
            if(!userLogin) {
                Alert.alert('Thông báo', 'Vui lòng đăng nhập để tiếp tục');
                navigation.navigate('Login');
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
                if(error) {
                    Alert.alert('Lỗi', 'Đã có lỗi xảy ra');
                    navigation.navigate('Đăng nhập');
                }
            })
        }
        getUserLogin();
    }, [isFocused]);

    useEffect(() => {
        if(userLogin) {
            console.log(userLogin);
            
            if(!userLogin?.user_identifications) {
                Alert.alert('Thông báo', 'Vui lòng cung cấp thông tin cá nhân để tiếp tục');
                navigation.navigate('Xác thực CMND/CCCD');
                return;
            } 

            // else if(!userLogin?.user_licenses) {
            //     Alert.alert('Thông báo', 'Vui lòng cung cấp thông tin bằng lái xe để tiếp tục');
            //     navigation.navigate('Xác thực BLX');
            //     return;
            // }

            else if(!userLogin?.user_finances) {
                Alert.alert('Thông báo', 'Vui lòng cung cấp thông tin tài chính để tiếp tục');
                navigation.navigate('BLX');
                return;
            }

            else if(userLogin?.user_movables.length <= 0  || userLogin?.user_san_estates.length <= 0) {
                Alert.alert('Thông báo', 'Vui lòng cung cấp thông tin tài sản để tiếp tục');
                navigation.navigate('Tài sản');
                return;
            }

            else if(userLogin?.user_loan_amounts.length <= 0) {
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
            <Text>Home</Text>
        </View>
    );
}

export default HomeSecreen;