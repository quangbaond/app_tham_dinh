import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRef } from 'react';
import { Animated } from 'react-native';

export const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem
            (key, value)
    } catch (e) {
        console.log(e);
    }
}

export const getData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key)
        if (value !== null) {
            return value;
        }
    } catch (e) {
        console.log(e);
    }
}

// merge with the existing data
export const mergeData = async (key, value) => {
    try {
        await AsyncStorage.mergeItem(key, value)
    } catch (e) {
        console.log(e);
    }
}

export const redirect = (user, navigation) => {
    if (!user) {
        navigation.navigate('Đăng nhập');
    } else {
        if (!user?.user_identifications) {
            navigation.navigate('Xác thực CMND/CCCD');
            return;
        } else if (!user?.user_licenses) {
            navigation.navigate('Xác thực BLX');
            return;
        } else if (!user?.user_finances) {
            navigation.navigate('Tài chính');
            return;
        } else if (!user?.user_movables?.length === 0) {
            navigation.navigate('Tài sản');
            return;
        } else if (!user?.user_loan_amounts?.length === 0) {
            navigation.navigate('Đăng ký vay');
            return;
        } else {
            navigation.navigate('Trang cá nhân');
        }
    }
}

export const fadeAnim = useRef(new Animated.Value(1)).current;

export const fadeIn = () => {
    Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
    }).start();
};