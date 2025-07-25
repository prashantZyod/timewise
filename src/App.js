import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './index.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/routing/ProtectedRoute';

// Simple Home component
const Home = () => {
  return (
    <div>
      <h2>Welcome to TimeWise</h2>
      <p>Your time management solution</p>
    </div>
  );
};

// Create the App component
const App = () => {
  return (
    <div className="app">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        {/* Add more routes as needed */}
      </Routes>
    </div>
  );
};

export default App;
