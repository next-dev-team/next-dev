import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import { hello, helloAsync } from '../hello';

export function HelloDemo() {
  const [greeting, setGreeting] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('React Native');

  const handleHello = () => {
    const message = hello(name);
    setGreeting(message);
  };

  const handleHelloAsync = async () => {
    setLoading(true);
    try {
      const message = await helloAsync(name);
      setGreeting(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Utils Hello Demo</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter name"
        />
      </View>
      {greeting ? <Text style={styles.greeting}>{greeting}</Text> : null}
      <View style={styles.buttonContainer}>
        <Button title="Say Hello" onPress={handleHello} />
        <View style={styles.spacer} />
        <Button title="Say Hello Async" onPress={handleHelloAsync} disabled={loading} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  greeting: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  spacer: {
    width: 10,
  },
});
