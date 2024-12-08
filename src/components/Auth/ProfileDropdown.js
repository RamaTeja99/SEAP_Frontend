import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getTokenInfo } from '../../utils/tokenUtils';
import Logout from './Logout';
import { getStudentProfilePhoto ,getCollegeProfilePhoto,getAdminProfilePhoto} from '../../api'; // Import your API function
import './ProfileDropdown.css';

const ProfileDropdown = ({ dashboardType }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);
    const tokenInfo = getTokenInfo();
    const dropdownRef = useRef(null);
    
    // Get username from token and capitalize first letter
    const username = tokenInfo?.username || '';
    const initial = username.charAt(0).toUpperCase();
    const displayName = initial + username.slice(1);
    
  
    // Fetch profile photo from the backend
    const fetchProfilePhoto = useCallback(async () => {
        let response;
        try {
            
            if (tokenInfo.role === 'student') {
             response = await getStudentProfilePhoto(tokenInfo.roleSpecificId, { responseType: 'blob' });
            } 
            else if (tokenInfo.role === 'college') {
             response = await getCollegeProfilePhoto(tokenInfo.roleSpecificId, { responseType: 'blob' });
            }
            else if(tokenInfo.role === 'admin'){
                response = await getAdminProfilePhoto(tokenInfo.roleSpecificId, { responseType: 'blob' });            
            }
            const url = URL.createObjectURL(response.data); // Create a URL from the Blob
            setProfilePhotoUrl(url);
        } catch (error) {
            console.error('Error fetching profile photo:', error);
            setProfilePhotoUrl(null); // Set to null if an error occurs
        }
    }, [tokenInfo.role,tokenInfo.roleSpecificId]);

    // Handle clicking outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch the profile photo when the component mounts or student ID changes
    useEffect(() => {
        fetchProfilePhoto();
    }, [fetchProfilePhoto]); // Now includes fetchProfilePhoto in dependencies

    // Toggle dropdown
    const toggleDropdown = () => setIsOpen(prevState => !prevState);

    // Handle link click
    const handleLinkClick = () => {
        setIsOpen(false);
    };

    return (
        <div className={`profile-dropdown ${dashboardType}`} ref={dropdownRef}>
            <div className="profile-icon" onClick={toggleDropdown}>
                {profilePhotoUrl ? (
                    <img src={profilePhotoUrl} alt={`${displayName}'s profile`} className="profile-image" />
                ) : (
                    <span>{initial}</span>
                )}
            </div>
            {isOpen && (
                <div className={`dropdown-menu ${isOpen ? 'open' : ''}`}>
                    <div className={`${dashboardType}-name`}>{displayName}</div>
                    <Link 
                        to={`/${dashboardType}/dashboard/edit-profile`} 
                        className="dropdown-item"
                        onClick={handleLinkClick}
                    >
                        Edit Profile
                    </Link>
                    <Link 
                        to={`/${dashboardType}/dashboard/settings`} 
                        className="dropdown-item"
                        onClick={handleLinkClick}
                    >
                        Settings
                    </Link>
                    <div className="logout-link" onClick={handleLinkClick}>
                        <Logout />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;
