import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../api';
import './Logout.css';

const Logout = () => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    const handleLogout = async () => {
        try {
            setIsClicked(true);
            await logout();
            sessionStorage.clear();
            localStorage.clear();
            
            setTimeout(() => {
                navigate('/login');
            }, 600);
        } catch (error) {
            console.error('Error during logout:', error);
            setIsClicked(false);
        }
    };

    return (
        <button 
            type="button"
            onClick={handleLogout}
            className={`logout-link ${isHovered ? 'hovered' : ''} ${isClicked ? 'clicked' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setIsClicked(false);
            }}
        >
            <span className={isHovered ? 'hovered' : ''}>Logout</span>
        </button>
    );
};

export default Logout;
