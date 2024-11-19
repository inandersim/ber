import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { roomId } = useParams();
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
  }, [roomId]);

  const sendMessage = async () => {
    const token = localStorage.getItem('token');
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
    <div>
      <ul>
        {messages.map((message) => (
          <li key={message._id}>{message.content}</li>
        ))}
      </ul>
      <input placeholder="New Message" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
