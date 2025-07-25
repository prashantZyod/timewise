import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = {};
  }

  connect() {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.error('No auth token found. Cannot connect to socket.');
      return;
    }
    
    this.socket = io(SOCKET_URL, {
      auth: {
        token
      }
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('connect_error', (err) => {
      console.error('Socket connection error', err);
    });

    // Register any saved event listeners
    Object.entries(this.listeners).forEach(([event, callback]) => {
      this.socket.on(event, callback);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  on(event, callback) {
    // Save the callback
    this.listeners[event] = callback;
    
    // If already connected, register the event
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event) {
    if (this.socket) {
      this.socket.off(event);
    }
    delete this.listeners[event];
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    } else {
      console.error('Socket not connected. Cannot emit', event);
    }
  }
}

const socketService = new SocketService();
export default socketService;

// In your context providers:
import socketService from '../services/socket';

// Inside useEffect:
useEffect(() => {
  // Connect to socket when component mounts
  socketService.connect();
  
  // Listen for updates
  socketService.on('attendance-update', (data) => {
    // Update state with new attendance data
    setAttendance(prev => [...prev, data]);
  });
  
  return () => {
    // Clean up listeners when component unmounts
    socketService.off('attendance-update');
  };
}, []);