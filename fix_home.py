import re
with open('client/src/pages/Home.jsx', 'r') as f:
    home_content = f.read()

# Make it read query params so we can open it automatically
home_content = home_content.replace(
    '''import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';''',
    '''import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';'''
)

home_content = home_content.replace(
    '''const Home = () => {
  const [isAuthPanelOpen, setIsAuthPanelOpen] = useState(false);
  const navigate = useNavigate();''',
    '''const Home = () => {
  const [isAuthPanelOpen, setIsAuthPanelOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if we were redirected here to login
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('login') === 'true') {
      setIsAuthPanelOpen(true);
    }
  }, [location]);'''
)

with open('client/src/pages/Home.jsx', 'w') as f:
    f.write(home_content)
