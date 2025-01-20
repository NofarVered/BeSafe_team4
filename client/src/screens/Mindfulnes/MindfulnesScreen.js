import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';

const MindfulnessScreen = () => {
  const [step, setStep] = useState('in'); // 'in', 'hold', 'out', 'rest'
  const [count, setCount] = useState(4); // זמן שנשאר בשלב
  const [animation] = useState(new Animated.Value(1));

  // עדכון שלב הנשימה
  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      switch (step) {
        case 'in':
          setStep('hold');
          setCount(4);
          break;
        case 'hold':
          setStep('out');
          setCount(6);
          break;
        case 'out':
          setStep('rest');
          setCount(4);
          break;
        default:
          setStep('in');
          setCount(4);
      }
    }
  }, [count, step]);

  // אנימציית גודל
  useEffect(() => {
    const toValue = step === 'in' ? 1.5 : 1;
    Animated.timing(animation, {
      toValue,
      duration: 4000,
      useNativeDriver: true,
    }).start();
  }, [step]);

  // טקסט של ההנחיות
  const getInstruction = () => {
    switch (step) {
      case 'in':
        return 'נשום עמוק פנימה';
      case 'hold':
        return 'החזק את הנשימה';
      case 'out':
        return 'נשוף לאט החוצה';
      case 'rest':
        return 'הירגע והיה מודע לרגע';
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>תרגול נשימות</Text>
      <Animated.View
        style={[
          styles.circle,
          { transform: [{ scale: animation }] },
        ]}
      />
      <Text style={styles.instruction}>{getInstruction()}</Text>
      <Text style={styles.timer}>{count} שניות</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setStep('in');
          setCount(4);
        }}
      >
        <Text style={styles.buttonText}>אפס תרגול</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 50,
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#B0E0E6',
    marginBottom: 20,
  },
  instruction: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  timer: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#555',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#87CEFA',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MindfulnessScreen;