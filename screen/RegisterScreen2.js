// LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ImageBackground, Text, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import { useForm, Controller } from "react-hook-form"

const RegisterScreen2 = ({ navigation }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');
    const [step1, setStep1] = useState(true);
    const [step2, setStep2] = useState(false);
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            phoneNumber: "",
            password: "",
            repassword: "",
        },
    })
    const {
        controlOTP,
        handleSubmitOTP,
        formState: { errorsOTP },
    } = useForm({
        defaultValues: {
            OTP: "",
        },
    })


    return (
        <View style={styles.container}>
            <Text style={{ color: '#fff', fontSize: 25, marginBottom: 20 }}>{'Xác nhận OTP'}</Text>
        </View>
    );
};

const styles = StyleSheet.create({

    image: {
        flex: 1,
        justifyContent: "center",
        width: '100%',
        height: '100%',
        alignContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        fontFamily: 'Roboto',
    },

    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        width: '90%',
        marginBottom: 20,
        padding: 10,
        color: '#fff',
        backgroundColor: 'rgba(255,255,255,0.2)',
    }


});


export default RegisterScreen2;
