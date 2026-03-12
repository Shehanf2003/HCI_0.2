import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UploadFurnitureModal = ({ onClose, onUploadSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'chair',
    width: '',
    height: '',
    depth: '',
    price: '',
    description: '',
    color: '#ffffff',
    realWorldWidthMeters: '',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a GLB file.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dl1bokcc8'; 
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'furniture_GLB';

      const cloudData = new FormData();
      cloudData.append('file', file);
      cloudData.append('upload_preset', uploadPreset);
      cloudData.append('resource_type', 'raw');

      const cloudinaryResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        cloudData
      );

      const modelUrl = cloudinaryResponse.data.secure_url;

      
      const userInfo = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
      const token = userInfo?.token;

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const payload = {
        ...formData,
        modelUrl
      };

      await axios.post('/api/furniture/upload', payload, config);
      setLoading(false);
      onUploadSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Error uploading file');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Upload Furniture</h2>
        {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm p-2 text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Real World Width (Meters)</label>
            <input
              type="number"
              step="0.01"
              name="realWorldWidthMeters"
              value={formData.realWorldWidthMeters}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm p-2 text-black"
              placeholder="e.g. 1.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm p-2 text-black"
            >
              <option value="chair">Chair</option>
              <option value="table">Table</option>
              <option value="sofa">Sofa</option>
              <option value="bed">Bed</option>
              <option value="storage">Storage</option>
              <option value="decor">Decor</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Width (m)</label>
              <input type="number" step="0.1" name="width" value={formData.width} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm p-2 text-black" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Height (m)</label>
              <input type="number" step="0.1" name="height" value={formData.height} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm p-2 text-black" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Depth (m)</label>
              <input type="number" step="0.1" name="depth" value={formData.depth} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm p-2 text-black" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price ($)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm p-2 text-black"
            />
          </div>

           <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Default Color</label>
            <div className="flex items-center space-x-2">
                 <input
                  type="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="mt-1 block w-10 h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 p-1"
                />
                 <span className="text-sm dark:text-gray-400">{formData.color}</span>
            </div>

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm p-2 text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">GLB File</label>
            <input
              type="file"
              accept=".glb,.gltf"
              onChange={handleFileChange}
              required
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:text-gray-300"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadFurnitureModal;
