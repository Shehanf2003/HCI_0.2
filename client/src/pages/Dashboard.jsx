import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/UI/Button';
import Modal from '../components/Feedback/Modal';
import Input from '../components/UI/Input';

const Dashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [homeBgUrl, setHomeBgUrl] = useState('');

  // New room state
  const [newRoom, setNewRoom] = useState({
    name: '',
    length: 10,
    width: 10,
    height: 3,
  });

  const navigate = useNavigate();

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get('/api/rooms', config);
      setRooms(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  const fetchConfig = async () => {
    try {
      const { data } = await axios.get('/api/config');
      if (data && data.homeBackgroundUrl) {
        setHomeBgUrl(data.homeBackgroundUrl);
      }
    } catch (error) {
      console.error('Failed to fetch config', error);
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchConfig();
  }, []);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const payload = {
        name: newRoom.name,
        dimensions: {
          length: parseFloat(newRoom.length),
          width: parseFloat(newRoom.width),
          height: parseFloat(newRoom.height),
        },
        // Defaults for others
      };

      const { data } = await axios.post('/api/rooms', payload, config);
      setIsModalOpen(false);
      navigate(`/design-studio/${data._id}`);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleUpdateConfig = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put('/api/config', { homeBackgroundUrl: homeBgUrl }, config);
      setIsConfigModalOpen(false);
      alert('Home background updated successfully!');
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Your Designs</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setIsConfigModalOpen(true)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition"
              >
                Update Home Background
              </button>
              <Button onClick={() => setIsModalOpen(true)}>Create New Design</Button>
            </div>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <div key={room._id} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 truncate">
                      {room.name}
                    </h3>
                    <div className="mt-2 max-w-xl text-sm text-gray-500">
                      <p>Dimensions: {room.dimensions.length}x{room.dimensions.width}x{room.dimensions.height}</p>
                    </div>
                    <div className="mt-4">
                      <Link
                        to={`/design-studio/${room._id}`}
                        className="text-blue-600 hover:text-blue-900 font-medium"
                      >
                        Open Design &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              {rooms.length === 0 && (
                <p className="text-gray-500 col-span-full text-center py-10">
                  No designs yet. Create one to get started!
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Design">
        <form onSubmit={handleCreateRoom}>
          <Input
            label="Design Name"
            id="roomName"
            value={newRoom.name}
            onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
            required
          />
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Length (m)"
              id="length"
              type="number"
              value={newRoom.length}
              onChange={(e) => setNewRoom({ ...newRoom, length: e.target.value })}
              required
              min="1"
            />
            <Input
              label="Width (m)"
              id="width"
              type="number"
              value={newRoom.width}
              onChange={(e) => setNewRoom({ ...newRoom, width: e.target.value })}
              required
              min="1"
            />
            <Input
              label="Height (m)"
              id="height"
              type="number"
              value={newRoom.height}
              onChange={(e) => setNewRoom({ ...newRoom, height: e.target.value })}
              required
              min="1"
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isConfigModalOpen} onClose={() => setIsConfigModalOpen(false)} title="Update Home Background">
        <form onSubmit={handleUpdateConfig}>
          <Input
            label="Background Image URL"
            id="bgUrl"
            value={homeBgUrl}
            onChange={(e) => setHomeBgUrl(e.target.value)}
            required
            placeholder="https://example.com/image.jpg"
          />
          <div className="mt-4 flex justify-end">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;
