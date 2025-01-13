import React, { useState } from 'react'
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';

const RegisterSuperScreen = () => {

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [createTime, setCreateTime] = useState(Date.now());
  
  const handleSignUp = async () => {
    if(!userName || !email || !password)
    {
      Alert.alert('Error', 'Please fill all the data');
      return;
    }

    const userData = {
      userName,
      email,
      password,
      createTime
    };

    try {
      console.log(userData);
      //api
      /*const response = await fetch('https://api.yourserver.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('הצלחה', 'המשתמש נרשם בהצלחה');
      } else {
        Alert.alert('שגיאה', data.message || 'שגיאה ברישום');
      }*/
    }
    catch{
      //Alert.alert('שגיאה', 'שגיאה בקשר עם השרת');
    }
    
  }


  return (
    <View style={styles.container}>
        <Text style={styles.header}>Register Super Screen</Text>

        <CustomTextInput 
          placeholder='user name'
          value={userName}
          onChangeText={setUserName}
        />

        <CustomTextInput 
          placeholder='email'
          value={email}
          onChangeText={setEmail}
        /> 

        <CustomTextInput 
          placeholder='password'
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />

        <CustomButton title="SignUp" onPress={handleSignUp} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
});


export default RegisterSuperScreen