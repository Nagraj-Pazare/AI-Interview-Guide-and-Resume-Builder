import { useNavigate } from 'react-router';
import { useAuth } from '../../auth/hooks/useAuth';
import '../style/navbar.scss';

const Navbar = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  const onLogoutClick = async (e) => {
    e.preventDefault();
    await handleLogout();
    navigate('/login');
  };

  return (
    <div className='nav-bar'>
      <div className='user-greet'>
        Hello &lt;<span className='username'>{user?.username || 'User'} </span> /&gt;
      </div>
      <div className='nav-heading'>AI Resume Builder with Custom Roadmap Generater </div>
      <button onClick={onLogoutClick} className='generate-btn'>Logout</button>
    </div>
  );
};

export default Navbar;
