import React from 'react'
import { useState } from 'react';
//import { Icon } from 'react-native-vector-icons/Icon';
import { Switch, View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import CustomButton from '../../components/CustomButton';



const LoginScreen = ({navigation }) => {

    const [isSuperUser, setIsSuperUser] = useState(false); // default 'HeroUser'
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');

    const toggleSwitch = () => setIsSuperUser(previousState => !previousState);

    const handleLogin = () => {
        if(!isSuperUser){
            //check validate
            navigation.navigate('HomeRegularScreen');
        }
        else{
            //check validate
            navigation.navigate('HomeSuperScreen');
        }
    }
  
    return (
    <View style={styles.container}>

        <Text style={styles.title}>Login</Text>

        <TextInput
            style={styles.input}
            placeholder='Email'
            value={userEmail}
            onChangeText={setUserEmail}
            keyboardType='email-address'
            autoCapitalize='none'
        />

        <TextInput
            style={styles.input}
            placeholder='Password'
            value={userPassword}
            onChangeText={setUserPassword}
            secureTextEntry
        />

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>HeroUser</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isSuperUser ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isSuperUser}
        />
        <Text style={styles.switchLabel}>SuperUser</Text>
      </View>

        <CustomButton
            title='Login'
            onPress={handleLogin}
        />

        {/* foreget password... */ }

        <Button 
            onPress={() => navigation.navigate('RegisterRegularScreen')}
            title= "Register as regular user"
        />

        <Button 
            onPress={() => navigation.navigate('RegisterSuperScreen')}
            title= "Register as Super user"
        />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },


    input: {
        width: '80%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
        paddingLeft: 10,
    },

    title: {
        fontSize: 24,
        marginBottom: 20,
    },

    selectedRoleText: {
        fontSize: 16,
        marginTop: 20,
        marginBottom: 40,
      },
      switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 30,
      },
      switchLabel: {
        fontSize: 16,
        marginHorizontal: 10,
      },
  });


export default LoginScreen;