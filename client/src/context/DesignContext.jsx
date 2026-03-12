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

  const [viewMode, setViewMode] = useState('2D'); 
  const [transformMode, setTransformMode] = useState('translate'); 
  const [selectedFurnitureId, setSelectedFurnitureId] = useState(null);
  const [isPaintMode, setIsPaintMode] = useState(false);
  const [activePaintColor, setActivePaintColor] = useState('#ffffff');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const addToHistory = (newRoomState) => {
    const currentHistory = history.slice(0, historyIndex + 1);
    const stateCopy = JSON.parse(JSON.stringify(newRoomState));
    
    const newHistory = [...currentHistory, stateCopy];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setRoom(JSON.parse(JSON.stringify(history[newIndex])));
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setRoom(JSON.parse(JSON.stringify(history[newIndex])));
    }
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;
  
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
      setHistory([JSON.parse(JSON.stringify(data))]);
      setHistoryIndex(0);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  
  const updateRoomSpecs = async (roomId, specs) => {
      try {
          const token = localStorage.getItem('token');
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const { data } = await axios.put(`/api/rooms/${roomId}`, specs, config);
          setRoom(prev => {
            const updated = { ...prev, ...data };
            addToHistory(updated);
            return updated;
          });
      } catch (err) {
          setError(err.response?.data?.message || err.message);
      }
  };

  
  const addFurniture = async (roomId, item) => {
      try {
          const token = localStorage.getItem('token');
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const { data } = await axios.post(`/api/designs/${roomId}/furniture`, item, config);
          setRoom(data);
          addToHistory(data);
      } catch (err) {
          setError(err.message);
      }
  };

  
  const updateFurniture = async (roomId, itemId, updates) => {
      try {
          const token = localStorage.getItem('token');
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const { data } = await axios.put(`/api/designs/${roomId}/furniture/${itemId}`, updates, config);
          setRoom(data);
          addToHistory(data);
      } catch (err) {
          setError(err.message);
      }
  };

  const removeFurniture = async (roomId, itemId) => {
       try {
          const token = localStorage.getItem('token');
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const { data } = await axios.delete(`/api/designs/${roomId}/furniture/${itemId}`, config);
          setRoom(data);
          addToHistory(data);
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
    transformMode,
    setTransformMode,
    selectedFurnitureId,
    setSelectedFurnitureId,
    isPaintMode,
    setIsPaintMode,
    activePaintColor,
    setActivePaintColor,
    loading,
    error,
    loadDesign,
    updateRoomSpecs,
    addFurniture,
    updateFurniture,
    removeFurniture,
    undo,
    redo,
    canUndo,
    canRedo,
    addToHistory
  };

  return (
    <DesignContext.Provider value={value}>
      {children}
    </DesignContext.Provider>
  );
};
