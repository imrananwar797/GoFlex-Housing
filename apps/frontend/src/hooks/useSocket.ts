import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Get token from where you store it (localStorage, cookie, or AuthContext)
    const token = localStorage.getItem('token'); 

    if (!token) return;

    const newSocket = io('http://localhost:8000', {
      path: '/socket.io/',
      auth: { token }, // Authenticate with the backend
      transports: ['websocket']
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return socket;
};