import React from 'react';
import './IdleWarningModal.css';

const IdleWarningModal = ({ remainingTime, onLogout }) => {
    return (
        <div className="idle-modal-overlay">
            <div className="idle-modal">
                <h3>Session Timeout Warning</h3>
                <p>Your session will expire in {Math.ceil(remainingTime / 1000)} seconds due to inactivity.</p>
                <div className="idle-modal-buttons">
                    <button onClick={onLogout}>Logout Now</button>
                </div>
            </div>
        </div>
    );
};

export default IdleWarningModal;