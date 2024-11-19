import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';

export default function Chat({ route }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { roomId } = route.params;
  const socket = io('http://localhost:3000');

  useEffect(() => {
    socket.emit('joinRoom', roomId);

    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.emit('leaveRoom', roomId);
      socket.off();
    };
  }, []);

  const sendMessage = async () => {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch('http://localhost:3000/chat/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ content: newMessage, room: roomId }),
    });

    const data = await response.json();
    socket.emit('sendMessage', data);
    setNewMessage('');
  };

  return (
    <View>
      <FlatList
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Text>{item.content}</Text>
        )}
      />
      <TextInput placeholder="New Message" value={newMessage} onChangeText={setNewMessage} />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
}
