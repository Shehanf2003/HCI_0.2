import React, { useState } from 'react';
import Modal from '../Feedback/Modal';
import Button from './Button';
import Input from './Input';
import toast from 'react-hot-toast';

const CheckoutModal = ({ isOpen, onClose, cartItems, totalAmount }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Payment successful! Your furniture order has been placed.');
      onClose();
    }, 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Checkout">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Order Summary</h3>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {cartItems.map((item, index) => (
              <li key={index} className="py-2 flex justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {item.quantity}x {item.name}
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <span className="text-base font-medium text-gray-900 dark:text-white">Total</span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">${totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handleCheckout} className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Payment Details</h3>

          <Input
            label="Name on Card"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="John Doe"
          />

          <Input
            label="Card Number"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            required
            placeholder="0000 0000 0000 0000"
            maxLength="19"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Expiry (MM/YY)"
              name="expiry"
              value={formData.expiry}
              onChange={handleChange}
              required
              placeholder="MM/YY"
              maxLength="5"
            />
            <Input
              label="CVC"
              name="cvc"
              value={formData.cvc}
              onChange={handleChange}
              required
              placeholder="123"
              maxLength="4"
            />
          </div>

          <div className="mt-5 sm:mt-6">
            <Button type="submit" className="w-full" disabled={isProcessing || totalAmount === 0}>
              {isProcessing ? 'Processing Payment...' : `Pay $${totalAmount.toFixed(2)}`}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CheckoutModal;
