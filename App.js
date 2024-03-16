import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screen/LoginScreen'
import MainScreen from './screen/Main';
import RegisterScreen from './screen/RegisterScreen';
import RegisterScreen2 from './screen/RegisterScreen2';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="RegisterStep2" component={RegisterScreen2} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
