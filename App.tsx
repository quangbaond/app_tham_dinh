
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import LoginScreen from './secreen/LoginSecreen';
import RegisterScreen from './secreen/RegisterScreen';
import RegisterScreen2 from './secreen/RegisterScreen2';
// import Spinner from 'react-native-loading-spinner-overlay';
import { View } from 'react-native';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {

  const [loading, setLoading] = React.useState(false);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="RegisterScreen2" component={RegisterScreen2} />
      </Stack.Navigator>
    </NavigationContainer>


  );
}

export default App;


