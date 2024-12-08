import React, { useState, useEffect } from 'react';
import { getCollegeById, updateCollege, updateCollegeCredentials, getCollegeUserByCollegeId } from '../../../api';
import { FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';
import './EditCollege.css';

const EditCollege = ({ collegeId, onClose }) => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); 
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchCollegeData = async () => {
            try {
                const collegeResponse = await getCollegeById(collegeId);
                const college = collegeResponse.data;
                setName(college.name);
                setLocation(college.location);
                setEmail(college.email);

                const userResponse = await getCollegeUserByCollegeId(collegeId);
                const collegeUser = userResponse.data;
                setUsername(collegeUser.username);
                setPassword(collegeUser.password);
            } catch (error) {
                console.error('Failed to fetch college or user data:', error);
            }
        };

        fetchCollegeData();
    }, [collegeId]);

    const handleUpdate = async (e) => {
        e.preventDefault();

        // Validate username and password length
        if (username.length < 8) {
            setMessage({ type: 'error', text: 'Username must be exactly 8 characters long.' });
            return;
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            setMessage({ type: 'error', text: 'Password must be at least 8 characters long and include letters, numbers, and symbols.' });
            return;
        }

        try {
            const updatedCollege = { name, location, email };
            await updateCollege(collegeId, updatedCollege);
            await updateCollegeCredentials(collegeId, username, password);

            setMessage({ type: 'success', text: 'College updated successfully!' });
            setTimeout(() => {
                setMessage(null);
                onClose(); 
            }, 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update college. Please try again.' });
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <div className={`editcollege-container`}>
            <form onSubmit={handleUpdate} className="editcollege-form">
                <h2 className="editcollege-form-header">Edit College</h2>
                <FaTimes className="close-icon" onClick={onClose} />
                
                <div className="editcollege-form-group">
                    <label htmlFor="name" className="editcollege-form-label">College Name</label>
                    <input 
                        type="text" 
                        id="name"
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                        className="editcollege-form-input"
                    />
                </div>
                <div className="editcollege-form-group">
                    <label htmlFor="location" className="editcollege-form-label">Location</label>
                    <input 
                        type="text" 
                        id="location"
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)} 
                        required 
                        className="editcollege-form-input"
                    />
                </div>
                <div className="editcollege-form-group">
                    <label htmlFor="email" className="editcollege-form-label">Email</label>
                    <input 
                        type="email" 
                        id="email"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        className="editcollege-form-input"
                    />
                </div>
                <div className="editcollege-form-group">
                    <label htmlFor="username" className="editcollege-form-label">Username</label>
                    <input 
                        type="text" 
                        id="username"
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                        className="editcollege-form-input"
                    />
                </div>
                <div className="editcollege-form-group">
                    <label htmlFor="password" className="editcollege-form-label">Password</label>
                    <input 
                        type={isPasswordVisible ? 'text' : 'password'}
                        id="password"
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        className="editcollege-form-input"
                    />
                    <span className="toggle-password-icon" onClick={togglePasswordVisibility}>
                        {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
                <button type="submit" className="editcollege-submit-button">Update College</button>
                {message && (
                    <div className={`editcollege-${message.type}-message`}>
                        {message.text}
                    </div>
                )}
            </form>
        </div>
    );
};

export default EditCollege;
