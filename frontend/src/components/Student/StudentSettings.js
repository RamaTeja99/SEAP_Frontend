import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTokenInfo } from '../../utils/tokenUtils';
import { verifyUserPassword, updateStudentPassword, updateStudentProfilePhoto } from '../../api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';
import './StudentSettings.css';

const StudentSettings = () => {
    const navigate = useNavigate();
    const tokenInfo = getTokenInfo();
    const [activeSection, setActiveSection] = useState('password');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [message, setMessage] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const verifyPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await verifyUserPassword({
                username: tokenInfo.username,
                password: currentPassword
            });

            if (response.data) {
                setIsVerified(true);
                setMessage('Password verified. You can now update your password.');
            } else {
                setMessage('Current password is incorrect.');
            }
        } catch (error) {
            setMessage('Error verifying password. Please try again.');
            console.error('Verification error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await updateStudentPassword(tokenInfo.roleSpecificId, newPassword);

            if (response.data) {
                setMessage('Password updated successfully.');
                setCurrentPassword('');
                setNewPassword('');
                setIsVerified(false);
                handlePasswordChangeSuccess();
            }
        } catch (error) {
            setMessage('Error updating password. Please try again.');
            console.error('Update error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePhotoChange = (e) => {
        setProfilePhoto(e.target.files[0]);
    };

    const handleUploadPhoto = async () => {
        if (profilePhoto) {
            const formData = new FormData();
            formData.append("photo", profilePhoto);
            formData.append("username", tokenInfo.username);
            setIsLoading(true);
            try {
                const response = await updateStudentProfilePhoto(tokenInfo.roleSpecificId, formData);
                if (response.status === 201) { // Check for the correct status code (201 Created)
                    setMessage("Profile photo updated successfully.");
                } else {
                    setMessage("Error updating profile photo. Please try again.");
                }
            } catch (error) {
                console.error("Error uploading photo:", error);
                setMessage("Error updating profile photo. Please try again.");
            } finally {
                setIsLoading(false);
            }
        } else {
            setMessage("Please select a photo before uploading.");
        }
    };

    const handlePasswordChangeSuccess = () => {
        setMessage('Password updated successfully. Please log in again.');
        setTimeout(() => {
            // Logout logic here if needed
            window.location.reload();
        }, 2000);
    };

    if (!tokenInfo || tokenInfo.role !== 'student') {
        return <div className="container mt-4">Unauthorized access</div>;
    }

    return (
        <div className="settings-container">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <button onClick={() => navigate('/student/dashboard/achievements')}>
                    <FaArrowLeft />
                </button>
            </div>
            <header className="settings-header">
                <h1>Account Settings</h1>
                <nav className="settings-nav">
                    <button 
                        className={`nav-button ${activeSection === 'password' ? 'active' : ''}`}
                        onClick={() => setActiveSection('password')}
                    >
                        <i className="fas fa-key"></i>
                        Password
                    </button>
                    <button 
                        className={`nav-button ${activeSection === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveSection('profile')}
                    >
                        <i className="fas fa-user-circle"></i>
                        Profile Photo
                    </button>
                </nav>
            </header>

            <AnimatePresence mode="wait">
                <motion.div 
                    className="settings-content"
                    key={activeSection}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeSection === 'password' && (
                        <div className="settings-card">
                            <h2>Change Password</h2>
                            {!isVerified ? (
                                <motion.form 
                                    onSubmit={verifyPassword}
                                    initial={{ scale: 0.95 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="form-group">
                                        <label>Current Password</label>
                                        <input
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <motion.button 
                                        type="submit" 
                                        className="primary-button"
                                        disabled={isLoading}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {isLoading ? 'Verifying...' : 'Verify Password'}
                                    </motion.button>
                                </motion.form>
                            ) : (
                                <motion.form 
                                    onSubmit={handleUpdatePassword}
                                    initial={{ scale: 0.95 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="form-group">
                                        <label>New Password</label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                            disabled={isLoading}
                                            minLength={6}
                                        />
                                    </div>
                                    <motion.button 
                                        type="submit" 
                                        className="primary-button"
                                        disabled={isLoading}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {isLoading ? 'Updating...' : 'Update Password'}
                                    </motion.button>
                                </motion.form>
                            )}
                        </div>
                    )}

                    {activeSection === 'profile' && (
                        <div className="settings-card">
                            <h2>Change Profile Photo</h2>
                            <div className="photo-upload-container">
                                <div className="photo-preview-student">
                                    {profilePhoto ? (
                                        <img 
                                            src={URL.createObjectURL(profilePhoto)} 
                                            alt="Preview" 
                                        />
                                    ) : (
                                        <i className="fas fa-user-circle" ></i>
                                    )}
                                </div>
                                <div className="upload-controls">
                                    <label className="file-input-label">
                                        <i className="fas fa-cloud-upload-alt"></i>
                                        Choose Photo
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoChange}
                                            hidden
                                        />
                                    </label>
                                    <motion.button 
                                        onClick={handleUploadPhoto}
                                        className="primary-button"
                                        disabled={!profilePhoto || isLoading}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {isLoading ? 'Uploading...' : 'Upload Photo'}
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    )}

                    {message && (
                        <motion.div 
                            className={`message-toast ${message.includes('successfully') ? 'success' : 'info'}`}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                        >
                            {message}
                        </motion.div>
                    )}
                </motion.div>
            </AnimatePresence>

        </div>
    );
};

export default StudentSettings;
