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
import ChangeMoodScreen from './screens/Home/ChangeMoodScreen'; // Add this import

//Resources screens
import SupportScreen from './screens/Resources/SupportScreen';

//Comments screen
import CommentsScreen from './screens/Home/EmojiComments';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="LoginScreen"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#EF9595', // You can adjust this color to match your theme
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="LoginScreen" 
          component={LoginScreen}
          options={{ title: 'Login' }}
        />
        <Stack.Screen 
          name="RegisterRegularScreen" 
          component={RegisterRegularScreen}
          options={{ title: 'Register' }}
        />
        <Stack.Screen 
          name="RegisterSuperScreen" 
          component={RegisterSuperScreen}
          options={{ title: 'Super Register' }}
        />
        <Stack.Screen 
          name="CreateAvatarScreen"  // Added this screen
          component={AvatarScreen}
          options={{ title: 'Create Avatar' }}
        />
        <Stack.Screen 
          name="HomeRegularScreen" 
          component={HomeRegularScreen}
          options={{ title: 'Home' }}
        />
        <Stack.Screen 
          name="HomeSuperScreen" 
          component={HomeSuperScreen}
          options={{ title: 'Super Home' }}
        />
        <Stack.Screen 
          name="ChangeMoodScreen" 
          component={ChangeMoodScreen}
          options={{ title: 'Change Mood' }}
        />
        <Stack.Screen 
          name="Comments" 
          component={CommentsScreen}
          options={{
            title: 'Comments',
            headerBackTitle: 'Back to Map'
          }}
        />
        <Stack.Screen 
          name="SupportScreen" 
          component={SupportScreen}
          options={{ title: 'Support' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});