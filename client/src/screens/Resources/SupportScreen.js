import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';

const SupportScreen = ({ navigation }) => {

  const handleCallPolice = () => {
    Linking.openURL('tel:100');
  };

  const handleCallMedical = () => {
    Linking.openURL('tel:101');
  };

  const handleCallFire = () => {
    Linking.openURL('tel:102');
  };

  const handleCallElectric = () => {
    Linking.openURL('tel:103');
  };

  const handleCallSupport = () => {
    Linking.openURL('tel:105');
  };

  const handleCallParents = () => {
    Linking.openURL('tel:0528307472');
  };


  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Support</Text>
        <Text style={styles.subHeader}>Need help? We're here for you!</Text>
      </View>

      <View style={styles.bodyContainer}>
        <Text style={styles.bodyText}>
        Got into trouble? need help? Here are some phone numbers that can help you:
        </Text>

        {/* Contact Methods */}
        <View style={styles.contactMethodsContainer}>
          
          <TouchableOpacity style={styles.contactButton} onPress={handleCallPolice}>
            <Text style={styles.buttonText}>🚓 Police - 100</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactButton} onPress={handleCallMedical}>
            <Text style={styles.buttonText}>🚑 emergency medical service - 101</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactButton} onPress={handleCallFire}>
            <Text style={styles.buttonText}>🚒 fire department - 102</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.contactButton} onPress={handleCallElectric}>
            <Text style={styles.buttonText}>⚡ Electric company - 103</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactButton} onPress={handleCallSupport}>
            <Text style={styles.buttonText}>🆘 Child Protection Headquarters - 105</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactButton} onPress={handleCallParents}>
            <Text style={styles.buttonText}>👩‍👦‍👦 Your Parents</Text>
          </TouchableOpacity>

        </View>

        <Text style={styles.footerText}>
          We're always happy to assist you and improve your experience! 
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  headerContainer: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#EF9595',
  },
  subHeader: {
    fontSize: 18,
    color: '#333',
    marginTop: 10,
  },
  bodyContainer: {
    padding: 20,
  },
  bodyText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  contactMethodsContainer: {
    marginBottom: 20,
  },
  contactButton: {
    backgroundColor: '#EF9595',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
  footerText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SupportScreen;
