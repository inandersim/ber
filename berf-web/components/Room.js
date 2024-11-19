import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export default function Room() {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState('');
  const history = useHistory();

  useEffect(() => {
    const fetchRooms = async () => {
      const response = await fetch('http://localhost:3000/chat/rooms');
      const data = await response.json();
      setRooms(data);
    };

    fetchRooms();
  }, []);

  const createRoom = async () => {
    const token = localStorage.getItem('token');
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
    <div>
      <input placeholder="New Room" value={newRoom} onChange={(e) => setNewRoom(e.target.value)} />
      <button onClick={createRoom}>Create Room</button>
      <ul>
        {rooms.map((room) => (
          <li key={room._id} onClick={() => history.push(`/chat/${room._id}`)}>{room.name}</li>
        ))}
      </ul>
    </div>
  );
}
