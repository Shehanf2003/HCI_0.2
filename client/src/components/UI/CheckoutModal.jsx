import React, { useState } from 'react';
import Modal from '../Feedback/Modal';
import Button from './Button';
import Input from './Input';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CheckoutModal = ({ isOpen, onClose, cartItems, totalAmount }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });
  const [deliveryOption, setDeliveryOption] = useState('standard');

  const deliveryCost = deliveryOption === 'express' ? 15.00 : 0;
  const finalTotal = totalAmount + deliveryCost;

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === 'cardNumber') {
      value = value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
    } else if (name === 'expiry') {
      value = value.replace(/\D/g, '');
      if (value.length > 2) {
        value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
      }
    } else if (name === 'cvc') {
      value = value.replace(/\D/g, '').slice(0, 4);
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    
    if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
      toast.error('Please enter a valid 16-digit card number.');
      return;
    }
    
    if (formData.expiry.length !== 5) {
      toast.error('Please enter a valid expiry date (MM/YY).');
      return;
    }
    
    if (formData.cvc.length < 3) {
      toast.error('Please enter a valid CVC.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      toast.success('Payment successful! Your furniture order has been placed.');
      
      setTimeout(() => {
        onClose();
        navigate('/');
      }, 2000);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Order Confirmed!">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-500 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Thank You!</h3>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
            Your payment has been successfully processed. Redirecting to home page...
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Checkout">
      <div className="space-y-6">
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">Order Summary</h3>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {cartItems?.map((item, index) => (
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
          <div className="pt-2 flex justify-between items-center">
            <span className="text-sm text-gray-700 dark:text-gray-300">Delivery</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">${deliveryCost.toFixed(2)}</span>
          </div>
          <div className="pt-4 mt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <span className="text-base font-bold text-gray-900 dark:text-white">Total</span>
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">${finalTotal.toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handleCheckout} className="space-y-5">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Delivery Options</h3>
            <div className="space-y-2">
              <label className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <input 
                  type="radio" 
                  name="deliveryOption" 
                  value="standard" 
                  checked={deliveryOption === 'standard'} 
                  onChange={(e) => setDeliveryOption(e.target.value)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                />
                <div className="ml-3 flex flex-col">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Standard Delivery (Free)</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">3-5 business days</span>
                </div>
              </label>
              <label className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <input 
                  type="radio" 
                  name="deliveryOption" 
                  value="express" 
                  checked={deliveryOption === 'express'} 
                  onChange={(e) => setDeliveryOption(e.target.value)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                />
                <div className="ml-3 flex flex-col">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Express Delivery ($15.00)</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">1-2 business days</span>
                </div>
              </label>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Shipping Address</h3>
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
            />
            <Input
              label="Delivery Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="123 Furniture St, Design City"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Payment Details</h3>

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
          </div>

          <div className="mt-6 pt-2">
            <Button type="submit" className="w-full py-3 text-lg shadow-md" disabled={isProcessing || totalAmount === 0}>
              {isProcessing ? 'Processing...' : `Pay $${finalTotal.toFixed(2)}`}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CheckoutModal;
