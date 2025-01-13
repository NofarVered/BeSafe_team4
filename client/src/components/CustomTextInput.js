import React, { useState } from 'react';
import { TextInput, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CustomTextInput = ({ value, onChangeText, placeholder, secureTextEntry, keyboardType }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        keyboardType={keyboardType}
      />
      {secureTextEntry && (
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.icon}>
          <Ionicons
            name={isPasswordVisible ? 'eye-off' : 'eye'}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    width: '80%',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 30,
    marginVertical: 10,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  icon: {
    padding: 10,
  },
});

export default CustomTextInput;
