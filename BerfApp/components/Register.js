import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';

export default function Register({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const register = async () => {
    const response = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, email }),
    });

    const data = await response.json();
    if (data.message === 'User registered successfully') {
      navigation.navigate('Login');
    } else {
      alert('Registration failed');
    }
  };

  return (
    <View>
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <Button title="Register" onPress={register} />
    </View>
  );
}
