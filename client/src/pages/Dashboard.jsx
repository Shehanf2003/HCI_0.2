import React, { useEffect, useState, Suspense } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/UI/Button';
import Modal from '../components/Feedback/Modal';
import Input from '../components/UI/Input';
import UploadFurnitureModal from '../components/Admin/UploadFurnitureModal';
import UploadTextureModal from '../components/UI/UploadTextureModal';
import toast from 'react-hot-toast';
import { confirmToast } from '../utils/confirmToast';
import { ROOM_TEMPLATES } from '../utils/roomTemplates';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Pencil, Trash2, LayoutGrid } from 'lucide-react';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-10">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

const RoomPreview = ({ dimensions }) => {
  const { length, width, height } = dimensions;
  // Calculate camera position roughly based on room size
  const maxDim = Math.max(length, width, height);
  const camPos = maxDim * 1.5;

  return (
    <Canvas frameloop="demand" camera={{ position: [camPos, camPos, camPos], fov: 50 }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <Suspense fallback={null}>
        <group position={[0, -height / 4, 0]}>
           {/* Floor */}
           <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[length, width]} />
              <meshStandardMaterial color="#d1d5db" />
           </mesh>
           {/* Room Volume (Wireframe) */}
           <mesh position={[0, height / 2, 0]}>
              <boxGeometry args={[length, height, width]} />
              <meshStandardMaterial color="#60a5fa" wireframe transparent opacity={0.5} />
           </mesh>
        </group>
        <OrbitControls autoRotate autoRotateSpeed={2} enableZoom={false} enablePan={false} />
      </Suspense>
    </Canvas>
  );
};

const AdminActions = ({ onUploadFurniture, onUploadTexture }) => (
  <div className="flex items-center space-x-2">
    <Button variant="secondary" onClick={onUploadFurniture}>Upload Furniture</Button>
    <Button variant="secondary" onClick={onUploadTexture}>Upload Texture</Button>
  </div>
);

const Dashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showTextureModal, setShowTextureModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const userInfo = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const isAdmin = userInfo?.isAdmin;

  // New room state
  const [newRoom, setNewRoom] = useState({
    name: '',
    length: 10,
    width: 10,
    height: 3,
    templateId: 'empty',
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

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const selectedTemplate = ROOM_TEMPLATES.find(t => t.id === newRoom.templateId);

      const payload = {
        name: newRoom.name,
        dimensions: {
          length: parseFloat(newRoom.length),
          width: parseFloat(newRoom.width),
          height: parseFloat(newRoom.height),
        },
        colorScheme: selectedTemplate ? selectedTemplate.colorScheme : undefined,
      };

      const { data } = await axios.post('/api/rooms', payload, config);
      setIsModalOpen(false);
      navigate(`/design-studio/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleEditRoomSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const payload = {
        name: editingRoom.name,
        dimensions: {
          length: parseFloat(editingRoom.length),
          width: parseFloat(editingRoom.width),
          height: parseFloat(editingRoom.height),
        }
      };

      await axios.put(`/api/rooms/${editingRoom._id}`, payload, config);
      setIsEditModalOpen(false);
      fetchRooms(); // Refresh the list
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    confirmToast("Are you sure you want to delete this design?", async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(`/api/rooms/${roomId}`, config);

        // Refresh the list
        fetchRooms();
        toast.success('Design deleted successfully.');
      } catch (err) {
        toast.error(err.response?.data?.message || err.message);
      }
    });
  };

  const openEditModal = (room) => {
    setEditingRoom({
      _id: room._id,
      name: room.name,
      length: room.dimensions.length,
      width: room.dimensions.width,
      height: room.dimensions.height,
    });
    setIsEditModalOpen(true);
  };

  return (
    <div className="min-h-screen pt-20 font-sans transition-colors duration-300">
    <div 
      className="fixed inset-0 z-[-1] bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/hero-bg.jpg')" }}
      />
      <div className="fixed inset-0 z-[-1] bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur-sm" />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 relative z-10">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Designs</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your projects or start a new one.</p>
            </div>
            <div className="flex items-center space-x-4">
              {isAdmin && (
                <AdminActions 
                  onUploadFurniture={() => setShowUploadModal(true)}
                  onUploadTexture={() => setShowTextureModal(true)}
                />
              )}
              <Button onClick={() => setIsModalOpen(true)}>Create New Design</Button>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center dark:bg-red-900/30 dark:border-red-700 dark:text-red-300">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <div key={room._id} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md overflow-hidden shadow-lg rounded-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
                  <div className="h-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center relative cursor-grab active:cursor-grabbing">
                    <RoomPreview dimensions={room.dimensions} />
                  </div>
                  <div className="p-5 flex-grow flex flex-col">
                    <div className="flex-grow">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white truncate">
                        {room.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {room.dimensions.length}m x {room.dimensions.width}m x {room.dimensions.height}m
                      </p>
                    </div>
                    <div className="mt-5 flex items-center justify-between">
                      <Link
                        to={`/design-studio/${room._id}`}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
                      >
                        Open
                      </Link>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => openEditModal(room)}
                          className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-indigo-400 transition"
                          title="Edit"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteRoom(room._id)}
                          className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-red-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-red-400 transition"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && rooms.length === 0 && (
            <div className="text-center col-span-full py-16 bg-white/50 dark:bg-gray-800/50 rounded-lg shadow-inner">
              <LayoutGrid className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No designs yet</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new design.</p>
              <div className="mt-6">
                <Button onClick={() => setIsModalOpen(true)}>
                  Create New Design
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Design">
        <form onSubmit={handleCreateRoom} className="space-y-4">
          <div>
            <select
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={newRoom.templateId}
                onChange={(e) => {
                  const tmpl = ROOM_TEMPLATES.find(t => t.id === e.target.value);
                  setNewRoom({
                    ...newRoom,
                    templateId: e.target.value,
                    length: tmpl.dimensions.length,
                    width: tmpl.dimensions.width,
                    height: tmpl.dimensions.height,
                    name: newRoom.name || tmpl.name
                  });
                }}
            >
                {ROOM_TEMPLATES.map(tmpl => (
                  <option key={tmpl.id} value={tmpl.id}>{tmpl.name}</option>
                ))}
            </select>
          </div>
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

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Design">
        {editingRoom && (
          <form onSubmit={handleEditRoomSubmit}>
            <Input
              label="Design Name"
              id="editRoomName"
              value={editingRoom.name}
              onChange={(e) => setEditingRoom({ ...editingRoom, name: e.target.value })}
              required
            />
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Length (m)"
                id="editLength"
                type="number"
                value={editingRoom.length}
                onChange={(e) => setEditingRoom({ ...editingRoom, length: e.target.value })}
                required
                min="1"
              />
              <Input
                label="Width (m)"
                id="editWidth"
                type="number"
                value={editingRoom.width}
                onChange={(e) => setEditingRoom({ ...editingRoom, width: e.target.value })}
                required
                min="1"
              />
              <Input
                label="Height (m)"
                id="editHeight"
                type="number"
                value={editingRoom.height}
                onChange={(e) => setEditingRoom({ ...editingRoom, height: e.target.value })}
                required
                min="1"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        )}
      </Modal>

      {showUploadModal && (
        <UploadFurnitureModal
            onClose={() => setShowUploadModal(false)}
            onUploadSuccess={() => {
                toast.success('Furniture uploaded successfully!');
            }}
        />
      )}

      {showTextureModal && (
        <UploadTextureModal
            onClose={() => setShowTextureModal(false)}
            onUploadSuccess={() => {
                toast.success('Texture uploaded successfully!');
            }}
        />
      )}
    </div>
  );
};

export default Dashboard;
