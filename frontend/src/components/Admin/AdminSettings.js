import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTokenInfo } from '../../utils/tokenUtils';
import { verifyUserPassword, updateAdminUserPassword } from '../../api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';


const AdminSettings = () => {
    const navigate = useNavigate();
    const tokenInfo = getTokenInfo();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
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
            const response = await updateAdminUserPassword(tokenInfo.roleSpecificId, newPassword);

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

    const handlePasswordChangeSuccess = () => {
        setMessage('Password updated successfully. Please log in again.');
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    };

    if (!tokenInfo || tokenInfo.role !== 'admin') {
        return <div className="container mt-4">Unauthorized access</div>;
    }

    return (
        <div className="settings-container">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <button onClick={() => navigate('/admin/dashboard')}>
                    <FaArrowLeft />
                </button>
            </div>
            <header className="settings-header">
                <h1>Account Settings</h1>
            </header>

            <AnimatePresence>
                <motion.div
                    className="settings-content"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="settings-card">
                        <h2>Change Password</h2>
                        {!isVerified ? (
                            <motion.form onSubmit={verifyPassword}>
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
                                >
                                    {isLoading ? 'Verifying...' : 'Verify Password'}
                                </motion.button>
                            </motion.form>
                        ) : (
                            <motion.form onSubmit={handleUpdatePassword}>
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
                                >
                                    {isLoading ? 'Updating...' : 'Update Password'}
                                </motion.button>
                            </motion.form>
                        )}
                    </div>
                    {message && (
                        <motion.div className={`message-toast ${message.includes('successfully') ? 'success' : 'info'}`}>
                            {message}
                        </motion.div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default AdminSettings;