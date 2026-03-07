import React, { useState } from 'react';
import axios from 'axios';
import Modal from '../Feedback/Modal';
import Button from './Button';
import Input from './Input';

const UploadTextureModal = ({ onClose, onUploadSuccess }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('wall');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an image file');
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('type', type);
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.post('/api/textures/upload', formData, config);
      setIsUploading(false);
      if (onUploadSuccess) onUploadSuccess();
      onClose();
    } catch (err) {
      setIsUploading(false);
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Upload New Texture">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-500 text-sm">{error}</div>}

        <Input
          label="Texture Name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Texture Type</label>
            <select
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={type}
                onChange={(e) => setType(e.target.value)}
            >
                <option value="wall">Wall Texture</option>
                <option value="floor">Floor Texture</option>
            </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Image File (.jpeg, .png)
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md dark:border-gray-600">
            <div className="space-y-1 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex text-sm text-gray-600 dark:text-gray-400">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 dark:bg-gray-800 dark:text-indigo-400 dark:hover:text-indigo-300">
                  <span>Upload a file</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/jpeg, image/png, image/webp" />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG, WEBP up to 5MB
              </p>
            </div>
          </div>
          {file && <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Selected: {file.name}</p>}
        </div>

        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
          <Button type="submit" className="w-full sm:col-start-2" disabled={isUploading}>
            {isUploading ? 'Uploading...' : 'Upload Texture'}
          </Button>
          <Button type="button" variant="secondary" className="mt-3 w-full sm:mt-0 sm:col-start-1" onClick={onClose} disabled={isUploading}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UploadTextureModal;
