import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { DonationContext } from '../components/DonationContext';

export default function SetGoalsScreen() {
  const { setGoal } = useContext(DonationContext);
  const [inputGoal, setInputGoal] = useState('');

  const handleSetGoal = () => {
    setGoal(inputGoal);
    alert(`Goal set to $${inputGoal}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Goals</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your donation goal"
        keyboardType="numeric"
        value={inputGoal}
        onChangeText={setInputGoal}
      />
      <Button title="Set Goal" onPress={handleSetGoal} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: '#4CAF50',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
});
