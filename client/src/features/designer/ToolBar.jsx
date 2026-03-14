import React, { useState } from 'react';
import { useDesign } from '../../context/DesignContext';
import Button from '../../components/UI/Button';
import CheckoutModal from '../../components/UI/CheckoutModal';

const ToolBar = () => {
  const { viewMode, setViewMode, room, undo, redo, canUndo, canRedo } = useDesign();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const takePicture = () => {
    const canvas = document.querySelector('#design-canvas canvas');
    if (canvas) {
      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'design-snapshot.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getCartItems = () => {
    if (!room || !room.furnitureItems) return [];

    const itemsMap = {};
    room.furnitureItems.forEach(item => {
      const furnId = item.furnitureId._id || item.furnitureId; 
      const price = item.furnitureId.price || 0;
      const name = item.furnitureId.name || 'Furniture Item';

      if (itemsMap[furnId]) {
        itemsMap[furnId].quantity += 1;
      } else {
        itemsMap[furnId] = { id: furnId, name, price, quantity: 1 };
      }
    });

    return Object.values(itemsMap);
  };

  const cartItems = getCartItems();
  const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <>
      <div className="bg-transparent p-4 border-b flex justify-between items-center dark:border-gray-700 transition-colors duration-300">
        <div className="flex items-center space-x-4">
          <span className="font-semibold text-gray-700 dark:text-gray-200">Design Workspace</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="secondary" onClick={undo} disabled={!canUndo}>
            Undo
          </Button>
          <Button variant="secondary" onClick={redo} disabled={!canRedo}>
            Redo
          </Button>
          <Button variant="primary" onClick={() => setIsCheckoutOpen(true)}>
            Checkout Furniture (${totalAmount.toFixed(2)})
          </Button>
          <Button variant="secondary" onClick={takePicture}>
            Take a Picture
          </Button>
          <Button variant="secondary" onClick={() => setViewMode(viewMode === '2D' ? '3D' : '2D')}>
            Switch to {viewMode === '2D' ? '3D' : '2D'}
          </Button>
        </div>
      </div>
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        totalAmount={totalAmount}
      />
    </>
  );
};

export default ToolBar;