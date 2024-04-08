
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import LoginScreen from './secreen/LoginSecreen';
import RegisterScreen from './secreen/RegisterScreen';
import RegisterScreen2 from './secreen/RegisterScreen2';
// import Spinner from 'react-native-loading-spinner-overlay';
import { View } from 'react-native';
import RegisterSecreen3 from './secreen/RegisterSecreen3';
import RegisterScreen4 from './secreen/RegisterScreen4';
import RegisterSecreen5 from './secreen/RegisterSecreen5';
import RegisterSecreen6 from './secreen/RegisterSecreen6';
import { RegisterSecreen7 } from './secreen/RegisterSecreen7';
import HomeSecreen from './secreen/HomeSecreen';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {

  const [loading, setLoading] = React.useState(false);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Đăng nhập' screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Đăng nhập" component={LoginScreen} />
        <Stack.Screen name="Đăng ký" component={RegisterScreen} />
        <Stack.Screen name="Xác thực CMND/CCCD" component={RegisterScreen2} />
        <Stack.Screen name="Xác thực thông tin cơ bản" component={RegisterSecreen3} />
        <Stack.Screen name="Xác thực BLX" component={RegisterScreen4} />
        <Stack.Screen name="Tài chính" component={RegisterSecreen5} />
        <Stack.Screen name="Tài sản" component={RegisterSecreen6} />
        <Stack.Screen name="Khoản vay" component={RegisterSecreen7} />
        <Stack.Screen name="Trang cá nhân" component={HomeSecreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;


