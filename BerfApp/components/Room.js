import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Room({ navigation }) {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      const response = await fetch('http://localhost:3000/chat/rooms');
      const data = await response.json();
      setRooms(data);
    };

    fetchRooms();
  }, []);

  const createRoom = async () => {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch('http://localhost:3000/chat/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newRoom }),
    });

    const data = await response.json();
    if (data.name) {
      setRooms([...rooms, data]);
      setNewRoom('');
    } else {
      alert('Room creation failed');
    }
  };

  return (
    <View>
      <TextInput placeholder="New Room" value={newRoom} onChangeText={setNewRoom} />
      <Button title="Create Room" onPress={createRoom} />
      <FlatList
        data={rooms}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Text onPress={() => navigation.navigate('Chat', { roomId: item._id })}>{item.name}</Text>
        )}
      />
    </View>
  );
}
