import React from 'react';
import toast from 'react-hot-toast';
import Button from '../components/UI/Button';

export const confirmToast = (message, onConfirm) => {
  toast((t) => (
    <div>
      <p className="mb-4">{message}</p>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={() => toast.dismiss(t.id)}>Cancel</Button>
        <Button variant="danger" onClick={() => {
          onConfirm();
          toast.dismiss(t.id);
        }}>Confirm</Button>
      </div>
    </div>
  ), {
    duration: Infinity,
  });
};