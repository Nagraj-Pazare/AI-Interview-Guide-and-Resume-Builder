import React from 'react'
import { useNavigate } from 'react-router'
import {useAuth} from '../../auth/hooks/useAuth';
import '../style/navbar.scss'

const Navbar = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include', 
      });

      if (response.ok) {
        navigate('/login'); // Redirect to login page on success
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  return (
    <div className='nav-bar'>
     <div className='user-greet'>Hello &lt;<span className='username'>{user.username} </span> /&gt;</div>
     <div className='nav-heading'>AI Resume Builder with Custom Roadmap Generater </div>
     <button onClick={handleLogout} className='generate-btn'>Logout</button>
    </div>
  )
}

export default Navbar
