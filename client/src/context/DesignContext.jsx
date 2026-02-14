import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const DesignContext = createContext();

export const useDesign = () => useContext(DesignContext);

export const DesignProvider = ({ children }) => {
  const [room, setRoom] = useState({
    dimensions: { length: 10, width: 10, height: 3 },
    shape: 'rectangular',
    colorScheme: { wallColor: '#e0e0e0', floorColor: '#8d6e63' },
    furnitureItems: [],
  });

  const [viewMode, setViewMode] = useState('2D'); // '2D' or '3D'
  const [selectedFurnitureId, setSelectedFurnitureId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load design from API
  const loadDesign = async (roomId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(`/api/designs/${roomId}`, config);
      setRoom(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  // Update room specs
  const updateRoomSpecs = async (roomId, specs) => {
      try {
          const token = localStorage.getItem('token');
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const { data } = await axios.put(`/api/rooms/${roomId}`, specs, config);
          setRoom(prev => ({ ...prev, ...data })); // Merge
      } catch (err) {
          setError(err.response?.data?.message || err.message);
      }
  };

  // Add furniture
  const addFurniture = async (roomId, item) => {
      try {
          const token = localStorage.getItem('token');
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const { data } = await axios.post(`/api/designs/${roomId}/furniture`, item, config);
          setRoom(data);
      } catch (err) {
          setError(err.message);
      }
  };

  // Update furniture
  const updateFurniture = async (roomId, itemId, updates) => {
      try {
          const token = localStorage.getItem('token');
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const { data } = await axios.put(`/api/designs/${roomId}/furniture/${itemId}`, updates, config);
          setRoom(data);
      } catch (err) {
          setError(err.message);
      }
  };

  // Remove furniture
  const removeFurniture = async (roomId, itemId) => {
       try {
          const token = localStorage.getItem('token');
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const { data } = await axios.delete(`/api/designs/${roomId}/furniture/${itemId}`, config);
          setRoom(data);
          setSelectedFurnitureId(null);
      } catch (err) {
          setError(err.message);
      }
  };

  const value = {
    room,
    setRoom,
    viewMode,
    setViewMode,
    selectedFurnitureId,
    setSelectedFurnitureId,
    loading,
    error,
    loadDesign,
    updateRoomSpecs,
    addFurniture,
    updateFurniture,
    removeFurniture
  };

  return (
    <DesignContext.Provider value={value}>
      {children}
    </DesignContext.Provider>
  );
};
