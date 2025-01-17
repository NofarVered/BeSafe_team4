import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AvatarScreen from './screens/Avatar/CreateAvatarScreen';
//Login Screens
import LoginScreen from './screens/Login/LoginScreen';
import RegisterRegularScreen from './screens/Login/RegisterRegularScreen';
import RegisterSuperScreen from './screens/Login/RegisterSuperScreen';

//Home Screens
import HomeRegularScreen from './screens/Home/HomeScreenRegular';
import HomeSuperScreen from './screens/Home/HomeScreenSuper';

//Resources screens
import SupportScreen from './screens/Resources/SupportScreen';

<<<<<<< HEAD
//Avatar screen
import CreateAvatarScreen from './screens/Avatar/CreateAvatarScreen'
=======
//Chat Screen
import ChatScreenSuper from './screens/Chat/ChatScreenSuper';
import ChatScreenHero from './screens/Chat/ChatScreenHero';
>>>>>>> 9f424a4 (add chat socket)

const Stack = createStackNavigator();


export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterRegularScreen" component={RegisterRegularScreen} />
        <Stack.Screen name="RegisterSuperScreen" component={RegisterSuperScreen} />
        <Stack.Screen name="HomeRegularScreen" component={HomeRegularScreen} />
        <Stack.Screen name="HomeSuperScreen" component={HomeSuperScreen} />
        <Stack.Screen name="SupportScreen" component={SupportScreen} />
<<<<<<< HEAD
        <Stack.Screen name="CreateAvatarScreen" component={CreateAvatarScreen} />
=======
        <Stack.Screen name="ChatScreenHero" component={ChatScreenHero} />
        <Stack.Screen name="ChatScreenSuper" component={ChatScreenSuper} />
>>>>>>> 9f424a4 (add chat socket)
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});



